'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiShoppingBag, FiMenu, FiX, FiUser, FiHeart, FiLogOut, FiSettings, FiPackage, FiLoader } from 'react-icons/fi';
import Image from 'next/image';
import { useAuthStore, useUIStore, useCartStore } from '@/store';
import Button from '@/components/ui/Button';
import CartSidebar from '@/components/cart/CartSidebar';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

import { Product } from '@/types';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/shop', label: 'New Arrivals' },
  { href: '/shop', label: 'Sale' },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuthStore();
  const { toggleCart, isCartOpen } = useUIStore();
  const { getItemCount, clearCart } = useCartStore();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Close user menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const itemCount = getItemCount();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      logout();
      clearCart();
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Error logging out');
    }
    setIsUserMenuOpen(false);
  };

  // Search functionality
  const fetchSearchResults = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/products?q=${encodeURIComponent(query)}&limit=6`);
      const data = await response.json();
      setSearchResults(data.products || []);
    } catch (error) {
      console.error('Error searching products:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debouncing
    if (query.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        fetchSearchResults(query);
      }, 300);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchResults([]);
      setSearchQuery('');
    }
  };

  const closeSearchDropdown = () => {
    setSearchResults([]);
    setSearchQuery('');
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        {/* Announcement Bar */}
        <div className="bg-black text-white text-center py-2 text-sm">
          <p className="animate-pulse">🎉 Free shipping on orders over ₹2000 | Use code WELCOME10 for 10% off</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <motion.span
                className="text-2xl md:text-3xl font-medium tracking-tighter"
                whileHover={{ scale: 1.05 }}
              >
                CULT
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="nav-link text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 hover:text-orange-500 transition-colors"
              >
                <FiSearch size={20} />
              </button>
              
              <Link href="/wishlist" className="p-2 hover:text-orange-500 transition-colors hidden md:block">
                <FiHeart size={20} />
              </Link>

              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="p-2 hover:text-orange-500 transition-colors flex items-center gap-2"
                  >
                    <FiUser size={20} />
                    <span className="hidden md:block text-sm font-medium">{user.name?.split(' ')[0]}</span>
                  </button>
                  
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                      >
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FiUser size={16} />
                          Dashboard
                        </Link>
                        <Link
                          href="/orders"
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FiPackage size={16} />
                          My Orders
                        </Link>
                        <Link
                          href="/wishlist"
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FiHeart size={16} />
                          Wishlist
                        </Link>
                        <hr className="my-2" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                        >
                          <FiLogOut size={16} />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/auth/login" className="p-2 hover:text-orange-500 transition-colors">
                  <FiUser size={20} />
                </Link>
              )}

              <button
                onClick={toggleCart}
                className="p-2 hover:text-orange-500 transition-colors relative"
              >
                <FiShoppingBag size={20} />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="cart-badge"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar with Results Dropdown */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white border-t overflow-hidden"
            >
              <div className="max-w-2xl mx-auto px-4 py-4">
                <form onSubmit={handleSearchSubmit}>
                  <div className="flex items-center gap-2">
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search for products..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="flex-1 px-4 py-2 border border-gray-300 focus:border-black focus:outline-none"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setSearchResults([]);
                        }}
                        className="px-3 py-2 border border-gray-300 hover:border-black rounded transition-colors"
                      >
                        Clear
                      </button>
                    )}
                    <Button type="submit" size="sm">
                      Search
                    </Button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <FiX size={20} />
                    </button>
                  </div>
                </form>

                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {searchQuery.trim() && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
                    >
                      {isSearching ? (
                        <div className="p-4 text-center">
                          <FiLoader className="animate-spin mx-auto text-orange-500" size={24} />
                        </div>
                      ) : searchResults.length > 0 ? (
                        <>
                          <div className="p-3 bg-gray-50 border-b">
                            <p className="text-sm text-gray-600">{searchResults.length} products found</p>
                          </div>
                          <div className="max-h-64 overflow-y-auto">
                            {searchResults.map((product) => (
                              <Link
                                key={product.id}
                                href={`/product/${product.slug}`}
                                onClick={() => {
                                  closeSearchDropdown();
                                  setIsSearchOpen(false);
                                }}
                                className="flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors"
                              >
                                <div className="relative w-14 h-14 flex-shrink-0">
                                  <Image
                                    src={product.images?.[0] || '/placeholder.jpg'}
                                    alt={product.name}
                                    fill
                                    className="object-cover rounded-lg"
                                  />
                                </div>
                                <div className="flex-1 text-left">
                                  <p className="font-medium text-black truncate">{product.name}</p>
                                  <p className="text-sm text-gray-500">{typeof product.category === 'string' ? product.category : product.category?.name}</p>
                                  <p className="text-sm font-medium text-orange-500">
                                    ₹{product.price?.toLocaleString()}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                          <div className="p-3 bg-gray-50 border-t text-center">
                            <Link
                              href={`/shop?q=${encodeURIComponent(searchQuery)}`}
                              onClick={() => {
                                closeSearchDropdown();
                                setIsSearchOpen(false);
                              }}
                              className="text-sm text-orange-500 font-medium hover:underline"
                            >
                              View all results →
                            </Link>
                          </div>
                        </>
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          No products found for "{searchQuery}"
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-t overflow-hidden"
            >
              <nav className="flex flex-col p-4 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium py-2 border-b"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                {user ? (
                  <Link
                    href="/dashboard"
                    className="text-lg font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/auth/login"
                    className="text-lg font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={toggleCart} />
    </>
  );
};

export default Header;
