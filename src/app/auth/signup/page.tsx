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

export default function SignupPage() {
  const router = useRouter();
  const { setUser, setLoading: setStoreLoading } = useAuthStore();
  
  const [loading, setLocalLoading] = useState(false);

  // Google Sign Up
  const handleGoogleSignUp = async () => {
    setLocalLoading(true);
    setStoreLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        toast.error(error.message);
        setStoreLoading(false);
      }
      // Redirect will happen automatically by Supabase
    } catch (error) {
      toast.error('An error occurred with Google sign up');
      setStoreLoading(false);
      setLocalLoading(false);
    }
  };

  // Demo signup
  const handleDemoSignup = () => {
    setLocalLoading(true);
    setStoreLoading(true);
    
    setTimeout(() => {
      setUser({
        id: 'demo-user',
        email: 'demo@cult.com',
        name: 'Demo User',
        is_admin: false,
        created_at: new Date().toISOString(),
      });
      toast.success('Welcome to Demo Mode!');
      setLocalLoading(false);
      setStoreLoading(false);
      router.push('/');
    }, 500);
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
            <h1 className="text-2xl font-bold mt-6 mb-2">Create Account</h1>
            <p className="text-gray-600">Join the Cult community</p>
          </div>

          {/* Demo Signup Button */}
          <Button
            variant="outline"
            className="w-full mb-6"
            onClick={handleDemoSignup}
            disabled={loading}
          >
            Try Demo Mode
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* Google Sign Up */}
          <Button
            variant="outline"
            className="w-full mb-4 flex items-center justify-center gap-3"
            onClick={handleGoogleSignUp}
            disabled={loading}
          >
            <FcGoogle size={22} />
            Sign up with Google
          </Button>

          {/* Info Box */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 text-center">
              Create your account with <span className="font-semibold">Google</span> for quick and secure access.
            </p>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-orange-500 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
