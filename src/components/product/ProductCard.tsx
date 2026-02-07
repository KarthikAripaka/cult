'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiShoppingBag, FiEye, FiStar } from 'react-icons/fi';
import { Product } from '@/types';
import { useCartStore, useAuthStore, useUIStore } from '@/store';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  index?: number;
  viewMode?: 'grid' | 'list';
}

const ProductCard = ({ product, index = 0, viewMode = 'grid' }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const { toggleCart } = useUIStore();

  const isOnSale = product.original_price && product.original_price > product.price;
  const discount = isOnSale
    ? Math.round(((product.original_price! - product.price) / product.original_price!) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    if (product.sizes.length > 0 && product.colors.length > 0) {
      addItem(product, product.sizes[0], product.colors[0], 1, user.id);
    } else {
      addItem(product, 'One Size', 'Default', 1, user.id);
    }

    toast.success(`${product.name} added to cart`);
    toggleCart();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`product-card group ${viewMode === 'list' ? 'flex gap-6' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.slug}`} className={viewMode === 'list' ? 'flex gap-6 w-full' : 'block'}>
        {/* Image Container */}
        <div className={`relative overflow-hidden bg-gray-100 ${viewMode === 'list' ? 'w-64 flex-shrink-0 aspect-[3/4]' : 'aspect-[3/4]'}`}>
          {product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              sizes={viewMode === 'list' ? "256px" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
            />
          )}

          {/* Badges */}
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
            {product.is_featured && (
              <span className="badge-featured px-2 py-1 text-xs font-medium">
                FEATURED
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div
            className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
            }`}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                setIsWishlisted(!isWishlisted);
              }}
              className={`p-2 rounded-full shadow-lg transition-colors ${
                isWishlisted
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-black hover:text-white'
              }`}
            >
              <FiHeart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleQuickAdd}
              className="p-2 bg-white text-gray-700 rounded-full shadow-lg hover:bg-black hover:text-white transition-colors"
            >
              <FiShoppingBag size={16} />
            </motion.button>
          </div>

          {/* Quick View Button */}
          <motion.div
            className={`absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent transition-all duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button className="w-full py-2 bg-white/90 text-black font-medium text-sm rounded hover:bg-white transition-colors flex items-center justify-center gap-2">
              <FiEye size={14} />
              Quick View
            </button>
          </motion.div>

          {/* Out of Stock Overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white px-4 py-2 font-medium text-sm">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className={`${viewMode === 'list' ? 'flex-1 py-4' : 'p-4'}`}>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {product.category?.name || 'Fashion'}
          </p>
          <h3 className="font-medium text-gray-900 group-hover:text-orange-500 transition-colors">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center gap-2">
            <span className={`font-semibold ${isOnSale ? 'text-orange-500' : 'text-black'}`}>
              ₹{product.price.toLocaleString()}
            </span>
            {isOnSale && (
              <span className="text-gray-400 line-through text-sm">
                ₹{product.original_price!.toLocaleString()}
              </span>
            )}
          </div>
          <p className="mt-3 text-gray-600 text-sm line-clamp-2">
            {product.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {product.sizes.slice(0, 5).map((size) => (
              <span key={size} className="px-3 py-1 text-xs border border-gray-300 rounded">
                {size}
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  size={14}
                  className={i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">(127 reviews)</span>
          </div>
          {viewMode === 'list' && (
            <div className="mt-6 flex gap-3">
              <Button size="sm" onClick={handleQuickAdd}>
                Add to Cart
              </Button>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
