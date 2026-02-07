import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// GET wishlist
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const { data: wishlistItems, error } = await supabase
      .from('wishlists')
      .select(`
        *,
        products:id (
          id,
          name,
          slug,
          price,
          original_price,
          images,
          category_id,
          stock,
          is_active
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Wishlist fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch wishlist' },
        { status: 500 }
      );
    }

    // Filter out items where product is no longer active
    const items = wishlistItems
      ?.filter(item => item.products && item.products.is_active)
      .map(item => ({
        id: item.id,
        product_id: item.product_id,
        name: item.products.name,
        slug: item.products.slug,
        price: item.products.price,
        original_price: item.products.original_price,
        image: item.products.images?.[0],
        stock: item.products.stock,
        added_at: item.created_at,
      })) || [];

    return NextResponse.json({ items });

  } catch (error) {
    console.error('Wishlist API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add to wishlist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId } = body;

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'User ID and Product ID are required' },
        { status: 400 }
      );
    }

    // Check if product exists
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', productId)
      .eq('is_active', true)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found or unavailable' },
        { status: 404 }
      );
    }

    // Check if already in wishlist
    const { data: existing, error: checkError } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Product already in wishlist' },
        { status: 400 }
      );
    }

    const { error: insertError } = await supabase
      .from('wishlists')
      .insert({
        user_id: userId,
        product_id: productId,
        created_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error('Wishlist insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to add to wishlist' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Added to wishlist',
    });

  } catch (error) {
    console.error('Wishlist add error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Remove from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const productId = searchParams.get('productId');
    const wishlistId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (wishlistId) {
      // Remove by wishlist ID
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('id', wishlistId)
        .eq('user_id', userId);

      if (error) {
        console.error('Wishlist delete error:', error);
        return NextResponse.json(
          { error: 'Failed to remove from wishlist' },
          { status: 500 }
        );
      }
    } else if (productId) {
      // Remove by product ID
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);

      if (error) {
        console.error('Wishlist delete error:', error);
        return NextResponse.json(
          { error: 'Failed to remove from wishlist' },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Product ID or Wishlist ID is required' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Removed from wishlist',
    });

  } catch (error) {
    console.error('Wishlist delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
