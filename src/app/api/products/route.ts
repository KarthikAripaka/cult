import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Get all products with optional filtering
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const type = searchParams.get('type') || 'products';
  const category = searchParams.get('category');
  const search = searchParams.get('q');
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const sizes = searchParams.get('sizes');
  const colors = searchParams.get('colors');
  const isFeatured = searchParams.get('is_featured');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  
  // Return categories
  if (type === 'categories') {
    try {
      const { data: categoriesData, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      console.log('Categories query result:', { count: categoriesData?.length, error });
      
      if (error) throw error;
      return NextResponse.json({ categories: categoriesData || [] });
    } catch (error) {
      console.error('Categories fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch categories', details: String(error) }, { status: 500 });
    }
  }
  
  // Return coupons
  if (type === 'coupons') {
    try {
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
  
  // Return reviews for a product
  if (type === 'reviews') {
    const productId = searchParams.get('productId');
    try {
      let query = supabase
        .from('reviews')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      
      if (productId) {
        query = query.eq('product_id', productId);
      }
      
      const { data: reviews, error } = await query;
      if (error) throw error;
      return NextResponse.json({ reviews: reviews || [] });
    } catch (error) {
      console.error('Reviews fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
  }
  
  // Return shipping rates
  if (type === 'shipping') {
    try {
      const { data: shippingRates, error } = await supabase
        .from('shipping_zones')
        .select('*')
        .eq('is_active', true)
        .order('base_rate', { ascending: true });
      if (error) throw error;
      return NextResponse.json({ shippingRates: shippingRates || [] });
    } catch (error) {
      console.error('Shipping fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch shipping rates' }, { status: 500 });
    }
  }
  
  // Return single product by slug
  const productSlug = searchParams.get('slug');
  if (productSlug) {
    try {
      const { data: product, error } = await supabase
        .from('products')
        .select('*, categories(*)')
        .eq('slug', productSlug)
        .eq('is_active', true)
        .single();
      
      if (error || !product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      
      // Get reviews
      const { data: reviews } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', product.id)
        .eq('is_approved', true);
      
      const avgRating = reviews?.length > 0 
        ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / (reviews?.length || 1)
        : 0;
      
      return NextResponse.json({
        product: { ...product, reviews: reviews || [], avgRating }
      });
    } catch (error) {
      console.error('Product fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
  }
  
  // Get all products
  try {
    let query = supabase
      .from('products')
      .select('*, categories(id, name, slug)', { count: 'exact' })
      .eq('is_active', true);
      
    if (isFeatured === 'true') {
      query = query.eq('is_featured', true);
    }
    
    if (category && category !== 'all') {
      if (category === 'new-arrivals') {
        query = query.eq('is_new', true);
      } else {
        const { data: categoryData } = await supabase
          .from('categories').select('id').eq('slug', category).single();
        if (categoryData) {
          query = query.eq('category_id', categoryData.id);
        }
      }
    }
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    if (minPrice) query = query.gte('price', parseFloat(minPrice));
    if (maxPrice) query = query.lte('price', parseFloat(maxPrice));
    
    // For size/color filtering, we need to join with product_variants
    // The filtering will be done client-side after fetching products
    
    switch (sort) {
      case 'price-asc': query = query.order('price', { ascending: true }); break;
      case 'price-desc': query = query.order('price', { ascending: false }); break;
      case 'popular': query = query.order('stock', { ascending: true }); break;
      default: query = query.order('created_at', { ascending: false });
    }
    
    const from = (page - 1) * limit;
    query = query.range(from, from + limit - 1);
    
    const { data: products, error, count } = await query;
    
    if (error) throw error;
    
    return NextResponse.json({
      products: products || [],
      pagination: {
        page, limit,
        totalProducts: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasMore: page < Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
