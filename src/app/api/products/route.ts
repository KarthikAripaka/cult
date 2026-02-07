import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sampleProducts } from '@/data/products';

// Get all products with optional filtering
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
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
  
  // Check if Supabase is configured
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                                process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co';
  
  // Use mock data if Supabase is not configured
  if (!isSupabaseConfigured) {
    let products = [...sampleProducts];
    
    // Filter by featured
    if (isFeatured === 'true') {
      products = products.filter(p => p.is_featured);
    }
    
    // Filter by category
    if (category && category !== 'all') {
      if (category === 'new-arrivals') {
        products = products.filter(p => p.is_new);
      } else if (category === 'sale') {
        products = products.filter(p => p.original_price && p.original_price > p.price);
      } else {
        products = products.filter(p => p.category_id === category);
      }
    }
    
    // Search products
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by price range
    if (minPrice) {
      products = products.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      products = products.filter(p => p.price <= parseFloat(maxPrice));
    }
    
    // Filter by sizes
    if (sizes) {
      const sizeArray = sizes.split(',');
      products = products.filter(p => 
        p.sizes.some(s => sizeArray.includes(s))
      );
    }
    
    // Filter by colors
    if (colors) {
      const colorArray = colors.split(',');
      products = products.filter(p => 
        p.colors.some(c => colorArray.some(ca => c.toLowerCase().includes(ca.toLowerCase())))
      );
    }
    
    // Sort products
    switch (sort) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        products.sort((a, b) => a.stock - b.stock);
        break;
      case 'newest':
      default:
        products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    
    // Pagination
    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / limit);
    const startIndex = (page - 1) * limit;
    const paginatedProducts = products.slice(startIndex, startIndex + limit);
    
    return NextResponse.json({
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        totalProducts,
        totalPages,
        hasMore: page < totalPages
      }
    });
  }
  
  // Use Supabase database
  try {
    // Build the query
    let query = supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `, { count: 'exact' });
    
    // Filter by featured
    if (isFeatured === 'true') {
      query = query.eq('is_featured', true);
    }
    
    // Filter by category
    if (category && category !== 'all') {
      if (category === 'new-arrivals') {
        query = query.eq('is_new', true);
      } else if (category === 'sale') {
        query = query.lt('price', supabase.rpc('original_price')!).gte('original_price', 1);
      } else {
        // Get category by slug
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', category)
          .single();
        
        if (categoryData) {
          query = query.eq('category_id', categoryData.id);
        }
      }
    }
    
    // Search products
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    // Filter by price range
    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice));
    }
    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice));
    }
    
    // Filter by sizes
    if (sizes) {
      const sizeArray = sizes.split(',');
      query = query.overlaps('sizes', sizeArray);
    }
    
    // Filter by colors
    if (colors) {
      const colorArray = colors.split(',');
      query = query.overlaps('colors', colorArray);
    }
    
    // Sort products
    switch (sort) {
      case 'price-asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price-desc':
        query = query.order('price', { ascending: false });
        break;
      case 'popular':
        query = query.order('stock', { ascending: true });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
    }
    
    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);
    
    const { data: products, error, count } = await query;
    
    if (error) {
      console.error('Error fetching products:', error);
      // Fallback to mock data on error
      return NextResponse.json({
        products: sampleProducts.slice(0, limit),
        pagination: {
          page,
          limit,
          totalProducts: sampleProducts.length,
          totalPages: Math.ceil(sampleProducts.length / limit),
          hasMore: false
        }
      });
    }
    
    const totalProducts = count || 0;
    const totalPages = Math.ceil(totalProducts / limit);
    
    return NextResponse.json({
      products: products || [],
      pagination: {
        page,
        limit,
        totalProducts,
        totalPages,
        hasMore: page < totalPages
      }
    });
  } catch (error) {
    console.error('Error in products API:', error);
    // Fallback to mock data on error
    return NextResponse.json({
      products: sampleProducts.slice(0, limit),
      pagination: {
        page,
        limit,
        totalProducts: sampleProducts.length,
        totalPages: Math.ceil(sampleProducts.length / limit),
        hasMore: false
      }
    });
  }
}
