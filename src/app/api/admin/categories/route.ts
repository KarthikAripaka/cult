import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// GET all categories (admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const includeInactive = searchParams.get('includeInactive') === 'true';

    let query = supabaseAdmin
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data: categories, error } = await query;

    if (error) {
      console.error('Categories fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      categories: categories || [],
    });
  } catch (error) {
    console.error('Admin categories API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create category (admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, image_url, sort_order } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const { data: existingCategory } = await supabaseAdmin
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this slug already exists' },
        { status: 400 }
      );
    }

    const { data: category, error } = await supabaseAdmin
      .from('categories')
      .insert({
        id: uuidv4(),
        name,
        slug,
        description,
        image_url,
        sort_order: sort_order || 0,
        is_active: true,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Category creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create category' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error('Category creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update category (admin)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { categoryId, ...updateData } = body;

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    // Check if category exists
    const { data: existingCategory, error: fetchError } = await supabaseAdmin
      .from('categories')
      .select('id')
      .eq('id', categoryId)
      .single();

    if (fetchError || !existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check slug uniqueness if being updated
    if (updateData.slug) {
      const { data: slugExists } = await supabaseAdmin
        .from('categories')
        .select('id')
        .eq('slug', updateData.slug)
        .neq('id', categoryId)
        .single();

      if (slugExists) {
        return NextResponse.json(
          { error: 'Category with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const { data: category, error } = await supabaseAdmin
      .from('categories')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', categoryId)
      .select()
      .single();

    if (error) {
      console.error('Category update error:', error);
      return NextResponse.json(
        { error: 'Failed to update category' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error('Category update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete category (admin) - soft delete
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('id');

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    // Check if category has products
    const { data: productsUsingCategory } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('category_id', categoryId)
      .limit(1);

    if (productsUsingCategory && productsUsingCategory.length > 0) {
      // Soft delete - set is_active to false
      const { error } = await supabaseAdmin
        .from('categories')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', categoryId);

      if (error) {
        console.error('Category deletion error:', error);
        return NextResponse.json(
          { error: 'Failed to delete category' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Category deactivated (has associated products)',
      });
    }

    // Hard delete if no products
    const { error } = await supabaseAdmin
      .from('categories')
      .delete()
      .eq('id', categoryId);

    if (error) {
      console.error('Category deletion error:', error);
      return NextResponse.json(
        { error: 'Failed to delete category' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Category deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
