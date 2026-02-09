'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FiPackage, FiUsers, FiDollarSign, FiTrendingUp, 
  FiTrendingDown, FiPlus, FiSearch, FiEdit, 
  FiTrash2, FiX, FiGrid,
  FiHome, FiBox, FiShoppingCart, FiBarChart2, FiSettings,
  FiAlertCircle, FiLoader
} from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { Product, Category } from '@/types';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store';

const statusColors: Record<string, { bg: string; text: string }> = {
  delivered: { bg: 'bg-green-100', text: 'text-green-800' },
  shipped: { bg: 'bg-purple-100', text: 'text-purple-800' },
  processing: { bg: 'bg-blue-100', text: 'text-blue-800' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
};

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
}

export default function AdminPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
  });

  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', original_price: '', category: '', stock: '', is_featured: false, is_new: false, images: [''],
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '', slug: '', description: '', image_url: '', sort_order: 0, is_active: true,
  });

  const [editingCategory, setEditingCategory] = useState<string | null>(null);

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
        
        if (data.error) {
          setError(data.error);
        } else if (data.products) {
          setProducts(data.products);
          setStats(prev => ({ ...prev, totalProducts: data.products.length }));
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products');
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
        
        if (data.error) {
          setError(data.error);
        } else if (data.categories) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to fetch categories');
      } finally {
        setLoading(false);
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
        if (refreshData.products) {
          setProducts(refreshData.products);
          setStats(prev => ({ ...prev, totalProducts: refreshData.products.length }));
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to add product');
      }
    } catch (err) {
      console.error('Error adding product:', err);
      toast.error('Failed to add product');
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
        setStats(prev => ({ ...prev, totalProducts: prev.totalProducts - 1 }));
        toast.success('Product deleted successfully');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to delete product');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error('Failed to delete product');
    }
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.name || !categoryForm.slug) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      let response;
      
      if (editingCategory) {
        // Update existing category
        response = await fetch('/api/admin/categories', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ categoryId: editingCategory, ...categoryForm }),
        });
      } else {
        // Create new category
        response = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryForm),
        });
      }

      if (response.ok) {
        toast.success(editingCategory ? 'Category updated successfully' : 'Category added successfully');
        // Refresh categories
        const refreshResponse = await fetch('/api/categories');
        const refreshData = await refreshResponse.json();
        if (refreshData.categories) {
          setCategories(refreshData.categories);
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to save category');
      }
    } catch (err) {
      console.error('Error saving category:', err);
      toast.error('Failed to save category');
    }

    setShowAddCategory(false);
    setEditingCategory(null);
    setCategoryForm({ name: '', slug: '', description: '', image_url: '', sort_order: 0, is_active: true });
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category.id);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image_url: category.image_url || '',
      sort_order: category.sort_order || 0,
      is_active: category.is_active ?? true,
    });
    setShowAddCategory(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(`/api/admin/categories?id=${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Category deleted successfully');
        // Refresh categories
        const refreshResponse = await fetch('/api/categories');
        const refreshData = await refreshResponse.json();
        if (refreshData.categories) {
          setCategories(refreshData.categories);
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to delete category');
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      toast.error('Failed to delete category');
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <FiLoader className="animate-spin text-2xl text-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <FiAlertCircle className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Admin Dashboard</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
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
        
        {/* Back to Store Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
          >
            <FiHome size={18} />
            Back to Store
          </Link>
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
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FiDollarSign className="text-gray-600" size={24} />
                  </div>
                  <span className="flex items-center gap-1 text-sm text-green-600">
                    <FiTrendingUp size={16} />+12.5%
                  </span>
                </div>
                <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString() || '0'}</p>
                <p className="text-sm text-gray-500">Total Revenue</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FiPackage className="text-gray-600" size={24} />
                  </div>
                  <span className="flex items-center gap-1 text-sm text-green-600">
                    <FiTrendingUp size={16} />+8.2%
                  </span>
                </div>
                <p className="text-2xl font-bold">{stats.totalOrders || '0'}</p>
                <p className="text-sm text-gray-500">Total Orders</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FiUsers className="text-gray-600" size={24} />
                  </div>
                  <span className="flex items-center gap-1 text-sm text-green-600">
                    <FiTrendingUp size={16} />+15.3%
                  </span>
                </div>
                <p className="text-2xl font-bold">{stats.totalCustomers || '0'}</p>
                <p className="text-sm text-gray-500">Customers</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FiBox className="text-gray-600" size={24} />
                  </div>
                </div>
                <p className="text-2xl font-bold">{stats.totalProducts}</p>
                <p className="text-sm text-gray-500">Products</p>
              </motion.div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <h2 className="text-lg font-bold">Recent Orders</h2>
                  <button onClick={() => setActiveTab('orders')} className="text-sm text-orange-500 hover:underline">View All</button>
                </div>
                <div className="p-6 text-center text-gray-500">
                  <FiShoppingCart className="mx-auto mb-2" size={32} />
                  <p>Orders will appear here</p>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <h2 className="text-lg font-bold">Products ({products.length})</h2>
                  <button onClick={() => setActiveTab('products')} className="text-sm text-orange-500 hover:underline">Manage</button>
                </div>
                <div className="divide-y divide-gray-100">
                  {products.slice(0, 5).map((product, index) => (
                    <div key={product.id} className="flex items-center p-4 hover:bg-gray-50">
                      <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium mr-4">{index + 1}</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-gray-500">{typeof product.category === 'string' ? product.category : 'Uncategorized'}</p>
                      </div>
                      <p className="font-medium">₹{product.price?.toLocaleString() || '0'}</p>
                    </div>
                  ))}
                  {products.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                      <FiBox className="mx-auto mb-2" size={32} />
                      <p>No products yet</p>
                    </div>
                  )}
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
              {products.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  <FiBox className="mx-auto mb-4" size={48} />
                  <p>No products found. Add your first product to get started.</p>
                </div>
              )}
            </div>
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
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold">{category.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {category.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                  <p className="text-xs text-gray-400 mt-2">{category.slug}</p>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                    >
                      <FiEdit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-medium text-red-600 transition-colors"
                    >
                      <FiTrash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            {categories.length === 0 && (
              <div className="col-span-full p-12 text-center text-gray-500 bg-white rounded-xl">
                <FiGrid className="mx-auto mb-4" size={48} />
                <p>No categories found. Add your first category to get started.</p>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 text-center text-gray-500">
              <FiShoppingCart className="mx-auto mb-4" size={48} />
              <p>Orders management coming soon</p>
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 text-center text-gray-500">
              <FiUsers className="mx-auto mb-4" size={48} />
              <p>Customers management coming soon</p>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 text-center text-gray-500">
              <FiBarChart2 className="mx-auto mb-4" size={48} />
              <p>Analytics dashboard coming soon</p>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 text-center text-gray-500">
              <FiSettings className="mx-auto mb-4" size={48} />
              <p>Settings page coming soon</p>
            </div>
          </div>
        )}
      </main>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Add New Product</h2>
              <button onClick={() => setShowAddProduct(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <FiX size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name *</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="Product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="Product description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price *</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Original Price</label>
                  <input
                    type="number"
                    value={productForm.original_price}
                    onChange={(e) => setProductForm({ ...productForm, original_price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  >
                    <option value="">Select Category</option>
                    {categories.filter(c => c.is_active).map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <Button variant="outline" onClick={() => setShowAddProduct(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleSaveProduct} className="flex-1">Add Product</Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
              <button onClick={() => { setShowAddCategory(false); setEditingCategory(null); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <FiX size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category Name *</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value, slug: editingCategory ? categoryForm.slug : generateSlug(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="Category name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug *</label>
                <input
                  type="text"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="category-slug"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sort Order</label>
                <input
                  type="number"
                  value={categoryForm.sort_order || 0}
                  onChange={(e) => setCategoryForm({ ...categoryForm, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={categoryForm.is_active ? 'active' : 'inactive'}
                  onChange={(e) => setCategoryForm({ ...categoryForm, is_active: e.target.value === 'active' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <Button variant="outline" onClick={() => { setShowAddCategory(false); setEditingCategory(null); }} className="flex-1">Cancel</Button>
              <Button onClick={handleSaveCategory} className="flex-1">{editingCategory ? 'Update Category' : 'Add Category'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
