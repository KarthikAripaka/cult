'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiShoppingBag, FiTrash2, FiArrowRight } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/product/ProductCard';
import { Product } from '@/types';
import toast from 'react-hot-toast';

// Mock wishlist products - using any type to avoid missing property errors
const wishlistProducts: any[] = [
  {
    id: '1',
    name: 'Premium Cotton T-Shirt',
    slug: 'premium-cotton-tshirt',
    description: 'High-quality organic cotton t-shirt',
    price: 49.99,
    original_price: 79.99,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'],
    category_id: '1',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Navy'],
    stock: 100,
    is_featured: true,
    is_new: true,
    is_active: true,
    avg_rating: 4.5,
    review_count: 127,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Urban Jacket',
    slug: 'urban-jacket',
    description: 'Stylish urban jacket for men',
    price: 149.99,
    original_price: 199.99,
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80'],
    category_id: '4',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'Brown'],
    stock: 30,
    is_featured: true,
    is_new: false,
    is_active: true,
    avg_rating: 4.8,
    review_count: 56,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '11',
    name: 'Puffer Jacket',
    slug: 'puffer-jacket',
    description: 'Warm puffer jacket for winter',
    price: 189.99,
    original_price: 249.99,
    images: ['https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=80'],
    category_id: '4',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'Olive'],
    stock: 25,
    is_featured: true,
    is_new: false,
    is_active: true,
    avg_rating: 4.7,
    review_count: 89,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>(wishlistProducts);
  const [isAllProducts, setIsAllProducts] = useState(false);

  const handleRemove = (productId: string) => {
    setWishlist(prev => prev.filter(p => p.id !== productId));
    toast.success('Removed from wishlist');
  };

  const handleAddAllToCart = () => {
    toast.success(`${wishlist.length} items added to cart`);
    setWishlist([]);
  };

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
        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <p className="text-gray-600">
            Showing {wishlist.length} of {wishlist.length + 3} saved items
          </p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setIsAllProducts(!isAllProducts)}>
              {isAllProducts ? 'View Saved Items' : 'View All Products'}
            </Button>
            {wishlist.length > 0 && (
              <Button onClick={handleAddAllToCart}>
                <FiShoppingBag className="mr-2" />
                Add All to Cart
              </Button>
            )}
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-sm group"
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                
                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(product.id)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500"
                >
                  <FiTrash2 size={18} />
                </button>
                
                {/* Sale Badge */}
                {product.original_price && product.original_price > product.price && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded">
                    {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                  </span>
                )}
              </div>
              
              <div className="p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  {product.category_id === '1' ? 'T-Shirts' : 
                   product.category_id === '2' ? 'Pants' :
                   product.category_id === '4' ? 'Jackets' : 'Fashion'}
                </p>
                <Link href={`/product/${product.slug}`}>
                  <h3 className="font-medium hover:text-orange-500 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
                <div className="mt-2 flex items-center gap-2">
                  <span className="font-semibold">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.original_price && product.original_price > product.price && (
                    <span className="text-gray-400 line-through text-sm">
                      ₹{product.original_price.toLocaleString()}
                    </span>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => {
                    toast.success('Added to cart');
                    handleRemove(product.id);
                  }}
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
