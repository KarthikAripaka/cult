import { NextRequest, NextResponse } from 'next/server';

// Newsletter API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // In production, you would:
    // 1. Add to your email marketing service (Mailchimp, SendGrid, etc.)
    // 2. Store in your database
    // 3. Send confirmation email
    
    // For demo purposes, just return success
    console.log('Newsletter subscription:', email);

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter!',
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
