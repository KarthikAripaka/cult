'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight, FiStar, FiTruck, FiRefreshCw, FiShield, FiShoppingBag, FiTrendingUp, FiInstagram } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/product/ProductCard';
import { sampleProducts } from '@/data/products';
import { Product } from '@/types';

// Hero Slides Data - Modern Dress Images (No People)
const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=80',
    title: ['ELEVATE YOUR', 'STYLE'],
    subtitle: 'Discover the new collection',
    cta: 'Shop Now',
    ctaLink: '/shop',
  },
  {
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1920&q=80',
    title: ['PREMIUM', 'ESSENTIALS'],
    subtitle: 'Quality meets comfort',
    cta: 'Explore',
    ctaLink: '/shop',
  },
  {
    image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1920&q=80',
    title: ['SALE', 'UP TO 50%'],
    subtitle: 'Limited time offers',
    cta: 'Shop Sale',
    ctaLink: '/shop',
  },
];

// Categories Data
const categories = [
  { name: 'New Arrivals', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80', slug: 'new-arrivals' },
  { name: 'Men', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80', slug: 'men' },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80', slug: 'accessories' },
  { name: 'Sale', image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&q=80', slug: 'sale' },
];

// Features Data
const features = [
  { icon: FiTruck, title: 'Free Shipping', desc: 'On orders above ₹2000' },
  { icon: FiRefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
  { icon: FiShield, title: 'Secure Payment', desc: '100% secure checkout' },
  { icon: FiShoppingBag, title: 'Quality Guarantee', desc: 'Premium materials' },
];

// Get featured products for homepage
const featuredProducts = sampleProducts.filter(p => p.is_featured).slice(0, 4);

// Animated Headlines
const headlines = [
  'TRENDING NOW',
  'NEW SEASON',
  'LIMITED EDITION',
  'EXCLUSIVE DROPS',
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentHeadline, setCurrentHeadline] = useState(0);

  // Auto-rotate hero slides
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  // Auto-rotate headlines
  useEffect(() => {
    const headlineInterval = setInterval(() => {
      setCurrentHeadline((prev) => (prev + 1) % headlines.length);
    }, 3000);
    return () => clearInterval(headlineInterval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <Image
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].title[1]}
              fill
              className="object-cover"
              priority
            />
            <div className="hero-overlay absolute inset-0" />
          </motion.div>
        </AnimatePresence>

        {/* Hero Content */}
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <p className="text-sm md:text-base tracking-widest uppercase mb-4">
                {heroSlides[currentSlide].subtitle}
              </p>
            </motion.div>

            {/* Animated Headlines */}
            <div className="h-16 md:h-20 mb-6 overflow-hidden">
              <AnimatePresence mode="wait">
                {headlines.map((_, idx) => (
                  idx === currentHeadline && (
                    <motion.h1
                      key={idx}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      transition={{ duration: 0.5 }}
                      className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter"
                    >
                      {heroSlides[currentSlide].title[0]} <br className="md:hidden" />
                      <span className="text-orange-500">{heroSlides[currentSlide].title[1]}</span>
                    </motion.h1>
                  )
                ))}
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Link href={heroSlides[currentSlide].ctaLink as string}>
                <Button size="lg" className="group">
                  {heroSlides[currentSlide].cta}
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentSlide ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-black text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-3 justify-center"
              >
                <feature.icon size={24} className="text-orange-500" />
                <div>
                  <p className="font-medium text-sm">{feature.title}</p>
                  <p className="text-xs text-gray-400">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our curated collections designed for every style and occasion
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, idx) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link href="/shop" className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-white text-xl md:text-2xl font-bold tracking-wide">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
          >
            <div className="mb-6 md:mb-0">
              <p className="text-orange-500 font-medium mb-2 flex items-center gap-2">
                <FiTrendingUp />
                Trending Now
              </p>
              <h2 className="section-title">Featured Products</h2>
            </div>
            <Link href="/shop">
              <Button variant="outline">
                View All
                <FiArrowRight className="ml-2" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl"
          >
            <div className="relative h-[400px] md:h-[500px]">
              <Image
                src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=1920"
                alt="Sale"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-orange-500 font-medium tracking-widest uppercase mb-4 block"
                  >
                    Limited Time Offer
                  </motion.span>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold mb-6"
                  >
                    SALE UP TO <span className="text-orange-500">50%</span>
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg md:text-xl mb-8 max-w-xl mx-auto"
                  >
                    Shop our biggest sale of the season. Premium styles at unbeatable prices.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link href="/shop">
                      <Button size="lg" variant="accent">
                        Shop Now
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay in the Loop
            </h2>
            <p className="text-gray-400 mb-8">
              Subscribe to our newsletter for exclusive offers, new arrivals, and style inspiration.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white transition-colors"
              />
              <Button variant="accent">
                Subscribe
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-orange-500 font-medium mb-2">@CULT</p>
            <h2 className="section-title">Follow Us on Instagram</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {[
              'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
              'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400',
              'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400',
              'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400',
              'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400',
              'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400',
            ].map((src, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="aspect-square relative overflow-hidden rounded-lg cursor-pointer"
              >
                <Image
                  src={src}
                  alt={`Instagram ${idx + 1}`}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                  <FiInstagram size={24} className="text-white" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
