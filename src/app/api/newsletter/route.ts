import { NextRequest, NextResponse } from 'next/server';
import { handleAPIError, createError } from '@/lib/api-error';
import { VALIDATION_PATTERNS } from '@/constants/shipping';

// In-memory subscribers storage (replace with database in production)
const subscribers: Set<string> = new Set();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      throw createError.badRequest('Email is required');
    }

    if (!VALIDATION_PATTERNS.EMAIL.test(email)) {
      throw createError.badRequest('Please enter a valid email address');
    }

    if (subscribers.has(email)) {
      throw createError.conflict('Email already subscribed');
    }

    subscribers.add(email);

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter!'
    });
  } catch (error) {
    const { error: errorMessage, code } = handleAPIError(error);
    return NextResponse.json({ error: errorMessage, code }, { status: code === 'CONFLICT' ? 409 : 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      throw createError.badRequest('Email is required');
    }

    if (!subscribers.has(email)) {
      throw createError.notFound('Email not found in subscribers');
    }

    subscribers.delete(email);

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });
  } catch (error) {
    const { error: errorMessage, code } = handleAPIError(error);
    return NextResponse.json({ error: errorMessage, code }, { status: 400 });
  }
}
