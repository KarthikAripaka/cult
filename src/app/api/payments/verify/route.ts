import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderId 
    } = body;

    // Verify signature
    const signature = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(signature)
      .digest('hex');

    const isValidSignature = razorpay_signature === expectedSignature;

    if (!isValidSignature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Update order payment status
    const { error: orderError } = await supabaseAdmin
      .from('orders')
      .update({
        payment_status: 'paid',
        payment_id: razorpay_payment_id,
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature,
        paid_at: new Date().toISOString(),
        status: 'confirmed',
        status_history: [
          ...(await getOrderStatusHistory(orderId)),
          {
            status: 'confirmed',
            description: 'Payment verified successfully',
            created_at: new Date().toISOString(),
          },
        ],
      })
      .eq('id', orderId);

    if (orderError) {
      console.error('Order update error:', orderError);
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }

    // Update payment record
    await supabaseAdmin
      .from('payments')
      .update({
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature,
        status: 'paid',
        method: 'razorpay',
        updated_at: new Date().toISOString(),
      })
      .eq('razorpay_order_id', razorpay_order_id);

    // Get order details for notification
    const { data: order } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (order?.user_id) {
      // Create notification
      await supabaseAdmin.from('notifications').insert({
        user_id: order.user_id,
        type: 'order_confirmed',
        title: 'Order Confirmed! 🎉',
        message: `Your order ${order.order_number} has been confirmed. We'll start processing it soon.`,
        data: { order_id: order.id, order_number: order.order_number },
        created_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      orderId: orderId,
      orderNumber: order?.order_number,
      paymentStatus: 'paid',
    });

  } catch (error) {
    console.error('Payment verification error:', error);
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
