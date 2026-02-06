'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiShare2, FiTruck, FiRefreshCw, FiShield, FiStar, FiMinus, FiPlus, FiShoppingBag, FiCheck } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { useCartStore, useAuthStore, useUIStore } from '@/store';
import toast from 'react-hot-toast';
import { Product } from '@/types';

const sampleProduct: Product = {
  id: '1',
  name: 'Premium Cotton T-Shirt',
  slug: 'premium-cotton-tshirt',
  description: 'Experience the ultimate comfort with our Premium Cotton T-Shirt. Made from 100% organic cotton, this tee offers a soft, breathable feel perfect for everyday wear. The modern fit flatters all body types, while the reinforced stitching ensures durability wash after wash.',
  price: 49.99,
  original_price: 79.99,
  images: [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80',
    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
  ],
  category_id: '1',
  category: { id: '1', name: 'New Arrivals', slug: 'new-arrivals', image_url: '', created_at: '' },
  sizes: ['S', 'M', 'L', 'XL'],
  colors: ['White', 'Black', 'Navy'],
  stock: 100,
  is_featured: true,
  is_new: true,
  created_at: new Date().toISOString(),
};

const reviews = [
  { id: '1', name: 'Rahul S.', rating: 5, comment: 'Amazing quality! The cotton is so soft.', date: '2024-01-15' },
  { id: '2', name: 'Priya M.', rating: 4, comment: 'Great fit, colors are vibrant.', date: '2024-01-10' },
  { id: '3', name: 'Amit K.', rating: 5, comment: 'Perfect t-shirt for daily wear.', date: '2024-01-05' },
];

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const { toggleCart } = useUIStore();

  const isOnSale = sampleProduct.original_price! > sampleProduct.price;
  const discount = isOnSale
    ? Math.round(((sampleProduct.original_price! - sampleProduct.price) / sampleProduct.original_price!) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (!selectedColor) {
      toast.error('Please select a color');
      return;
    }
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    addItem(sampleProduct, selectedSize, selectedColor, quantity, user.id);
    toast.success(`${sampleProduct.name} added to cart`);
    toggleCart();
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      toast.error('Please select size and color');
      return;
    }
    if (!user) {
      toast.error('Please login to continue');
      return;
    }
    // Proceed to checkout
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-black">Shop</Link>
          <span>/</span>
          <span className="text-black">{sampleProduct.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden"
            >
              <Image
                src={sampleProduct.images[selectedImage]}
                alt={sampleProduct.name}
                fill
                className="object-cover"
                priority
              />
              {isOnSale && (
                <span className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  -{discount}% OFF
                </span>
              )}
              {sampleProduct.is_new && (
                <span className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded-full text-sm font-medium">
                  NEW
                </span>
              )}
            </motion.div>

            <div className="grid grid-cols-4 gap-4">
              {sampleProduct.images.map((image, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  whileHover={{ scale: 1.05 }}
                  className={`relative aspect-square rounded-lg overflow-hidden ${
                    selectedImage === idx ? 'ring-2 ring-black' : ''
                  }`}
                >
                  <Image src={image} alt="" fill className="object-cover" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                {sampleProduct.category?.name}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {sampleProduct.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar key={star} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-500">(124 reviews)</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className={`text-3xl font-bold ${isOnSale ? 'text-orange-500' : 'text-black'}`}>
                ₹{sampleProduct.price.toLocaleString()}
              </span>
              {isOnSale && (
                <span className="text-xl text-gray-400 line-through">
                  ₹{sampleProduct.original_price!.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed">
              {sampleProduct.description}
            </p>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Size</span>
                <Link href="/shop" className="text-sm text-orange-500 hover:underline">
                  Size Guide
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {sampleProduct.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-lg border-2 font-medium transition-all ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <span className="font-medium block mb-3">Color</span>
              <div className="flex flex-wrap gap-3">
                {sampleProduct.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                      selectedColor === color
                        ? 'border-black'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border"
                      style={{ backgroundColor: color.toLowerCase() }}
                    />
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <span className="font-medium block mb-3">Quantity</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <FiMinus size={18} />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <FiPlus size={18} />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {sampleProduct.stock} in stock
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                size="lg"
                fullWidth
                onClick={handleAddToCart}
                leftIcon={<FiShoppingBag />}
              >
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="accent"
                fullWidth
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
              <Button size="lg" variant="outline">
                <FiHeart size={20} />
              </Button>
              <Button size="lg" variant="outline">
                <FiShare2 size={20} />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-b">
              <div className="text-center">
                <FiTruck size={24} className="mx-auto mb-2 text-orange-500" />
                <p className="text-xs font-medium">Free Shipping</p>
                <p className="text-xs text-gray-500">Above ₹2000</p>
              </div>
              <div className="text-center">
                <FiRefreshCw size={24} className="mx-auto mb-2 text-orange-500" />
                <p className="text-xs font-medium">Easy Returns</p>
                <p className="text-xs text-gray-500">30 Days</p>
              </div>
              <div className="text-center">
                <FiShield size={24} className="mx-auto mb-2 text-orange-500" />
                <p className="text-xs font-medium">Secure</p>
                <p className="text-xs text-gray-500">100% Protected</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t pt-6">
              <div className="flex gap-8 border-b">
                {['description', 'shipping', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm font-medium capitalize transition-colors relative ${
                      activeTab === tab ? 'text-black' : 'text-gray-500 hover:text-black'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="py-6">
                <AnimatePresence mode="wait">
                  {activeTab === 'description' && (
                    <motion.div
                      key="description"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <p className="text-gray-600 leading-relaxed">
                        {sampleProduct.description}
                      </p>
                      <ul className="mt-4 space-y-2 text-gray-600">
                        <li className="flex items-center gap-2">
                          <FiCheck size={16} className="text-green-500" />
                          100% Organic Cotton
                        </li>
                        <li className="flex items-center gap-2">
                          <FiCheck size={16} className="text-green-500" />
                          Pre-shrunk fabric
                        </li>
                        <li className="flex items-center gap-2">
                          <FiCheck size={16} className="text-green-500" />
                          Reinforced stitching
                        </li>
                        <li className="flex items-center gap-2">
                          <FiCheck size={16} className="text-green-500" />
                          Eco-friendly packaging
                        </li>
                      </ul>
                    </motion.div>
                  )}

                  {activeTab === 'shipping' && (
                    <motion.div
                      key="shipping"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4 text-gray-600"
                    >
                      <div>
                        <h4 className="font-medium text-black">Standard Shipping</h4>
                        <p>5-7 business days - FREE on orders above ₹2000</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-black">Express Shipping</h4>
                        <p>2-3 business days - ₹250</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-black">Returns</h4>
                        <p>Easy 30-day returns. Cash on delivery available.</p>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'reviews' && (
                    <motion.div
                      key="reviews"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b pb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{review.name}</span>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FiStar
                                key={star}
                                size={14}
                                className={star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
