import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sampleProducts } from '@/data/products';
import { handleAPIError, createError } from '@/lib/api-error';

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
  
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                                process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co';
  
  // Use mock data if Supabase is not configured
  if (!isSupabaseConfigured) {
    let products = [...sampleProducts];
    
    if (isFeatured === 'true') {
      products = products.filter(p => p.is_featured);
    }
    
    if (category && category !== 'all') {
      if (category === 'new-arrivals') {
        products = products.filter(p => p.is_new);
      } else if (category === 'sale') {
        products = products.filter(p => p.original_price && p.original_price > p.price);
      } else {
        products = products.filter(p => p.category_id === category);
      }
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }
    
    if (minPrice) {
      products = products.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      products = products.filter(p => p.price <= parseFloat(maxPrice));
    }
    
    if (sizes) {
      const sizeArray = sizes.split(',');
      products = products.filter(p => p.sizes.some(s => sizeArray.includes(s)));
    }
    
    if (colors) {
      const colorArray = colors.split(',');
      products = products.filter(p => 
        p.colors.some(c => colorArray.some(ca => c.toLowerCase().includes(ca.toLowerCase())))
      );
    }
    
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
      default:
        products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    
    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / limit);
    const startIndex = (page - 1) * limit;
    const paginatedProducts = products.slice(startIndex, startIndex + limit);
    
    return NextResponse.json({
      products: paginatedProducts,
      pagination: { page, limit, totalProducts, totalPages, hasMore: page < totalPages }
    });
  }
  
  try {
    let query = supabase
      .from('products')
      .select('*, categories(id, name, slug)', { count: 'exact' });
    
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
    if (sizes) query = query.overlaps('sizes', sizes.split(','));
    if (colors) query = query.overlaps('colors', colors.split(','));
    
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
    const { error: errorMessage } = handleAPIError(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
