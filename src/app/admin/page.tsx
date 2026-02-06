'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiPackage, FiDollarSign, FiTrendingUp, FiShoppingBag, FiEdit2, FiTrash2, FiPlus, FiEye, FiSearch, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import Button from '@/components/ui/Button';

const stats = [
  { label: 'Total Revenue', value: '₹12,45,678', change: '+12.5%', icon: FiDollarSign, color: 'green' },
  { label: 'Orders', value: '1,234', change: '+8.2%', icon: FiPackage, color: 'blue' },
  { label: 'Customers', value: '5,678', change: '+15.3%', icon: FiUsers, color: 'purple' },
  { label: 'Products', value: '456', change: '+2.1%', icon: FiShoppingBag, color: 'orange' },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'Rahul Sharma', amount: 4999, status: 'delivered', date: '2024-01-15' },
  { id: 'ORD-002', customer: 'Priya Patel', amount: 2999, status: 'shipped', date: '2024-01-20' },
  { id: 'ORD-003', customer: 'Amit Kumar', amount: 7999, status: 'processing', date: '2024-01-25' },
  { id: 'ORD-004', customer: 'Sneha Gupta', amount: 1599, status: 'pending', date: '2024-01-26' },
  { id: 'ORD-005', customer: 'Vikram Singh', amount: 4500, status: 'delivered', date: '2024-01-27' },
];

const products = [
  { id: '1', name: 'Premium Cotton T-Shirt', price: 49.99, stock: 100, category: 'New Arrivals' },
  { id: '2', name: 'Designer Denim Jacket', price: 149.99, stock: 50, category: 'Men' },
  { id: '3', name: 'Elegant Silk Dress', price: 299.99, stock: 30, category: 'Women' },
  { id: '4', name: 'Minimalist Watch', price: 199.99, stock: 75, category: 'Accessories' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FiTrendingUp },
    { id: 'orders', label: 'Orders', icon: FiPackage },
    { id: 'products', label: 'Products', icon: FiShoppingBag },
    { id: 'customers', label: 'Customers', icon: FiUsers },
    { id: 'coupons', label: 'Coupons', icon: FiDollarSign },
  ];

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="flex">
        {/* Sidebar */}
        <div className="fixed left-0 top-20 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <nav className="p-4 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-black text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1 p-8">
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-2xl font-bold mb-8">Dashboard Overview</h1>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-xl shadow-sm p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}>
                        <stat.icon size={24} />
                      </div>
                      <span className={`text-sm flex items-center gap-1 text-green-600`}>
                        <FiArrowUp size={14} />
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-lg font-bold">Recent Orders</h2>
                  <Button size="sm" variant="outline" onClick={() => setActiveTab('orders')}>
                    View All
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium">{order.id}</td>
                          <td className="px-6 py-4 text-sm">{order.customer}</td>
                          <td className="px-6 py-4 text-sm font-medium">₹{order.amount.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <FiEye size={16} />
                              </button>
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <FiEdit2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Products Management</h1>
                <Button leftIcon={<FiPlus size={18} />}>
                  Add Product
                </Button>
              </div>

              {/* Search */}
              <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
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

              {/* Products Table */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium">{product.name}</td>
                          <td className="px-6 py-4 text-sm">₹{product.price}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={product.stock < 50 ? 'text-red-600' : 'text-green-600'}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{product.category}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <FiEdit2 size={16} />
                              </button>
                              <button className="p-1 hover:bg-gray-100 rounded text-red-500">
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {(activeTab === 'orders' || activeTab === 'customers' || activeTab === 'coupons') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <h2 className="text-2xl font-bold mb-4">{tabs.find(t => t.id === activeTab)?.label}</h2>
              <p className="text-gray-500">This section is coming soon...</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
