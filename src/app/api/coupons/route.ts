import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Mock coupons data (fallback)
const mockCoupons = [
  { code: 'WELCOME10', discount: 10, discount_type: 'percentage', min_order: 0, max_discount: 100, is_active: true, created_at: new Date().toISOString() },
  { code: 'FLAT500', discount: 500, discount_type: 'fixed', min_order: 2000, max_discount: null, is_active: true, created_at: new Date().toISOString() },
  { code: 'SUMMER20', discount: 20, discount_type: 'percentage', min_order: 500, max_discount: 500, is_active: true, created_at: new Date().toISOString() },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  // Check if Supabase is configured
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                                process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co';
  
  // Use mock data if Supabase is not configured
  if (!isSupabaseConfigured) {
    if (code) {
      const coupon = mockCoupons.find(c => c.code.toLowerCase() === code.toLowerCase() && c.is_active);
      
      if (!coupon) {
        return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 });
      }
      
      return NextResponse.json({ coupon });
    }
    
    return NextResponse.json({ coupons: mockCoupons.filter(c => c.is_active) });
  }
  
  // Use Supabase database
  try {
    if (code) {
      const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single();
      
      if (error || !coupon) {
        return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 });
      }
      
      return NextResponse.json({ coupon });
    }
    
    const { data: coupons, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('is_active', true);
    
    if (error) {
      console.error('Error fetching coupons:', error);
      return NextResponse.json({ coupons: mockCoupons.filter(c => c.is_active) });
    }
    
    return NextResponse.json({ coupons: coupons || mockCoupons.filter(c => c.is_active) });
  } catch (error) {
    console.error('Error in coupons API:', error);
    return NextResponse.json({ coupons: mockCoupons.filter(c => c.is_active) });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, orderTotal } = body;
    
    // Check if Supabase is configured
    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                                  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co';
    
    // Use mock data if Supabase is not configured
    if (!isSupabaseConfigured) {
      const coupon = mockCoupons.find(c => c.code.toLowerCase() === code.toLowerCase() && c.is_active);
      
      if (!coupon) {
        return NextResponse.json({ error: 'Invalid or expired coupon code' }, { status: 404 });
      }
      
      if (orderTotal < coupon.min_order) {
        return NextResponse.json({ error: `Minimum order value of ₹${coupon.min_order} required` }, { status: 400 });
      }
      
      const discount = coupon.discount_type === 'percentage'
        ? Math.min((orderTotal * coupon.discount) / 100, coupon.max_discount || 10000)
        : coupon.discount;
      
      return NextResponse.json({
        success: true,
        coupon,
        discount
      });
    }
    
    // Use Supabase database
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();
    
    if (error || !coupon) {
      return NextResponse.json({ error: 'Invalid or expired coupon code' }, { status: 404 });
    }
    
    if (orderTotal < coupon.min_order) {
      return NextResponse.json({ error: `Minimum order value of ₹${coupon.min_order} required` }, { status: 400 });
    }
    
    const discount = coupon.discount_type === 'percentage'
      ? Math.min((orderTotal * coupon.discount) / 100, coupon.max_discount || 10000)
      : coupon.discount;
    
    return NextResponse.json({
      success: true,
      coupon,
      discount
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
  }
}
