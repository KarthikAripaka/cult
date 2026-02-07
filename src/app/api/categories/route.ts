import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Mock categories data (fallback)
const mockCategories = [
  { id: '1', name: 'New Arrivals', slug: 'new-arrivals', image_url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80', created_at: new Date().toISOString() },
  { id: '2', name: 'Men', slug: 'men', image_url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80', created_at: new Date().toISOString() },
  { id: '3', name: 'Women', slug: 'women', image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80', created_at: new Date().toISOString() },
  { id: '4', name: 'Accessories', slug: 'accessories', image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80', created_at: new Date().toISOString() },
  { id: '5', name: 'Sale', slug: 'sale', image_url: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&q=80', created_at: new Date().toISOString() },
];

// Get all categories
export async function GET() {
  // Check if Supabase is configured
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                                process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co';
  
  // Use mock data if Supabase is not configured
  if (!isSupabaseConfigured) {
    return NextResponse.json({ categories: mockCategories });
  }
  
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json({ categories: mockCategories });
    }
    
    return NextResponse.json({ categories: categories || mockCategories });
  } catch (error) {
    console.error('Error in categories API:', error);
    return NextResponse.json({ categories: mockCategories });
  }
}
