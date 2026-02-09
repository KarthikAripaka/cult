'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuthStore } from '@/store';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setLoading: setStoreLoading } = useAuthStore();
  
  const [loading, setLocalLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Email/Password Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setLocalLoading(true);
    setStoreLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        setStoreLoading(false);
        setLocalLoading(false);
        return;
      }

      if (data.user) {
        // Fetch user profile from users table
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          setUser(profile);
        } else {
          // Create profile if doesn't exist
          const { data: newProfile } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email: data.user.email,
              name: data.user.user_metadata?.name || email.split('@')[0],
              is_admin: false,
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select()
            .single();
          
          if (newProfile) {
            setUser(newProfile);
          }
        }
        
        toast.success('Welcome back!');
        router.push('/');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      setStoreLoading(false);
      setLocalLoading(false);
    }
  };

  // Google Sign In
  const handleGoogleSignIn = async () => {
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
        setLocalLoading(false);
      }
      // Redirect will happen automatically by Supabase
    } catch (error) {
      toast.error('An error occurred with Google sign in');
      setStoreLoading(false);
      setLocalLoading(false);
    }
  };

  // Demo login
  const handleDemoLogin = () => {
    setLocalLoading(true);
    setStoreLoading(true);
    
    setTimeout(() => {
      setUser({
        id: 'demo-user',
        email: 'demo@cult.com',
        name: 'Demo User',
        avatar_url: undefined,
        phone: undefined,
        is_admin: false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
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
            <h1 className="text-2xl font-bold mt-6 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
            <Input
              type="email"
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-500 hover:text-black text-sm"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            
            <Button
              type="submit"
              className="w-full"
              isLoading={loading}
            >
              Sign In
            </Button>
          </form>

          {/* Forgot Password Link */}
          <div className="text-right mb-4">
            <Link href="/auth/forgot-password" className="text-sm text-orange-500 hover:underline">
              Forgot Password?
            </Link>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* Demo Login Button */}
          <Button
            variant="outline"
            className="w-full mb-4"
            onClick={handleDemoLogin}
            disabled={loading}
          >
            Continue as Demo User
          </Button>

          {/* Google Sign In */}
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-3"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <FcGoogle size={22} />
            Continue with Google
          </Button>

          {/* Register Link */}
          <p className="text-center text-gray-600 mt-6">
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
