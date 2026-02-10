'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setLoading: setStoreLoading } = useAuthStore();
  
  const [loading, setLoading] = useState(false);

  // Google Sign In - shows email suggestions to prevent fake emails
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setStoreLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://qhmfvgqzcspufsvjrrvb.supabase.co/auth/v1/callback',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent', // Forces email selection from Google account
          },
        },
      });

      if (error) {
        toast.error(error.message);
        setStoreLoading(false);
        setLoading(false);
      }
      // Redirect will happen automatically by Supabase
    } catch (error) {
      toast.error('An error occurred with Google sign in');
      setStoreLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <motion.span
                className="text-3xl font-bold tracking-tighter"
                whileHover={{ scale: 1.05 }}
              >
                CULT
              </motion.span>
            </Link>
            <h1 className="text-2xl font-bold mt-6 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {/* Google Sign In - Shows email picker from Google */}
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-3 py-4"
            onClick={handleGoogleSignIn}
            isLoading={loading}
          >
            <FcGoogle size={24} />
            Continue with Google
          </Button>

          <p className="text-xs text-gray-500 text-center mt-4">
            We'll show your Google accounts to choose from
          </p>

          {/* Register Link */}
          <p className="text-center text-gray-600 mt-8">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-orange-500 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
