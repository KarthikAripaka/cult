import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { products, categories, getFeaturedProducts, getNewProducts, searchProducts, filterProducts } from '@/data/products';

// Check if Supabase is configured
function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co' &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your-anon-key'
  );
}

// Get all products with optional filtering
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const type = searchParams.get('type') || 'products';
  const category = searchParams.get('category');
  const search = searchParams.get('q');
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const isFeatured = searchParams.get('is_featured');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const includeInactive = searchParams.get('includeInactive') === 'true';
  
  // Use demo data if Supabase is not configured
  if (!isSupabaseConfigured()) {
    // Return categories
    if (type === 'categories') {
      return NextResponse.json({ categories });
    }
    
    // Return coupons (demo)
    if (type === 'coupons') {
      return NextResponse.json({ coupons: [] });
    }
    
    // Return reviews (demo)
    if (type === 'reviews') {
      return NextResponse.json({ reviews: [] });
    }
    
    // Get all products with filtering
    let filteredProducts = [...products];
    
    // Filter by featured
    if (isFeatured === 'true') {
      filteredProducts = getFeaturedProducts();
    }
    
    // Filter by category
    if (category && category !== 'all') {
      const categoryMap: Record<string, string> = {
        'shirts': 'Shirts',
        'hoodies': 'Hoodies',
        'pants': 'Pants',
        'baggies': 'Baggies',
        'torn-jeans': 'Torn Jeans',
        'new-arrivals': 'new',
      };
      
      if (category === 'new-arrivals') {
        filteredProducts = getNewProducts();
      } else {
        const categoryName = categoryMap[category] || category;
        filteredProducts = filteredProducts.filter(p => 
          p.category.toLowerCase() === categoryName.toLowerCase()
        );
      }
    }
    
    // Search
    if (search) {
      filteredProducts = searchProducts(search);
    }
    
    // Price filter
    if (minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
    }
    
    // Sort
    switch (sort) {
      case 'price-asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filteredProducts.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    // Pagination
    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / limit);
    const startIndex = (page - 1) * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);
    
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
  // Return categories
  if (type === 'categories') {
    try {
      let query = supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (!includeInactive) {
        query = query.eq('is_active', true);
      }
      
      const { data: categoriesData, error } = await query;
      
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
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return NextResponse.json({ coupons: coupons || [] });
    } catch (error) {
      console.error('Coupons fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch coupons', details: String(error) }, { status: 500 });
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
      return NextResponse.json({ error: 'Failed to fetch reviews', details: String(error) }, { status: 500 });
    }
  }
  
  // Get all products
  try {
    let query = supabase
      .from('products')
      .select('*, categories(id, name, slug)', { count: 'exact' });
      
    if (!includeInactive) {
      query = query.eq('is_active', true);
    }
    
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
    
    // For each product, fetch variants to get sizes/colors and format category
    const productsWithVariants = await Promise.all(
      (products || []).map(async (product) => {
        const { data: variants } = await supabase
          .from('product_variants')
          .select('size, color')
          .eq('product_id', product.id)
          .eq('is_active', true);
        
        const sizes = Array.from(new Set(variants?.map(v => v.size).filter(Boolean)));
        const colors = Array.from(new Set(variants?.map(v => v.color).filter(Boolean)));
        
        // Format category as a string for easy display
        const categoryName = product.categories?.name || 'Uncategorized';
        
        return { 
          ...product, 
          sizes, 
          colors,
          category: categoryName,
          category_id: product.category_id
        };
      })
    );
    
    return NextResponse.json({
      products: productsWithVariants || [],
      pagination: {
        page, limit,
        totalProducts: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasMore: page < Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch products', details: String(error) }, { status: 500 });
  }
}
