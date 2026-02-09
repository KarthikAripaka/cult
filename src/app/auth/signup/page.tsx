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

export default function SignupPage() {
  const router = useRouter();
  const { setUser, setLoading: setStoreLoading } = useAuthStore();
  
  const [loading, setLocalLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Email/Password Signup
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !name) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLocalLoading(true);
    setStoreLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        setStoreLoading(false);
        setLocalLoading(false);
        return;
      }

      if (data.user) {
        // Create profile
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email,
            name: name,
            is_admin: false,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();
        
        if (profileError) {
          console.error('Profile creation error:', profileError);
        }
        
        if (profile) {
          setUser(profile);
        }
        
        toast.success('Welcome to CULT!');
        router.push('/');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      setStoreLoading(false);
      setLocalLoading(false);
    }
  };

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
        setLocalLoading(false);
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
            <h1 className="text-2xl font-bold mt-6 mb-2">Create Account</h1>
            <p className="text-gray-600">Join the Cult community</p>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailSignup} className="space-y-4 mb-6">
            <Input
              type="text"
              label="Full Name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
                placeholder="Create password (min. 8 characters)"
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
            <Input
              type={showPassword ? 'text' : 'password'}
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            
            <Button
              type="submit"
              className="w-full"
              isLoading={loading}
            >
              Create Account
            </Button>
          </form>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center mb-6">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-orange-500 hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-orange-500 hover:underline">Privacy Policy</Link>
          </p>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* Demo Signup Button */}
          <Button
            variant="outline"
            className="w-full mb-4"
            onClick={handleDemoSignup}
            disabled={loading}
          >
            Try Demo Mode
          </Button>

          {/* Google Sign Up */}
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-3"
            onClick={handleGoogleSignUp}
            disabled={loading}
          >
            <FcGoogle size={22} />
            Sign up with Google
          </Button>

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
