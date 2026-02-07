import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// In-memory orders storage (fallback when Supabase is not configured)
const orders: any[] = [];

// Get user's orders
export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Check if Supabase is configured
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                                process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co';
  
  // Use in-memory storage if Supabase is not configured
  if (!isSupabaseConfigured) {
    const userOrders = orders.filter(o => o.user_id === userId);
    return NextResponse.json({ orders: userOrders });
  }
  
  // Use Supabase database
  try {
    const { data: ordersData, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
    
    return NextResponse.json({ orders: ordersData || [] });
  } catch (error) {
    console.error('Error in cart GET:', error);
    const userOrders = orders.filter(o => o.user_id === userId);
    return NextResponse.json({ orders: userOrders });
  }
}

// Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, items, shipping_address, payment_method, coupon_code } = body;
    
    if (!user_id || !items || !shipping_address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Check if Supabase is configured
    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                                  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co';
    
    // Calculate totals
    const subtotal = items.reduce((total: number, item: any) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
    
    const shipping = subtotal > 2000 ? 0 : 150;
    const tax = Math.round(subtotal * 0.18 * 100) / 100;
    
    // Apply coupon if provided
    let discount = 0;
    if (coupon_code) {
      const mockCoupons: any[] = [
        { code: 'WELCOME10', discount: 10, discount_type: 'percentage', min_order: 0, max_discount: 100 },
        { code: 'FLAT500', discount: 500, discount_type: 'fixed', min_order: 2000 },
      ];
      
      const coupon = mockCoupons.find(c => c.code.toLowerCase() === coupon_code.toLowerCase());
      
      if (coupon) {
        if (coupon.discount_type === 'percentage') {
          discount = Math.min((subtotal * coupon.discount) / 100, coupon.max_discount || 10000);
        } else {
          discount = coupon.discount;
        }
      }
    }
    
    const total = subtotal + shipping + tax - discount;
    
    // Use in-memory storage if Supabase is not configured
    if (!isSupabaseConfigured) {
      const order = {
        id: crypto.randomUUID(),
        user_id,
        items: JSON.stringify(items),
        subtotal,
        tax,
        shipping,
        discount,
        total,
        status: 'pending',
        shipping_address: JSON.stringify(shipping_address),
        payment_method: payment_method || 'cod',
        payment_status: 'pending',
        coupon_code,
        created_at: new Date().toISOString(),
      };
      
      orders.push(order);
      
      return NextResponse.json({
        success: true,
        order,
        message: 'Order placed successfully!'
      });
    }
    
    // Use Supabase database
    const order = {
      user_id,
      items: JSON.stringify(items),
      subtotal,
      tax,
      shipping,
      discount,
      total,
      status: 'pending',
      shipping_address: JSON.stringify(shipping_address),
      payment_method: payment_method || 'cod',
      payment_status: 'pending',
      coupon_code: coupon_code || null,
      created_at: new Date().toISOString(),
    };
    
    const { data: insertedOrder, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating order:', error);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      order: insertedOrder,
      message: 'Order placed successfully!'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
