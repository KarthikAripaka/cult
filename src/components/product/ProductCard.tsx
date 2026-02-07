'use client';

import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiShoppingBag, FiEye } from 'react-icons/fi';
import { Product } from '@/types';
import { useCartStore, useAuthStore, useUIStore } from '@/store';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  index?: number;
  viewMode?: 'grid' | 'list';
}

// Memoized component for performance
const ProductCard = memo(function ProductCard({ 
  product, 
  index = 0, 
  viewMode = 'grid' 
}: ProductCardProps) {
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const { toggleCart } = useUIStore();

  const isOnSale = product.original_price && product.original_price > product.price;
  
  const discount = isOnSale
    ? Math.round(((product.original_price! - product.price) / product.original_price!) * 100)
    : 0;

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
    const color = colors.length > 0 ? colors[0] : 'Default';

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
          {(product.is_new || isOnSale || product.is_featured) && (
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.is_new && (
                <span className="badge-new px-2 py-1 text-xs font-medium">
                  NEW
                </span>
              )}
              {isOnSale && (
                <span className="badge-sale px-2 py-1 text-xs font-medium">
                  -{discount}%
                </span>
              )}
              {product.is_featured && !isOnSale && (
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
          <h3 className="font-medium text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
          
          <div className="flex items-center gap-2 mt-3">
            <span className="text-lg font-bold">₹{product.price}</span>
            {isOnSale && (
              <span className="text-gray-400 line-through text-sm">
                ₹{product.original_price}
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
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
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
});

export default ProductCard;
