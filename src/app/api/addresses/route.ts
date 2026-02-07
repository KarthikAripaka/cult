import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// GET addresses for user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const addressId = searchParams.get('id');
    const includeInactive = searchParams.get('includeInactive') === 'true';

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (addressId) {
      // Get single address
      let query = supabase
        .from('addresses')
        .select('*')
        .eq('id', addressId)
        .eq('user_id', userId);

      if (!includeInactive) {
        query = query.eq('is_active', true);
      }

      const { data: address, error } = await query.single();

      if (error || !address) {
        return NextResponse.json(
          { error: 'Address not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ address });
    }

    // Get all addresses for user
    let query = supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    const { data: addresses, error } = await query;

    if (error) {
      console.error('Addresses fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch addresses' },
        { status: 500 }
      );
    }

    return NextResponse.json({ addresses: addresses || [] });

  } catch (error) {
    console.error('Addresses API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create new address
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      name,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      country = 'India',
      latitude,
      longitude,
      addressType = 'home',
      isDefault = false,
    } = body;

    // Validate required fields
    if (!userId || !name || !phone || !addressLine1 || !city || !state || !pincode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId);
    }

    const { data: address, error } = await supabase
      .from('addresses')
      .insert({
        user_id: userId,
        name,
        phone,
        address_line1: addressLine1,
        address_line2: addressLine2,
        city,
        state,
        pincode,
        country,
        latitude,
        longitude,
        address_type: addressType,
        is_default: isDefault,
        is_active: true,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Address creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create address' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      address,
    });

  } catch (error) {
    console.error('Address creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update address
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      addressId,
      userId,
      name,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      country,
      latitude,
      longitude,
      addressType,
      isDefault,
    } = body;

    if (!addressId || !userId) {
      return NextResponse.json(
        { error: 'Address ID and User ID are required' },
        { status: 400 }
      );
    }

    // Verify address belongs to user
    const { data: existingAddress, error: fetchError } = await supabase
      .from('addresses')
      .select('id')
      .eq('id', addressId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !existingAddress) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      );
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId);
    }

    const updateData: any = {
      name,
      phone,
      address_line1: addressLine1,
      address_line2: addressLine2,
      city,
      state,
      pincode,
      country,
      latitude,
      longitude,
      address_type: addressType,
      is_default: isDefault,
      updated_at: new Date().toISOString(),
    };

    const { data: address, error } = await supabase
      .from('addresses')
      .update(updateData)
      .eq('id', addressId)
      .select()
      .single();

    if (error) {
      console.error('Address update error:', error);
      return NextResponse.json(
        { error: 'Failed to update address' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      address,
    });

  } catch (error) {
    console.error('Address update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete address (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const addressId = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!addressId || !userId) {
      return NextResponse.json(
        { error: 'Address ID and User ID are required' },
        { status: 400 }
      );
    }

    // Soft delete - set is_active to false
    const { error } = await supabase
      .from('addresses')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', addressId)
      .eq('user_id', userId);

    if (error) {
      console.error('Address deletion error:', error);
      return NextResponse.json(
        { error: 'Failed to delete address' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully',
    });

  } catch (error) {
    console.error('Address deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
