'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FiStar, FiHeart, FiShare2, FiTruck, FiRefreshCw, FiShield, FiMinus, FiPlus, FiShoppingBag, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/product/ProductCard';
import { Product, Review } from '@/types';
import { useCartStore, useAuthStore, useUIStore } from '@/store';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const { toggleCart } = useUIStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>('description');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${slug}`);
        const data = await response.json();
        
        if (data.product) {
          setProduct(data.product);
          setRelatedProducts(data.relatedProducts || []);
          setReviews(data.reviews || []);
          if (data.product.sizes.length > 0) {
            setSelectedSize(data.product.sizes[0]);
          }
          if (data.product.colors.length > 0) {
            setSelectedColor(data.product.colors[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

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

    if (product) {
      addItem(product, selectedSize, selectedColor, quantity, user.id);
      toast.success(`${product.name} added to cart`);
      toggleCart();
    }
  };

  const isOnSale = product?.original_price && product.original_price > product?.price;
  const discount = isOnSale
    ? Math.round(((product!.original_price! - product!.price) / product!.original_price!) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-black border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link href="/shop">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:text-black">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-black">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-black">{product.name}</span>
        </nav>
      </div>

      {/* Product Section */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden"
            >
              <Image
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.is_new && (
                  <span className="badge-new px-3 py-1 text-sm font-medium">
                    NEW
                  </span>
                )}
                {isOnSale && (
                  <span className="badge-sale px-3 py-1 text-sm font-medium">
                    -{discount}%
                  </span>
                )}
              </div>
              
              {/* Wishlist Button */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all ${
                  isWishlisted
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-black hover:text-white'
                }`}
              >
                <FiHeart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
              
              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(i => Math.max(0, i - 1))}
                    disabled={selectedImage === 0}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors"
                  >
                    <FiChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setSelectedImage(i => Math.min(product.images.length - 1, i + 1))}
                    disabled={selectedImage === product.images.length - 1}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors"
                  >
                    <FiChevronRight size={20} />
                  </button>
                </>
              )}
            </motion.div>
            
            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-black' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-orange-500 font-medium mb-2">
                {product.category?.name || 'Fashion'}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      size={18}
                      className={i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">(127 reviews)</span>
                </div>
              </div>
              
              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold">
                  ₹{product.price.toLocaleString()}
                </span>
                {isOnSale && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ₹{product.original_price!.toLocaleString()}
                    </span>
                    <span className="bg-red-500 text-white px-2 py-1 text-sm font-medium rounded">
                      Save {discount}%
                    </span>
                  </>
                )}
              </div>
              
              {/* Stock Status */}
              <div className="mt-4">
                {product.stock > 0 ? (
                  <span className="text-green-600 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="text-red-500 font-medium">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h4 className="font-medium mb-3">Color: <span className="font-normal text-gray-600">{selectedColor}</span></h4>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === color
                        ? 'border-black scale-110'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Size: <span className="font-normal text-gray-600">{selectedSize}</span></h4>
                <Link href="/size-guide" className="text-sm text-orange-500 hover:underline">
                  Size Guide
                </Link>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-lg border-2 font-medium transition-all ${
                      selectedSize === size
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h4 className="font-medium mb-3">Quantity</h4>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-3 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <FiMinus size={18} />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="p-3 hover:bg-gray-100 transition-colors"
                    disabled={quantity >= product.stock}
                  >
                    <FiPlus size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-4">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <FiShoppingBag className="mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg">
                <FiShare2 size={20} />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-200">
              <div className="text-center">
                <FiTruck className="mx-auto text-orange-500 mb-2" size={24} />
                <p className="text-xs text-gray-600">Free Shipping</p>
              </div>
              <div className="text-center">
                <FiRefreshCw className="mx-auto text-orange-500 mb-2" size={24} />
                <p className="text-xs text-gray-600">Easy Returns</p>
              </div>
              <div className="text-center">
                <FiShield className="mx-auto text-orange-500 mb-2" size={24} />
                <p className="text-xs text-gray-600">Secure Payment</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.is_featured && (
                <span className="px-3 py-1 bg-gray-100 text-xs rounded-full">Featured</span>
              )}
              {product.is_new && (
                <span className="px-3 py-1 bg-green-100 text-xs rounded-full">New Arrival</span>
              )}
              {isOnSale && (
                <span className="px-3 py-1 bg-red-100 text-xs rounded-full">On Sale</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex border-b border-gray-200 mb-8">
            {['description', 'reviews', 'shipping'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-black text-black'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          
          <AnimatePresence mode="wait">
            {activeTab === 'description' && (
              <motion.div
                key="description"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="prose max-w-none"
              >
                <h3 className="text-xl font-bold mb-4">Product Details</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Premium quality materials</li>
                  <li>• Comfortable fit for all-day wear</li>
                  <li>• Durable construction</li>
                  <li>• Easy care instructions</li>
                </ul>
              </motion.div>
            )}
            
            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold">Customer Reviews</h3>
                  <Button variant="outline" size="sm">Write a Review</Button>
                </div>
                
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="font-medium text-gray-600">
                            {review.user?.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{review.user?.name || 'User'}</p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <FiStar
                                key={i}
                                size={14}
                                className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="ml-auto text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {activeTab === 'shipping' && (
              <motion.div
                key="shipping"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold">Shipping Information</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-4 bg-white rounded-lg">
                    <FiTruck className="text-orange-500 mb-2" size={24} />
                    <h4 className="font-medium mb-1">Standard Shipping</h4>
                    <p className="text-sm text-gray-600">5-7 business days</p>
                    <p className="text-sm font-medium">Free on orders above ₹2000</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg">
                    <FiTruck className="text-orange-500 mb-2" size={24} />
                    <h4 className="font-medium mb-1">Express Shipping</h4>
                    <p className="text-sm text-gray-600">2-3 business days</p>
                    <p className="text-sm font-medium">₹250</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg">
                    <FiRefreshCw className="text-orange-500 mb-2" size={24} />
                    <h4 className="font-medium mb-1">Easy Returns</h4>
                    <p className="text-sm text-gray-600">30-day return policy</p>
                    <p className="text-sm font-medium">Free returns</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
