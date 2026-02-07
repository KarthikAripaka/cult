import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Initialize Supabase clients
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
}

interface ShippingAddress {
  name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

// Generate order number
function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `ORD${year}${month}${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      items, 
      shippingAddress, 
      subtotal, 
      shippingCost, 
      taxAmount, 
      discountAmount, 
      total, 
      couponCode,
      userId 
    } = body;

    // Validate required fields
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

    // Create Razorpay order
    const razorpayOrderId = `razorpay_${uuidv4()}`;
    const amountInPaise = Math.round(total * 100);

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
        receipt: generateOrderNumber(),
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
    const orderNumber = generateOrderNumber();
    
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: userId || null,
        guest_email: shippingAddress.email || null,
        guest_phone: shippingAddress.phone,
        items: items.map((item: CartItem) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          size: item.size,
          color: item.color,
        })),
        subtotal,
        shipping_cost: shippingCost,
        tax_amount: taxAmount,
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
    await supabaseAdmin.from('payments').insert({
      order_id: order.id,
      razorpay_order_id: razorpayOrder.id,
      amount: total,
      currency: 'INR',
      status: 'pending',
      created_at: new Date().toISOString(),
    });

    // Clear user's cart if logged in
    if (userId) {
      await supabaseAdmin
        .from('cart_items')
        .delete()
        .eq('user_id', userId);
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: orderNumber,
      razorpayOrderId: razorpayOrder.id,
      keyId: RAZORPAY_KEY_ID,
      amount: total,
      currency: 'INR',
    });

  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
