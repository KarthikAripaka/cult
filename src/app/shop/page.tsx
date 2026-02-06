'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiGrid, FiList, FiX, FiChevronDown } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/product/ProductCard';
import { sampleProducts } from '@/data/products';

const allProducts = [...sampleProducts];

const categories = ['All', 'T-Shirts', 'Jeans', 'Hoodies', 'Jackets', 'Cargo Pants', 'Accessories'];
const priceRanges = ['Under ₹500', '₹500 - ₹1000', '₹1000 - ₹2000', 'Over ₹2000'];
const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Best Selling'];

export default function ShopPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('Newest');
  const [gridColumns, setGridColumns] = useState(4);

  const filteredProducts = allProducts.filter((product) => {
    if (selectedCategory !== 'All') {
      const categoryMap: Record<string, string[]> = {
        'T-Shirts': ['t-shirt', 'tshirt'],
        'Jeans': ['jeans'],
        'Hoodies': ['hoodie'],
        'Jackets': ['jacket'],
        'Cargo Pants': ['cargo', 'pants'],
      };
      const keywords = categoryMap[selectedCategory] || [];
      const matchesCategory = keywords.some(k => product.slug.includes(k)) || 
        (selectedCategory === 'Accessories' && product.category_id === '4');
      if (!matchesCategory && selectedCategory !== 'All') return false;
    }
    if (selectedPrice) {
      if (selectedPrice === 'Under ₹500' && product.price >= 500) return false;
      if (selectedPrice === '₹500 - ₹1000' && (product.price < 500 || product.price >= 1000)) return false;
      if (selectedPrice === '₹1000 - ₹2000' && (product.price < 1000 || product.price >= 2000)) return false;
      if (selectedPrice === 'Over ₹2000' && product.price < 2000) return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'Price: Low to High':
        return a.price - b.price;
      case 'Price: High to Low':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop All</h1>
          <p className="text-gray-600">Discover our premium collection of men's fashion</p>
        </motion.div>

        {/* Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(true)}
              leftIcon={<FiFilter />}
            >
              Filters
            </Button>
            <div className="hidden md:flex items-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black bg-white"
            >
              {sortOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setGridColumns(4)}
                className={`p-2 rounded-lg ${gridColumns === 4 ? 'bg-black text-white' : 'bg-gray-100'}`}
              >
                <FiGrid size={20} />
              </button>
              <button
                onClick={() => setGridColumns(3)}
                className={`p-2 rounded-lg ${gridColumns === 3 ? 'bg-black text-white' : 'bg-gray-100'}`}
              >
                <FiList size={20} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <p className="text-gray-600 mb-6">
          Showing {sortedProducts.length} products
        </p>

        {/* Product Grid */}
        <motion.div
          layout
          className={`grid grid-cols-1 ${gridColumns === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6`}
        >
          <AnimatePresence>
            {sortedProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                layout
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No products found</p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory('All');
                setSelectedPrice(null);
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Filter Sidebar */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween' }}
              className="fixed left-0 top-0 bottom-0 w-full max-w-sm bg-white z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Filters</h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                {/* Categories */}
                <div className="mb-8">
                  <h3 className="font-semibold mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                          className="w-4 h-4"
                        />
                        <span>{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-8">
                  <h3 className="font-semibold mb-4">Price Range</h3>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <label key={range} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="price"
                          checked={selectedPrice === range}
                          onChange={() => setSelectedPrice(range)}
                          className="w-4 h-4"
                        />
                        <span>{range}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedPrice(null);
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
