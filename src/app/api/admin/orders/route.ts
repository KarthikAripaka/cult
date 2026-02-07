import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// GET all orders (admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const search = searchParams.get('search');

    let query = supabaseAdmin
      .from('orders')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (paymentStatus) {
      query = query.eq('payment_status', paymentStatus);
    }

    if (search) {
      query = query.or(`order_number.ilike.%${search}%,guest_email.ilike.%${search}%`);
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
    console.error('Admin orders API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update order status (admin)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, status, description, trackingNumber, carrier } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Order ID and status are required' },
        { status: 400 }
      );
    }

    // Get current order
    const { data: currentOrder, error: fetchError } = await supabaseAdmin
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

    // Build status history
    const statusHistory = [
      ...(currentOrder.status_history || []),
      {
        status,
        description: description || `Order ${status} by admin`,
        created_at: new Date().toISOString(),
      },
    ];

    // Build update data
    const updateData: any = {
      status,
      status_history: statusHistory,
      updated_at: new Date().toISOString(),
    };

    // Add tracking info if provided
    if (trackingNumber) {
      updateData.tracking_number = trackingNumber;
    }
    if (carrier) {
      updateData.carrier = carrier;
    }

    // Set delivered date if status is delivered
    if (status === 'delivered') {
      updateData.delivered_at = new Date().toISOString();
    }

    const { error: updateError } = await supabaseAdmin
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
      await supabaseAdmin.from('notifications').insert({
        user_id: currentOrder.user_id,
        type: 'order_status_changed',
        title: `Order Update: ${status}`,
        message: `Your order ${currentOrder.order_number} status has been updated to ${status}.`,
        data: { order_id: orderId, status, tracking_number: trackingNumber },
        created_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
    });

  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete order (admin) - soft delete by cancelling
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Soft delete - set status to cancelled
    const { error } = await supabaseAdmin
      .from('orders')
      .update({
        status: 'cancelled',
        status_history: [
          ...(await getOrderStatusHistory(orderId)),
          {
            status: 'cancelled',
            description: 'Order cancelled by admin',
            created_at: new Date().toISOString(),
          },
        ],
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (error) {
      console.error('Order cancellation error:', error);
      return NextResponse.json(
        { error: 'Failed to cancel order' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order cancelled successfully',
    });

  } catch (error) {
    console.error('Order cancellation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getOrderStatusHistory(orderId: string): Promise<any[]> {
  const { data: order } = await supabaseAdmin
    .from('orders')
    .select('status_history')
    .eq('id', orderId)
    .single();
  
  return order?.status_history || [];
}
