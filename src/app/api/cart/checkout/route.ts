import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const getSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
};

const getSupabaseAdminClient = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!supabaseUrl || !serviceKey) {
    return null;
  }
  return createClient(supabaseUrl, serviceKey);
};

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

const SHIPPING_THRESHOLD = 1499;
const SHIPPING_COST = 99;
const TAX_RATE = 0.18;

function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `ORD${year}${month}${random}`;
}

// POST - Create checkout and place order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      items,
      shippingAddress,
      paymentMethod = 'razorpay',
      couponCode,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    if (!shippingAddress || !shippingAddress.pincode) {
      return NextResponse.json(
        { error: 'Shipping address is required' },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + (item.price || 0) * item.quantity,
      0
    );
    const shipping = subtotal > SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    const total = subtotal + shipping + tax;
    const discountAmount = 0;

    const supabase = getSupabaseClient();
    const supabaseAdmin = getSupabaseAdminClient();

    const isDemoMode = !supabaseAdmin || !RAZORPAY_KEY_ID;

    if (isDemoMode) {
      // Demo mode - create order without payment
      const orderNumber = generateOrderNumber();
      
      return NextResponse.json({
        success: true,
        demoMode: true,
        order: {
          id: uuidv4(),
          order_number: orderNumber,
          items: items,
          subtotal,
          shipping_cost: shipping,
          tax_amount: tax,
          discount_amount: discountAmount,
          total,
          status: 'confirmed',
          payment_status: 'paid',
          shipping_address: shippingAddress,
          created_at: new Date().toISOString(),
        },
        orderId: orderNumber,
        message: 'Order placed successfully in demo mode',
      });
    }

    // Real payment flow with Razorpay
    if (paymentMethod === 'razorpay' && RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
      const orderNumber = generateOrderNumber();
      const razorpayOrderId = `razorpay_${uuidv4()}`;
      const amountInPaise = Math.round(total * 100);

      // Create Razorpay order
      const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64')}`,
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          order_id: razorpayOrderId,
          receipt: orderNumber,
          notes: {
            coupon_code: couponCode || '',
            customer_id: userId || 'guest',
          },
          payment_capture: 1,
        }),
      });

      if (!razorpayResponse.ok) {
        const errorData = await razorpayResponse.json();
        console.error('Razorpay API error:', errorData);
        return NextResponse.json(
          { error: 'Failed to create payment order' },
          { status: 500 }
        );
      }

      const razorpayOrder = await razorpayResponse.json();

      // Create order in database with pending status
      const { data: order, error: orderError } = await supabaseAdmin!
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: userId || null,
          guest_email: shippingAddress.email || null,
          guest_phone: shippingAddress.phone,
          items: items.map((item: any) => ({
            id: item.id,
            product_id: item.product_id || item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            size: item.size,
            color: item.color,
          })),
          subtotal,
          shipping_cost: shipping,
          tax_amount: tax,
          discount_amount: discountAmount,
          total,
          coupon_code: couponCode,
          shipping_address: {
            name: shippingAddress.name,
            phone: shippingAddress.phone,
            address_line1: shippingAddress.address_line1,
            address_line2: shippingAddress.address_line2,
            city: shippingAddress.city,
            state: shippingAddress.state,
            pincode: shippingAddress.pincode,
            country: shippingAddress.country || 'India',
          },
          payment_method: 'razorpay',
          payment_status: 'pending',
          razorpay_order_id: razorpayOrder.id,
          status: 'pending',
          status_history: [{
            status: 'pending',
            description: 'Order created, awaiting payment',
            created_at: new Date().toISOString(),
          }],
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        return NextResponse.json(
          { error: 'Failed to create order' },
          { status: 500 }
        );
      }

      // Create payment record
      await supabaseAdmin!.from('payments').insert({
        order_id: order.id,
        razorpay_order_id: razorpayOrder.id,
        amount: total,
        currency: 'INR',
        status: 'pending',
        created_at: new Date().toISOString(),
      });

      // Clear user's cart if logged in
      if (userId) {
        await supabaseAdmin!
          .from('cart_items')
          .delete()
          .eq('user_id', userId);
      }

      return NextResponse.json({
        success: true,
        demoMode: false,
        order: {
          id: order.id,
          order_number: orderNumber,
          razorpayOrderId: razorpayOrder.id,
        },
        orderId: order.id,
        orderNumber: orderNumber,
        razorpayOrderId: razorpayOrder.id,
        keyId: RAZORPAY_KEY_ID,
        amount: total,
        currency: 'INR',
      });
    } else {
      // Cash on Delivery
      const orderNumber = generateOrderNumber();

      const { data: order, error: orderError } = await supabaseAdmin!
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: userId || null,
          guest_email: shippingAddress.email || null,
          guest_phone: shippingAddress.phone,
          items: items.map((item: any) => ({
            id: item.id,
            product_id: item.product_id || item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            size: item.size,
            color: item.color,
          })),
          subtotal,
          shipping_cost: shipping,
          tax_amount: tax,
          discount_amount: discountAmount,
          total,
          coupon_code: couponCode,
          shipping_address: {
            name: shippingAddress.name,
            phone: shippingAddress.phone,
            address_line1: shippingAddress.address_line1,
            address_line2: shippingAddress.address_line2,
            city: shippingAddress.city,
            state: shippingAddress.state,
            pincode: shippingAddress.pincode,
            country: shippingAddress.country || 'India',
          },
          payment_method: 'cod',
          payment_status: 'pending',
          status: 'confirmed',
          status_history: [{
            status: 'confirmed',
            description: 'Order placed with Cash on Delivery',
            created_at: new Date().toISOString(),
          }],
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        return NextResponse.json(
          { error: 'Failed to create order' },
          { status: 500 }
        );
      }

      // Clear user's cart if logged in
      if (userId) {
        await supabaseAdmin!
          .from('cart_items')
          .delete()
          .eq('user_id', userId);
      }

      return NextResponse.json({
        success: true,
        demoMode: false,
        order: {
          id: order.id,
          order_number: orderNumber,
        },
        orderId: order.id,
        orderNumber: orderNumber,
        message: 'Order placed successfully with Cash on Delivery',
      });
    }

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
