'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiShoppingBag, FiTrash2, FiArrowRight, FiLoader, FiAlertCircle } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store';
import toast from 'react-hot-toast';

interface WishlistItem {
  id: string;
  product_id: string;
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  image: string;
  stock: number;
  category_id: string;
  added_at?: string;
}

export default function WishlistPage() {
  const { user } = useAuthStore();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch wishlist from API
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/wishlist?userId=${user.id}`);
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
        } else if (data.items) {
          setWishlist(data.items);
        }
      } catch (err) {
        setError('Failed to fetch wishlist. Please try again.');
        console.error('Error fetching wishlist:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user?.id]);

  const handleRemove = async (productId: string) => {
    if (!user?.id) {
      toast.error('Please login to manage wishlist');
      return;
    }

    try {
      await fetch(`/api/wishlist?userId=${user.id}&productId=${productId}`, {
        method: 'DELETE',
      });
      setWishlist(prev => prev.filter(p => p.id !== productId));
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error('Failed to remove from wishlist');
    }
  };

  const handleAddToCart = (item: WishlistItem) => {
    if (!user?.id) {
      toast.error('Please login to add items to cart');
      return;
    }
    toast.success('Added to cart');
    handleRemove(item.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
          <FiLoader className="animate-spin text-2xl text-gray-400" />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <FiAlertCircle className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Wishlist</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8"
            >
              <FiHeart size={80} className="mx-auto text-gray-300" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-4">Login to View Wishlist</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Save items you love to your wishlist by logging into your account.
            </p>
            <Link href="/auth/login">
              <Button size="lg">
                Login
                <FiArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8"
            >
              <FiHeart size={80} className="mx-auto text-gray-300" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Save items you love to your wishlist and they'll appear here.
            </p>
            <Link href="/shop">
              <Button size="lg">
                Start Shopping
                <FiArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Header */}
      <section className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
          <p className="text-gray-400">{wishlist.length} items saved</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-sm group"
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
                
                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(item.id)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500"
                >
                  <FiTrash2 size={18} />
                </button>
                
                {/* Sale Badge */}
                {item.original_price && item.original_price > item.price && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded">
                    {Math.round(((item.original_price - item.price) / item.original_price) * 100)}% OFF
                  </span>
                )}
              </div>
              
              <div className="p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  {item.category_id === '1' ? 'Shirts' : 
                   item.category_id === '2' ? 'Hoodies' :
                   item.category_id === '3' ? 'Pants' : 'Fashion'}
                </p>
                <Link href={`/product/${item.slug}`}>
                  <h3 className="font-medium hover:text-orange-500 transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                </Link>
                <div className="mt-2 flex items-center gap-2">
                  <span className="font-semibold">
                    ₹{item.price.toLocaleString()}
                  </span>
                  {item.original_price && item.original_price > item.price && (
                    <span className="text-gray-400 line-through text-sm">
                      ₹{item.original_price.toLocaleString()}
                    </span>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => handleAddToCart(item)}
                >
                  <FiShoppingBag className="mr-2" />
                  Add to Cart
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <Link href="/shop">
            <Button variant="outline" size="lg">
              Continue Shopping
              <FiArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
