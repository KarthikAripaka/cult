import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  try {
    if (code) {
      const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .gte('valid_until', new Date().toISOString())
        .single();
      
      if (error || !coupon) {
        return NextResponse.json({ error: 'Invalid or expired coupon code' }, { status: 404 });
      }
      
      return NextResponse.json({ coupon });
    }
    
    const { data: coupons, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('is_active', true)
      .gte('valid_until', new Date().toISOString())
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return NextResponse.json({ coupons: coupons || [] });
  } catch (error) {
    console.error('Coupons fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, orderTotal } = body;
    
    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }
    
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();
    
    if (error || !coupon) {
      return NextResponse.json({ error: 'Invalid or expired coupon code' }, { status: 404 });
    }
    
    // Check validity
    if (new Date(coupon.valid_until) < new Date()) {
      return NextResponse.json({ error: 'This coupon has expired' }, { status: 400 });
    }
    
    // Check minimum order value
    if (orderTotal < coupon.min_order_value) {
      return NextResponse.json({ 
        error: `Minimum order value of ₹${coupon.min_order_value} required` 
      }, { status: 400 });
    }
    
    // Calculate discount
    const discount = coupon.discount_type === 'percentage'
      ? Math.min((orderTotal * coupon.discount_value) / 100, coupon.max_discount || 10000)
      : coupon.discount_value;
    
    return NextResponse.json({ 
      success: true, 
      coupon: {
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        discount,
        description: coupon.description,
      },
      discount 
    });
  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
  }
}
