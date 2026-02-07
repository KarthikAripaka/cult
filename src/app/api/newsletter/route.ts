import { NextRequest, NextResponse } from 'next/server';

// Mock newsletter subscriptions
const subscribers: string[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }
    
    if (subscribers.includes(email)) {
      return NextResponse.json({ error: 'Email already subscribed' }, { status: 400 });
    }
    
    subscribers.push(email);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter!' 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
