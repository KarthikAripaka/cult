import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sampleProducts } from '@/data/products';

// Get single product by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  // Check if Supabase is configured
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                                process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co';
  
  // Use mock data if Supabase is not configured
  if (!isSupabaseConfigured) {
    const product = sampleProducts.find(p => p.slug === params.slug);
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Get related products (same category, excluding current)
    const relatedProducts = sampleProducts
      .filter(p => p.category_id === product.category_id && p.id !== product.id)
      .slice(0, 4);
    
    // Get reviews (mock data for demo)
    const reviews = [
      {
        id: '1',
        user: { name: 'John D.', avatar: null },
        rating: 5,
        comment: 'Excellent quality! Perfect fit and amazing fabric.',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        user: { name: 'Sarah M.', avatar: null },
        rating: 4,
        comment: 'Great product, exactly as shown in the pictures.',
        created_at: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      {
        id: '3',
        user: { name: 'Mike R.', avatar: null },
        rating: 5,
        comment: 'Fast shipping and the product exceeded my expectations!',
        created_at: new Date(Date.now() - 86400000 * 7).toISOString()
      }
    ];
    
    return NextResponse.json({
      product,
      relatedProducts,
      reviews,
      averageRating: 4.7,
      totalReviews: 127
    });
  }
  
  // Use Supabase database
  try {
    // Fetch product by slug
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .eq('slug', params.slug)
      .single();
    
    if (error || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Get related products (same category, excluding current)
    const { data: relatedProducts } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', product.category_id)
      .neq('id', product.id)
      .limit(4);
    
    // Get reviews for this product
    const { data: reviews } = await supabase
      .from('reviews')
      .select(`
        *,
        users (
          id,
          name,
          avatar_url
        )
      `)
      .eq('product_id', product.id)
      .order('created_at', { ascending: false });
    
    // Calculate average rating
    let averageRating = 0;
    let totalReviews = 0;
    if (reviews && reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      averageRating = Math.round((totalRating / reviews.length) * 10) / 10;
      totalReviews = reviews.length;
    }
    
    return NextResponse.json({
      product,
      relatedProducts: relatedProducts || [],
      reviews: reviews || [],
      averageRating,
      totalReviews
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
