import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// GET cart items
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

    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products:id (
          id,
          name,
          slug,
          price,
          images,
          stock,
          sizes,
          colors
        )
      `)
      .eq('user_id', userId)
      .eq('products.is_active', true);

    if (error) {
      console.error('Cart fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch cart' },
        { status: 500 }
      );
    }

    // Filter out items where product is no longer active
    const activeCartItems = cartItems?.filter(item => item.products) || [];

    // Calculate totals
    const items = activeCartItems.map(item => ({
      id: item.id,
      product_id: item.product_id,
      name: item.products.name,
      slug: item.products.slug,
      price: item.products.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      image: item.products.images?.[0],
      max_stock: item.products.stock,
    }));

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return NextResponse.json({
      items,
      subtotal,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    });

  } catch (error) {
    console.error('Cart API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add item to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId, quantity = 1, size, color } = body;

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'User ID and Product ID are required' },
        { status: 400 }
      );
    }

    // Check product exists and is active
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, name, price, stock, is_active')
      .eq('id', productId)
      .single();

    if (productError || !product || !product.is_active) {
      return NextResponse.json(
        { error: 'Product not found or unavailable' },
        { status: 404 }
      );
    }

    // Check stock
    if (product.stock < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    // Check if item already in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('size', size || null)
      .eq('color', color || null)
      .single();

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      
      if (product.stock < newQuantity) {
        return NextResponse.json(
          { error: 'Insufficient stock' },
          { status: 400 }
        );
      }

      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', existingItem.id);

      if (updateError) {
        console.error('Cart update error:', updateError);
        return NextResponse.json(
          { error: 'Failed to update cart' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Cart updated',
        quantity: newQuantity,
      });
    }

    // Add new item
    const { error: insertError } = await supabase
      .from('cart_items')
      .insert({
        user_id: userId,
        product_id: productId,
        quantity,
        size,
        color,
        added_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error('Cart insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to add to cart' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Added to cart',
    });

  } catch (error) {
    console.error('Cart add error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update cart item quantity
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, cartItemId, quantity } = body;

    if (!userId || !cartItemId || quantity < 1) {
      return NextResponse.json(
        { error: 'Valid User ID, Cart Item ID and quantity are required' },
        { status: 400 }
      );
    }

    // Get cart item with product
    const { data: cartItem, error: fetchError } = await supabase
      .from('cart_items')
      .select('*, products:product_id(stock)')
      .eq('id', cartItemId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Check stock
    if (cartItem.products?.stock < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId);

    if (updateError) {
      console.error('Cart update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update cart' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Cart updated',
    });

  } catch (error) {
    console.error('Cart update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const cartItemId = searchParams.get('id');

    if (!userId || !cartItemId) {
      return NextResponse.json(
        { error: 'User ID and Cart Item ID are required' },
        { status: 400 }
      );
    }

    const { error: deleteError } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId)
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Cart delete error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to remove from cart' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Removed from cart',
    });

  } catch (error) {
    console.error('Cart delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
