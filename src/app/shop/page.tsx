'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { FiGrid, FiList, FiFilter, FiX, FiChevronDown, FiShoppingBag } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/product/ProductCard';
import { Product, Category } from '@/types';
import { useCartStore } from '@/store';
import toast from 'react-hot-toast';

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

const filterOptions = {
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', 'One Size'],
  colors: [
    { value: 'black', label: 'Black', hex: '#000000' },
    { value: 'white', label: 'White', hex: '#ffffff' },
    { value: 'navy', label: 'Navy', hex: '#1e3a5f' },
    { value: 'blue', label: 'Blue', hex: '#3b82f6' },
    { value: 'gray', label: 'Gray', hex: '#6b7280' },
    { value: 'red', label: 'Red', hex: '#ef4444' },
    { value: 'olive', label: 'Olive', hex: '#65a30d' },
    { value: 'brown', label: 'Brown', hex: '#92400e' },
    { value: 'beige', label: 'Beige', hex: '#d4c5b0' },
  ],
  priceRanges: [
    { value: '0-500', label: 'Under ₹500' },
    { value: '500-1000', label: '₹500 - ₹1000' },
    { value: '1000-2000', label: '₹1000 - ₹2000' },
    { value: '2000+', label: 'Above ₹2000' },
  ],
};

