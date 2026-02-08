import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { categories } from '@/data/products';

// Check if Supabase is configured
function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co' &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your-anon-key'
  );
}

export async function GET() {
  // Use demo categories if Supabase is not configured
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ categories });
  }
  
  // Use Supabase database
  try {
    const { data: categoriesData, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ categories: categoriesData || [] });
  } catch (error) {
    console.error('Categories fetch error:', error);
    // Fallback to demo categories on error
    return NextResponse.json({ categories });
  }
}
