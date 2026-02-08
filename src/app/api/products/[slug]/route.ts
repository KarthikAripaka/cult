import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Product, products, getRecommendedProducts } from '@/data/products';

// Get single product by slug with recommended products
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  // Check if Supabase is configured
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                                process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co';
  
  const slug = params?.slug;

  // Use demo data if Supabase is not configured
  if (!isSupabaseConfigured) {
    // Find product by slug (handle both slug formats)
    let product = products.find(p => p.slug === slug);
    
    // Also try matching the old format (replace-hyphens-with-spaces)
    if (!product) {
      const slugWithoutHyphens = slug?.replace(/-/g, ' ');
      product = products.find(p => 
        p.name.toLowerCase().replace(/\s+/g, '-') === slug || 
        p.name.toLowerCase().replace(/\s+/g, '-') === slugWithoutHyphens
      );
    }
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Get recommended products (same category + different category for variety)
    const recommendedProducts = getRecommendedProducts(product.id, 8);
    
    // Get reviews (mock data for demo)
    const reviews = [
      {
        id: '1',
        user: { name: 'John D.', avatar: null },
        rating: product.rating,
        comment: 'Excellent quality! Perfect fit and amazing fabric.',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        user: { name: 'Sarah M.', avatar: null },
        rating: product.rating - 0.5,
        comment: 'Great product, exactly as shown in the pictures.',
        created_at: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      {
        id: '3',
        user: { name: 'Mike R.', avatar: null },
        rating: product.rating + 0.5,
        comment: 'Fast shipping and the product exceeded my expectations!',
        created_at: new Date(Date.now() - 86400000 * 7).toISOString()
      }
    ];
    
    return NextResponse.json({
      product,
      recommendedProducts,
      relatedProducts: recommendedProducts.slice(0, 4), // For backward compatibility
      reviews,
      averageRating: product.rating,
      totalReviews: product.reviewCount
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
      .eq('slug', slug)
      .single();
    
    if (error || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Get recommended products from same category and different categories
    const { data: sameCategory } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', product.category_id)
      .neq('id', product.id)
      .limit(5);
    
    const { data: differentCategory } = await supabase
      .from('products')
      .select('*')
      .neq('category_id', product.category_id)
      .neq('id', product.id)
      .limit(3)
      .order('avg_rating', { ascending: false });
    
    // Combine and shuffle for recommendations
    const recommendedProducts = [...(sameCategory || []), ...(differentCategory || [])]
      .sort(() => Math.random() - 0.5)
      .slice(0, 8);
    
    // Get related products (same category only)
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
      recommendedProducts,
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
