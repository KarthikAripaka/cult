import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: NextRequest) {
  console.log('=== Auth Callback Started ===');
  
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    const state = searchParams.get('state');

    console.log('URL Params:', { code: !!code, error, errorDescription, state });
    console.log('Full URL:', request.url);

    // Handle OAuth errors from Google
    if (error) {
      console.error('OAuth Error from Google:', error, errorDescription);
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent(errorDescription || error)}`, request.url)
      );
    }

    // If no code provided, something went wrong
    if (!code) {
      console.error('No authorization code received');
      console.log('This usually means:');
      console.log('1. Redirect URL not configured in Google Cloud Console');
      console.log('2. Site URL not configured in Supabase');
      console.log('3. User denied the OAuth request');
      
      return NextResponse.redirect(
        new URL('/auth/login?error=no_code&message=Authorization failed - check redirect URLs', request.url)
      );
    }

    console.log('Authorization code received, exchanging for session...');

    // Exchange the code for a session
    const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) {
      console.error('Session Exchange Error:', sessionError);
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent(sessionError.message)}`, request.url)
      );
    }

    const user = sessionData?.user;
    console.log('Session created for user:', user?.id, user?.email);

    if (!user) {
      console.error('No user in session');
      return NextResponse.redirect(
        new URL('/auth/login?error=no_user', request.url)
      );
    }

    // Check if user profile exists, if not create one
    console.log('Checking profiles table for user:', user.id);
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Profile fetch error:', fetchError);
    }

    if (!existingProfile) {
      console.log('Creating new profile for user:', user.id);
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'Google User',
          avatar_url: user.user_metadata?.avatar_url,
          is_admin: false,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
      } else {
        console.log('Profile created successfully');
      }
    } else {
      console.log('Existing profile found:', existingProfile.id);
    }

    // Fetch profile to check is_admin status
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    console.log('User role:', profile?.is_admin ? 'ADMIN' : 'REGULAR');

    // Redirect based on user role
    if (profile?.is_admin) {
      console.log('Redirecting to /admin');
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    console.log('Redirecting to / (home)');
    return NextResponse.redirect(new URL('/', request.url));

  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(
      new URL('/auth/login?error=unexpected_error', request.url)
    );
  }
}
