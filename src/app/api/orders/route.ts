import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Only create client if credentials are available
const getSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
};

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && 
    supabaseUrl !== 'https://your-project.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key');
};

// Validate UUID format
const isValidUUID = (id: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// GET orders for logged-in user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const orderId = searchParams.get('id');
    const orderNumber = searchParams.get('orderNumber');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const supabase = getSupabaseClient();

    // Return empty orders if Supabase is not configured, no user, or invalid userId
    if (!isSupabaseConfigured() || !userId || !isValidUUID(userId)) {
      return NextResponse.json({
        orders: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 1,
        },
      });
    }

    if (orderId) {
      // Get single order
      const { data: order, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error || !order) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      // Ensure user can only see their own orders
      if (order.user_id && order.user_id !== userId) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      return NextResponse.json({ order });
    }

    if (orderNumber) {
      // Get order by order number
      const { data: order, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber)
        .single();

      if (error || !order) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ order });
    }

    // Build query for user's orders
    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: orders, error, count } = await query;

    if (error) {
      console.error('Orders fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      orders: orders || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });

  } catch (error) {
    console.error('Orders API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update order status (admin only or user cancel)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, status, description, userId, isAdmin } = body;

    const supabase = getSupabaseClient();

    // Return error if Supabase is not configured
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Order ID and status are required' },
        { status: 400 }
      );
    }

    // Get current order
    const { data: currentOrder, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (fetchError || !currentOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check authorization
    if (!isAdmin && currentOrder.user_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate status transition
    const validTransitions: Record<string, string[]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered', 'out_for_delivery'],
      out_for_delivery: ['delivered'],
      delivered: [],
      cancelled: [],
    };

    const allowedStatuses = validTransitions[currentOrder.status] || [];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Cannot transition from ${currentOrder.status} to ${status}` },
        { status: 400 }
      );
    }

    // Build status history
    const statusHistory = [
      ...(currentOrder.status_history || []),
      {
        status,
        description: description || `Order ${status}`,
        created_at: new Date().toISOString(),
      },
    ];

    // Update order
    const updateData: any = {
      status,
      status_history: statusHistory,
      updated_at: new Date().toISOString(),
    };

    // Handle cancellation - restore stock
    if (status === 'cancelled' && currentOrder.payment_status === 'paid') {
      updateData.payment_status = 'refunded';
      
      // Restore stock for each item
      for (const item of currentOrder.items || []) {
        const { data: product } = await supabase
          .from('products')
          .select('id, stock')
          .eq('id', item.id)
          .single();

        if (product) {
          await supabase
            .from('products')
            .update({ stock: (product.stock || 0) + item.quantity })
            .eq('id', product.id);
        }
      }
    }

    const { error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId);

    if (updateError) {
      console.error('Order update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }

    // Create notification for user
    if (currentOrder.user_id) {
      await supabase.from('notifications').insert({
        user_id: currentOrder.user_id,
        type: 'order_status_changed',
        title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: `Your order ${currentOrder.order_number} is now ${status}.`,
        data: { order_id: orderId, status },
        created_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: `Order ${status} successfully`,
    });

  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
