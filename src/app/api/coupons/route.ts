import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { handleAPIError, createError } from '@/lib/api-error';

const mockCoupons = [
  { code: 'WELCOME10', discount: 10, discount_type: 'percentage', min_order: 0, max_discount: 100, is_active: true },
  { code: 'FLAT500', discount: 500, discount_type: 'fixed', min_order: 2000, max_discount: null, is_active: true },
  { code: 'SUMMER20', discount: 20, discount_type: 'percentage', min_order: 500, max_discount: 500, is_active: true },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                                process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co';
  
  if (!isSupabaseConfigured) {
    if (code) {
      const coupon = mockCoupons.find(c => c.code.toLowerCase() === code.toLowerCase() && c.is_active);
      if (!coupon) throw createError.notFound('Invalid coupon code');
      return NextResponse.json({ coupon });
    }
    return NextResponse.json({ coupons: mockCoupons.filter(c => c.is_active) });
  }
  
  try {
    if (code) {
      const { data: coupon, error } = await supabase
        .from('coupons').select('*').eq('code', code.toUpperCase()).eq('is_active', true).single();
      if (error || !coupon) throw createError.notFound('Invalid coupon code');
      return NextResponse.json({ coupon });
    }
    
    const { data: coupons, error } = await supabase.from('coupons').select('*').eq('is_active', true);
    if (error) throw error;
    return NextResponse.json({ coupons: coupons || mockCoupons });
  } catch (error) {
    const { error: errorMessage } = handleAPIError(error);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, orderTotal } = body;
    
    if (!code) throw createError.badRequest('Coupon code is required');
    
    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                                  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co';
    
    let coupon;
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('coupons').select('*').eq('code', code.toUpperCase()).eq('is_active', true).single();
      if (error || !data) throw createError.notFound('Invalid or expired coupon code');
      coupon = data;
    } else {
      coupon = mockCoupons.find(c => c.code.toLowerCase() === code.toLowerCase() && c.is_active);
      if (!coupon) throw createError.notFound('Invalid or expired coupon code');
    }
    
    if (orderTotal < coupon.min_order) {
      throw createError.badRequest(`Minimum order value of ₹${coupon.min_order} required`);
    }
    
    const discount = coupon.discount_type === 'percentage'
      ? Math.min((orderTotal * coupon.discount) / 100, coupon.max_discount || 10000)
      : coupon.discount;
    
    return NextResponse.json({ success: true, coupon, discount });
  } catch (error) {
    const { error: errorMessage } = handleAPIError(error);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
