import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { handleAPIError, createError } from '@/lib/api-error';
import { VALIDATION_PATTERNS } from '@/constants/shipping';

// Sign up
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      throw createError.badRequest('Email and password are required');
    }

    if (!VALIDATION_PATTERNS.EMAIL.test(email)) {
      throw createError.badRequest('Please enter a valid email address');
    }

    if (password.length < 8) {
      throw createError.badRequest('Password must be at least 8 characters');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || '',
        },
      },
    });

    if (error) {
      throw createError.badRequest(error.message);
    }

    return NextResponse.json({
      success: true,
      user: data.user,
      message: 'Registration successful! Please check your email to verify.'
    });
  } catch (error) {
    const { error: errorMessage, code } = handleAPIError(error);
    return NextResponse.json({ error: errorMessage, code }, { status: 400 });
  }
}

// Sign in
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      throw createError.badRequest('Email and password are required');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw createError.unauthorized('Invalid email or password');
    }

    return NextResponse.json({
      success: true,
      user: data.user,
      session: data.session
    });
  } catch (error) {
    const { error: errorMessage, code } = handleAPIError(error);
    return NextResponse.json({ error: errorMessage, code }, { status: 401 });
  }
}

// Sign out
export async function DELETE() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw createError.internal(error.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully signed out'
    });
  } catch (error) {
    const { error: errorMessage } = handleAPIError(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
