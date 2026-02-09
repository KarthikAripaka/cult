'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  FiPackage, FiUsers, FiDollarSign, FiTrendingUp, 
  FiTrendingDown, FiPlus, FiSearch, FiEdit, 
  FiTrash2, FiX, FiGrid,
  FiHome, FiBox, FiShoppingCart, FiBarChart2, FiSettings
} from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { Product, Category } from '@/types';
import toast from 'react-hot-toast';

// Stats
const stats = [
  { label: 'Total Revenue', value: '₹12,45,678', change: '+12.5%', trend: 'up', icon: FiDollarSign },
  { label: 'Total Orders', value: '1,234', change: '+8.2%', trend: 'up', icon: FiPackage },
  { label: 'Customers', value: '5,678', change: '+15.3%', trend: 'up', icon: FiUsers },
  { label: 'Products', value: '0', change: '+0%', trend: 'up', icon: FiBox },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  delivered: { bg: 'bg-green-100', text: 'text-green-800' },
  shipped: { bg: 'bg-purple-100', text: 'text-purple-800' },
  processing: { bg: 'bg-blue-100', text: 'text-blue-800' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
};

// Demo products for when database is unavailable
const fallbackProducts: Product[] = [
  {
    id: '1', name: 'Classic White Oxford Shirt', slug: 'classic-white-oxford-shirt',
    description: 'Timeless white oxford shirt', price: 1499, original_price: 1999,
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200'],
    category: 'Shirts', stock: 50, is_featured: true, is_new: false,
    rating: 4.5, review_count: 128, created_at: '2024-01-15',
  },
  {
    id: '2', name: 'Navy Blue Casual Shirt', slug: 'navy-blue-casual-shirt',
    description: 'Casual navy blue shirt', price: 1299,
    images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200'],
    category: 'Shirts', stock: 35, is_featured: true, is_new: true,
    rating: 4.7, review_count: 89, created_at: '2024-02-01',
  },
  {
    id: '3', name: 'Oversized Hoodie', slug: 'oversized-hoodie',
    description: 'Comfortable oversized hoodie', price: 2499, original_price: 2999,
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200'],
    category: 'Hoodies', stock: 42, is_featured: true, is_new: true,
    rating: 4.6, review_count: 234, created_at: '2024-02-05',
  },
  {
    id: '4', name: 'Baggy Cargo Pants', slug: 'baggy-cargo-pants',
    description: 'Relaxed fit cargo pants', price: 1899,
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=200'],
    category: 'Pants', stock: 28, is_featured: false, is_new: true,
    rating: 4.4, review_count: 67, created_at: '2024-02-10',
  },
];

const fallbackCategories: Category[] = [
  { id: '1', name: 'Shirts', slug: 'shirts', image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400', description: 'Premium casual and formal shirts' },
  { id: '2', name: 'Hoodies', slug: 'hoodies', image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400', description: 'Comfortable and stylish hoodies' },
  { id: '3', name: 'Pants', slug: 'pants', image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', description: 'Jeans, joggers, and trousers' },
  { id: '4', name: 'Baggies', slug: 'baggies', image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400', description: 'Relaxed fit baggy pants' },
  { id: '5', name: 'Torn Jeans', slug: 'torn-jeans', image_url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400', description: 'Distressed and ripped denim' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', original_price: '', category: '', stock: '', is_featured: false, is_new: false, images: [''],
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '', slug: '', description: '', image_url: '',
  });

  const menuItems = [
    { id: 'overview', icon: FiHome, label: 'Overview' },
    { id: 'products', icon: FiBox, label: 'Products' },
    { id: 'categories', icon: FiGrid, label: 'Categories' },
    { id: 'orders', icon: FiShoppingCart, label: 'Orders' },
    { id: 'customers', icon: FiUsers, label: 'Customers' },
    { id: 'analytics', icon: FiBarChart2, label: 'Analytics' },
    { id: 'settings', icon: FiSettings, label: 'Settings' },
  ];

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?limit=100');
        const data = await response.json();
        
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
          // Update stats with real count
          stats[3].value = data.products.length.toString();
        } else {
          setProducts(fallbackProducts);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts(fallbackProducts);
        setError('Using demo data - database connection failed');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (typeof p.category === 'string' && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.price || !productForm.category) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      const newProduct = {
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        original_price: productForm.original_price ? parseFloat(productForm.original_price) : undefined,
        category: productForm.category,
        stock: parseInt(productForm.stock) || 0,
        is_featured: productForm.is_featured,
        is_new: productForm.is_new,
        images: productForm.images.filter(Boolean),
      };

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        toast.success('Product added successfully');
        // Refresh products
        const refreshResponse = await fetch('/api/products?limit=100');
        const refreshData = await refreshResponse.json();
        setProducts(refreshData.products || fallbackProducts);
      } else {
        // Add locally for demo
        const localProduct: Product = {
          id: Date.now().toString(),
          ...newProduct,
          slug: productForm.name.toLowerCase().replace(/\s+/g, '-'),
          rating: 0,
          review_count: 0,
          created_at: new Date().toISOString(),
        };
        setProducts([localProduct, ...products]);
        toast.success('Product added (demo mode)');
      }
    } catch (err) {
      // Add locally for demo
      const localProduct: Product = {
        id: Date.now().toString(),
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        original_price: productForm.original_price ? parseFloat(productForm.original_price) : undefined,
        category: productForm.category,
        stock: parseInt(productForm.stock) || 0,
        is_featured: productForm.is_featured,
        is_new: productForm.is_new,
        images: productForm.images.filter(Boolean),
        slug: productForm.name.toLowerCase().replace(/\s+/g, '-'),
        rating: 0,
        review_count: 0,
        created_at: new Date().toISOString(),
      };
      setProducts([localProduct, ...products]);
      toast.success('Product added (demo mode)');
    }

    setShowAddProduct(false);
    setProductForm({ name: '', description: '', price: '', original_price: '', category: '', stock: '', is_featured: false, is_new: false, images: [''] });
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== id));
        toast.success('Product deleted successfully');
      } else {
        setProducts(products.filter(p => p.id !== id));
        toast.success('Product deleted (demo mode)');
      }
    } catch (err) {
      setProducts(products.filter(p => p.id !== id));
      toast.success('Product deleted (demo mode)');
    }
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.name || !categoryForm.slug) {
      toast.error('Please fill in required fields');
      return;
    }

    const newCategory: Category = {
      id: Date.now().toString(),
      name: categoryForm.name,
      slug: categoryForm.slug,
      description: categoryForm.description,
      image_url: categoryForm.image_url,
    };

    setCategories([...categories, newCategory]);
    toast.success('Category added (demo mode)');
    setShowAddCategory(false);
    setCategoryForm({ name: '', slug: '', description: '', image_url: '' });
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      {/* Error Banner */}
      {error && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-sm text-yellow-800">
          {error} - Changes will be saved locally until database connection is restored.
        </div>
      )}

      <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-6 px-4">Admin Panel</h2>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold capitalize">{activeTab}</h1>
            <p className="text-gray-500">Manage your store content</p>
          </div>
          {activeTab === 'products' && (
            <Button onClick={() => setShowAddProduct(true)}><FiPlus className="mr-2" />Add Product</Button>
          )}
          {activeTab === 'categories' && (
            <Button onClick={() => setShowAddCategory(true)}><FiPlus className="mr-2" />Add Category</Button>
          )}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <stat.icon className="text-gray-600" size={24} />
                    </div>
                    <span className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.trend === 'up' ? <FiTrendingUp size={16} /> : <FiTrendingDown size={16} />}
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <h2 className="text-lg font-bold">Recent Orders</h2>
                  <button onClick={() => setActiveTab('orders')} className="text-sm text-orange-500 hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { id: 'ORD-001', customer: 'John Doe', total: 1899, status: 'delivered' },
                        { id: 'ORD-002', customer: 'Sarah Smith', total: 2499, status: 'shipped' },
                        { id: 'ORD-003', customer: 'Mike Johnson', total: 3299, status: 'processing' },
                        { id: 'ORD-004', customer: 'Emily Davis', total: 899, status: 'pending' },
                      ].map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium">{order.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[order.status].bg} ${statusColors[order.status].text}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium">₹{order.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <h2 className="text-lg font-bold">Products ({products.length})</h2>
                  <button onClick={() => setActiveTab('products')} className="text-sm text-orange-500 hover:underline">Manage</button>
                </div>
                <div className="divide-y divide-gray-100">
                  {filteredProducts.slice(0, 5).map((product, index) => (
                    <div key={product.id} className="flex items-center p-4 hover:bg-gray-50">
                      <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium mr-4">{index + 1}</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-gray-500">{typeof product.category === 'string' ? product.category : 'Uncategorized'}</p>
                      </div>
                      <p className="font-medium">₹{product.price?.toLocaleString() || '0'}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-500">Loading products...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 relative">
                              {product.images?.[0] && (
                                <Image src={product.images[0]} alt={product.name || ''} fill className="object-cover" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-xs text-gray-500">{product.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">{typeof product.category === 'string' ? product.category : 'Uncategorized'}</td>
                        <td className="px-6 py-4 text-sm font-medium">₹{product.price?.toLocaleString() || '0'}</td>
                        <td className="px-6 py-4 text-sm">{product.stock || 0}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${(product.stock || 0) > 10 ? 'bg-green-100 text-green-800' : (product.stock || 0) > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                            {(product.stock || 0) > 10 ? 'In Stock' : (product.stock || 0) > 0 ? 'Low Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => { setProductForm({ ...product, price: product.price?.toString() || '', original_price: product.original_price?.toString() || '', category: typeof product.category === 'string' ? product.category : '', stock: product.stock?.toString() || '' } as any); setShowAddProduct(true); }} className="p-2 hover:bg-gray-100 rounded-lg">
                              <FiEdit size={16} />
                            </button>
                            <button onClick={() => handleDeleteProduct(product.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg">
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <motion.div key={category.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="h-40 bg-gray-100 relative">
                  {category.image_url && (
                    <Image src={category.image_url} alt={category.name || ''} fill className="object-cover" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.description}</p>
                  <p className="text-xs text-gray-400 mt-2">{category.slug}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <input type="text" placeholder="Search orders..." className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { id: 'ORD-001', customer: 'John Doe', items: 2, total: 1899, status: 'delivered', date: '2024-01-15' },
                    { id: 'ORD-002', customer: 'Sarah Smith', items: 1, total: 2499, status: 'shipped', date: '2024-01-15' },
                    { id: 'ORD-003', customer: 'Mike Johnson', items: 3, total: 3299, status: 'processing', date: '2024-01-14' },
                    { id: 'ORD-004', customer: 'Emily Davis', items: 1, total: 899, status: 'pending', date: '2024-01-14' },
                    { id: 'ORD-005', customer: 'Chris Wilson', items: 2, total: 1599, status: 'cancelled', date: '2024-01-13' },
                  ].map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium">{order.id}</td>
                      <td className="px-6 py-4 text-sm">{order.customer}</td>
                      <td className="px-6 py-4 text-sm">{order.items}</td>
                      <td className="px-6 py-4 text-sm font-medium">₹{order.total.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[order.status].bg} ${statusColors[order.status].text}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { name: 'John Doe', email: 'john@example.com', orders: 12, total: 45000, joined: '2024-01-15' },
                    { name: 'Sarah Smith', email: 'sarah@example.com', orders: 8, total: 32000, joined: '2024-02-01' },
                    { name: 'Mike Johnson', email: 'mike@example.com', orders: 5, total: 18000, joined: '2024-02-10' },
                  ].map((customer, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{customer.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{customer.email}</td>
                      <td className="px-6 py-4 text-sm">{customer.orders}</td>
                      <td className="px-6 py-4 text-sm font-medium">₹{customer.total.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{customer.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(activeTab === 'analytics' || activeTab === 'settings') && (
          <div className="bg-white rounded-xl p-8 text-center">
            <p className="text-gray-500">This section is under development</p>
          </div>
        )}
      </main>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold">Add New Product</h2>
              <button onClick={() => setShowAddProduct(false)} className="p-2 hover:bg-gray-100 rounded-lg"><FiX size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name *</label>
                <input type="text" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black" placeholder="Enter product name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black" rows={3} placeholder="Enter product description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price *</label>
                  <input type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Original Price</label>
                  <input type="number" value={productForm.original_price} onChange={(e) => setProductForm({ ...productForm, original_price: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black" placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black">
                    <option value="">Select category</option>
                    {categories.map((cat) => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock</label>
                  <input type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black" placeholder="0" />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={productForm.is_featured} onChange={(e) => setProductForm({ ...productForm, is_featured: e.target.checked })} className="w-4 h-4" />
                  <span className="text-sm">Featured</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={productForm.is_new} onChange={(e) => setProductForm({ ...productForm, is_new: e.target.checked })} className="w-4 h-4" />
                  <span className="text-sm">New Arrival</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Product Image URL</label>
                <input type="url" value={productForm.images[0]} onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black" placeholder="https://example.com/image.jpg" />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-4">
              <Button variant="outline" onClick={() => setShowAddProduct(false)}>Cancel</Button>
              <Button onClick={handleSaveProduct}><FiPlus className="mr-2" />Add Product</Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold">Add New Category</h2>
              <button onClick={() => setShowAddCategory(false)} className="p-2 hover:bg-gray-100 rounded-lg"><FiX size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category Name *</label>
                <input type="text" value={categoryForm.name} onChange={(e) => { setCategoryForm({ ...categoryForm, name: e.target.value, slug: generateSlug(e.target.value) }); }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black" placeholder="Enter category name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug *</label>
                <input type="text" value={categoryForm.slug} onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black" placeholder="category-slug" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black" rows={2} placeholder="Enter description" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category Image URL</label>
                <input type="url" value={categoryForm.image_url} onChange={(e) => setCategoryForm({ ...categoryForm, image_url: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black" placeholder="https://example.com/image.jpg" />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-4">
              <Button variant="outline" onClick={() => setShowAddCategory(false)}>Cancel</Button>
              <Button onClick={handleSaveCategory}><FiPlus className="mr-2" />Add Category</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