function ShopContent() {
  const searchParams = useSearchParams();
  const { addItem } = useCartStore();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Filters state
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>('');
  const [sortBy, setSortBy] = useState('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);
  
  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: '12',
          sort: sortBy,
        });
        
        if (selectedCategory !== 'all') {
          params.append('category', selectedCategory);
        }
        
        if (selectedSizes.length > 0) {
          params.append('sizes', selectedSizes.join(','));
        }
        
        if (selectedColors.length > 0) {
          params.append('colors', selectedColors.join(','));
        }
        
        if (priceRange) {
          const [min, max] = priceRange.split('-');
          if (min) params.append('minPrice', min);
          if (max && max !== '+') params.append('maxPrice', max);
        }
        
        const response = await fetch(`/api/products?${params.toString()}`);
        const data = await response.json();
        
        setProducts(data.products || []);
        setTotalProducts(data.pagination?.totalProducts || 0);
        setTotalPages(data.pagination?.totalPages || 1);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [selectedCategory, selectedSizes, selectedColors, priceRange, sortBy, currentPage]);
  
  // Handle size filter
  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
    setCurrentPage(1);
  };
  
  // Handle color filter
  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
    setCurrentPage(1);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange('');
    setCurrentPage(1);
  };
  
  // Has active filters
  const hasActiveFilters = selectedCategory !== 'all' || selectedSizes.length > 0 || 
    selectedColors.length > 0 || priceRange !== '';
  
  // Get page title
  const getPageTitle = () => {
    if (selectedCategory === 'all') return 'Shop All';
    if (selectedCategory === 'new-arrivals') return 'New Arrivals';
    const category = categories.find(c => c.slug === selectedCategory);
    return category?.name || selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
  };

  // Get category image for banner
  const getCategoryImage = () => {
    if (selectedCategory === 'all' || selectedCategory === 'new-arrivals') {
      return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200';
    }
    const category = categories.find(c => c.slug === selectedCategory);
    return category?.image_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200';
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Page Header with Category Image */}
      <section 
        className="relative h-64 md:h-80 bg-black overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${getCategoryImage()})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              {getPageTitle()}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-200 max-w-2xl"
            >
              Discover our curated collection of premium fashion pieces. 
              {totalProducts > 0 && ` Showing ${totalProducts} products`}
            </motion.p>
          </motion.div>
        </div>
      </section>
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-black transition-colors"
          >
            <FiFilter size={20} />
            Filters
          </button>
          
          {/* Results Count */}
          <p className="text-gray-600">
            Showing {products.length} of {totalProducts} products
          </p>
          
          {/* Sort and View Options */}
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-black bg-white cursor-pointer"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}
              >
                <FiGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}
              >
                <FiList size={20} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`
            fixed inset-0 z-50 bg-black/50 md:static md:bg-transparent md:w-64 md:block md:flex-shrink-0
            ${isFilterOpen ? 'block' : 'hidden'}
          `}>
            <div className="bg-white md:rounded-lg p-6 h-full md:h-auto md:shadow-sm md:border border-gray-200 overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 md:hidden">
                <h3 className="text-lg font-bold">Filters</h3>
                <button onClick={() => setIsFilterOpen(false)}>
                  <FiX size={24} />
                </button>
              </div>
              
              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-orange-500 text-sm mb-6 hover:underline"
                >
                  Clear All Filters
                </button>
              )}
              
              {/* Category Filter */}
              <div className="mb-8">
                <h4 className="font-medium mb-4">Category</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === 'all'}
                      onChange={() => { setSelectedCategory('all'); setCurrentPage(1); }}
                      className="w-4 h-4 text-black focus:ring-black border-gray-300"
                    />
                    <span className="text-sm">All Products</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === 'new-arrivals'}
                      onChange={() => { setSelectedCategory('new-arrivals'); setCurrentPage(1); }}
                      className="w-4 h-4 text-black focus:ring-black border-gray-300"
                    />
                    <span className="text-sm">New Arrivals</span>
                  </label>
                  {categories.map(category => (
                    <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category.slug}
                        onChange={() => { setSelectedCategory(category.slug); setCurrentPage(1); }}
                        className="w-4 h-4 text-black focus:ring-black border-gray-300"
                      />
                      <span className="text-sm">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Size Filter */}
              <div className="mb-8">
                <h4 className="font-medium mb-4">Size</h4>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`
                        w-10 h-10 rounded-lg border text-sm font-medium transition-colors
                        ${selectedSizes.includes(size) 
                          ? 'bg-black text-white border-black' 
                          : 'bg-white border-gray-300 hover:border-black'}
                      `}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Color Filter */}
              <div className="mb-8">
                <h4 className="font-medium mb-4">Color</h4>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.colors.map(color => (
                    <button
                      key={color.value}
                      onClick={() => toggleColor(color.value)}
                      className={`
                        w-8 h-8 rounded-full border-2 transition-all
                        ${selectedColors.includes(color.value) 
                          ? 'border-black scale-110' 
                          : 'border-transparent hover:scale-110'}
                      `}
                      style={{ backgroundColor: color.hex }}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
              
              {/* Price Filter */}
              <div className="mb-8">
                <h4 className="font-medium mb-4">Price Range</h4>
                <div className="space-y-2">
                  {filterOptions.priceRanges.map(range => (
                    <label key={range.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        checked={priceRange === range.value}
                        onChange={() => { setPriceRange(range.value); setCurrentPage(1); }}
                        className="w-4 h-4 text-black focus:ring-black border-gray-300"
                      />
                      <span className="text-sm">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Apply Button (Mobile) */}
              <button
                onClick={() => setIsFilterOpen(false)}
                className="md:hidden w-full bg-black text-white py-3 rounded-lg font-medium"
              >
                Apply Filters
              </button>
            </div>
          </aside>
          
          {/* Products Grid/List */}
          <div className="flex-1">
            {loading ? (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
              }>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-[3/4] rounded-lg mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <FiShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters</p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'space-y-4'
                }>
                  <AnimatePresence mode="wait">
                    {products.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} viewMode={viewMode} />
                    ))}
                  </AnimatePresence>
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-black transition-colors"
                    >
                      Previous
                    </button>
                    
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`
                            w-10 h-10 rounded-lg font-medium transition-colors
                            ${currentPage === pageNum 
                              ? 'bg-black text-white' 
                              : 'border border-gray-300 hover:border-black'}
                          `}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-black transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full" />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
