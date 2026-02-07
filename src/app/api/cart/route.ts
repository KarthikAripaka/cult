import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { handleAPIError, createError } from '@/lib/api-error';
import { SHIPPING_THRESHOLD, SHIPPING_COST, TAX_RATE } from '@/constants/shipping';

const orders: any[] = [];

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  
  if (!userId) {
    throw createError.unauthorized('Please login to view orders');
  }
  
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                                process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co';
  
  if (!isSupabaseConfigured) {
    const userOrders = orders.filter(o => o.user_id === userId);
    return NextResponse.json({ orders: userOrders });
  }
  
  try {
    const { data: ordersData, error } = await supabase
      .from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    
    if (error) throw error;
    return NextResponse.json({ orders: ordersData || [] });
  } catch (error) {
    const { error: errorMessage } = handleAPIError(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, items, shipping_address, payment_method, coupon_code } = body;
    
    if (!user_id || !items || !shipping_address) {
      throw createError.badRequest('Missing required fields');
    }
    
    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                                  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co';
    
    const subtotal = items.reduce((total: number, item: any) => 
      total + (item.product?.price || 0) * item.quantity, 0);
    
    const shipping = subtotal > SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    
    let discount = 0;
    if (coupon_code) {
      const mockCoupons: any[] = [
        { code: 'WELCOME10', discount: 10, discount_type: 'percentage', min_order: 0 },
        { code: 'FLAT500', discount: 500, discount_type: 'fixed', min_order: 2000 },
      ];
      const coupon = mockCoupons.find(c => c.code.toLowerCase() === coupon_code.toLowerCase());
      if (coupon) {
        discount = coupon.discount_type === 'percentage'
          ? Math.min((subtotal * coupon.discount) / 100, 10000)
          : coupon.discount;
      }
    }
    
    const total = subtotal + shipping + tax - discount;
    
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
      coupon_code,
      created_at: new Date().toISOString(),
    };
    
    if (!isSupabaseConfigured) {
      const newOrder = { id: crypto.randomUUID(), ...order };
      orders.push(newOrder);
      return NextResponse.json({ success: true, order: newOrder, message: 'Order placed successfully!' });
    }
    
    const { data: insertedOrder, error } = await supabase
      .from('orders').insert(order).select().single();
    
    if (error) throw error;
    
    return NextResponse.json({ success: true, order: insertedOrder, message: 'Order placed successfully!' });
  } catch (error) {
    const { error: errorMessage } = handleAPIError(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
