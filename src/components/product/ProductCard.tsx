'use client';

import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { Product } from '@/types';
import { useCartStore, useAuthStore, useUIStore } from '@/store';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  index?: number;
  viewMode?: 'grid' | 'list';
}

// Helper function to get color hex from color value
function getColorHex(color: string | { name: string; hex: string }): string {
  if (typeof color === 'string') {
    // Map common color names to hex
    const colorMap: Record<string, string> = {
      white: '#FFFFFF',
      black: '#000000',
      navy: '#1E3A8A',
      blue: '#3B5998',
      grey: '#6B7280',
      gray: '#6B7280',
      red: '#DC2626',
      green: '#3F6212',
      beige: '#D4C4A8',
      olive: '#556B2F',
      pink: '#F472B6',
      yellow: '#FACC15',
      orange: '#F97316',
      purple: '#7C3AED',
      burgundy: '#7F1D1D',
      charcoal: '#374151',
      khaki: '#C4A35A',
      denim: '#3B5998',
      'light blue': '#93C5FD',
      'dark blue': '#1a1a2e',
      'acid blue': '#60A5FA',
      'washed blue': '#60A5FA',
      'medium blue': '#3B82F6',
      'navy stripe': '#1E3A8A',
      'red check': '#DC2626',
      'blue tie-dye': '#3B82F6',
      'grey check': '#6B7280',
      'camo green': '#3F6212',
      'olive green': '#556B2F',
      'multicolor': '#FF6B6B',
      'acid wash': '#60A5FA',
      'paper bag': '#D4C4A8',
      'fishnet': '#000000',
    };
    return colorMap[color.toLowerCase()] || color.toLowerCase();
  }
  return color.hex;
}

// Helper function to get color name from color value
function getColorName(color: string | { name: string; hex: string }): string {
  if (typeof color === 'string') return color;
  return color.name;
}

function ProductCard({ 
  product, 
  index = 0, 
  viewMode = 'grid' 
}: ProductCardProps) {
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const { toggleCart } = useUIStore();

  // Support both original_price and originalPrice
  const originalPrice = product.original_price || product.originalPrice;
  const isOnSale = originalPrice && originalPrice > product.price;
  
  const discount = isOnSale
    ? Math.round(((originalPrice! - product.price) / originalPrice!) * 100)
    : 0;

  // Support both is_new and isNew
  const isNew = product.is_new || product.isNew;
  const isFeatured = product.is_featured || product.isFeatured;

  const handleQuickAdd = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    const sizes = product.sizes || [];
    const colors = product.colors || [];
    const size = sizes.length > 0 ? sizes[0] : 'One Size';
    const color = colors.length > 0 ? getColorName(colors[0]) : 'Default';

    addItem(product, size, color, 1, user.id);
    toast.success(`${product.name} added to cart`);
    toggleCart();
  }, [user, product, addItem, toggleCart]);

  const handleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success('Added to wishlist!');
  }, []);

  const imageSizes = viewMode === 'list' 
    ? "256px" 
    : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw";

  // Get category display name
  const categoryName = typeof product.category === 'string' 
    ? product.category 
    : product.category?.name || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className={`product-card group ${viewMode === 'list' ? 'flex gap-6' : ''}`}
    >
      <Link href={`/product/${product.slug}`} className={viewMode === 'list' ? 'flex gap-6 w-full' : 'block'}>
        {/* Image Container */}
        <div className={`relative overflow-hidden bg-gray-100 ${viewMode === 'list' ? 'w-64 flex-shrink-0 aspect-[3/4]' : 'aspect-[3/4]'}`}>
          {product.images && product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              sizes={imageSizes}
              priority={index < 4}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Badges */}
          {(isNew || isOnSale || isFeatured) && (
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {isNew && (
                <span className="badge-new px-2 py-1 text-xs font-medium">
                  NEW
                </span>
              )}
              {isOnSale && (
                <span className="badge-sale px-2 py-1 text-xs font-medium">
                  -{discount}%
                </span>
              )}
              {isFeatured && !isOnSale && (
                <span className="badge-featured px-2 py-1 text-xs font-medium">
                  FEATURED
                </span>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlist}
              className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50"
            >
              <FiHeart size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleQuickAdd}
              className="w-10 h-10 bg-black text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-800"
            >
              <FiShoppingBag size={18} />
            </motion.button>
          </div>
        </div>

        {/* Product Info */}
        <div className={`p-4 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-center' : ''}`}>
          <p className="text-orange-500 text-xs font-medium mb-1">{categoryName}</p>
          <h3 className="font-medium text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
          
          <div className="flex items-center gap-2 mt-3">
            <span className="text-lg font-bold">₹{product.price.toLocaleString()}</span>
            {isOnSale && (
              <span className="text-gray-400 line-through text-sm">
                ₹{originalPrice?.toLocaleString()}
              </span>
            )}
          </div>

          {/* Colors */}
          {viewMode === 'grid' && product.colors && product.colors.length > 0 && (
            <div className="flex gap-1 mt-3">
              {product.colors.slice(0, 4).map((color, idx) => (
                <div
                  key={idx}
                  className="w-5 h-5 rounded-full border border-gray-200"
                  style={{ backgroundColor: getColorHex(color) }}
                  title={getColorName(color)}
                />
              ))}
              {product.colors && product.colors.length > 4 && (
                <span className="text-xs text-gray-500 ml-1">+{product.colors.length - 4}</span>
              )}
            </div>
          )}

          {/* Quick Add Button (Mobile) */}
          <button
            onClick={handleQuickAdd}
            className="mt-4 w-full py-2 bg-black text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity lg:hidden"
          >
            Quick Add
          </button>
        </div>
      </Link>
    </motion.div>
  );
}

export default ProductCard;
