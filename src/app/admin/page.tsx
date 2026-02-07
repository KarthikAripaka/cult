'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiPackage, FiUsers, FiShoppingBag, FiDollarSign, FiTrendingUp, FiTrendingDown, FiPlus, FiSearch, FiMoreVertical, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import Button from '@/components/ui/Button';

// Mock admin data
const stats = [
  { label: 'Total Revenue', value: '₹12,45,678', change: '+12.5%', trend: 'up', icon: FiDollarSign },
  { label: 'Total Orders', value: '1,234', change: '+8.2%', trend: 'up', icon: FiPackage },
  { label: 'Customers', value: '5,678', change: '+15.3%', trend: 'up', icon: FiUsers },
  { label: 'Conversion Rate', value: '3.2%', change: '-0.5%', trend: 'down', icon: FiTrendingUp },
];

const recentOrders = [
  { id: 'ORD-2024-001', customer: 'John Doe', items: 2, total: 1899, status: 'delivered', date: '2024-01-15' },
  { id: 'ORD-2024-002', customer: 'Sarah Smith', items: 1, total: 2499, status: 'shipped', date: '2024-01-15' },
  { id: 'ORD-2024-003', customer: 'Mike Johnson', items: 3, total: 3299, status: 'processing', date: '2024-01-14' },
  { id: 'ORD-2024-004', customer: 'Emily Davis', items: 1, total: 899, status: 'pending', date: '2024-01-14' },
  { id: 'ORD-2024-005', customer: 'Chris Wilson', items: 2, total: 1599, status: 'cancelled', date: '2024-01-13' },
];

const topProducts = [
  { id: '1', name: 'Premium Cotton T-Shirt', sold: 234, revenue: 45600 },
  { id: '2', name: 'Classic Denim Jeans', sold: 189, revenue: 67000 },
  { id: '3', name: 'Urban Jacket', sold: 156, revenue: 89000 },
  { id: '4', name: 'Oversized Hoodie', sold: 143, revenue: 52000 },
  { id: '5', name: 'Baggy Cargo Pants', sold: 128, revenue: 42000 },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  delivered: { bg: 'bg-green-100', text: 'text-green-800' },
  shipped: { bg: 'bg-purple-100', text: 'text-purple-800' },
  processing: { bg: 'bg-blue-100', text: 'text-blue-800' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      {/* Admin Sidebar */}
      <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-6 px-4">Admin Panel</h2>
          <nav className="space-y-1">
            {[
              { id: 'overview', icon: FiTrendingUp, label: 'Overview' },
              { id: 'orders', icon: FiShoppingBag, label: 'Orders' },
              { id: 'products', icon: FiPackage, label: 'Products' },
              { id: 'customers', icon: FiUsers, label: 'Customers' },
              { id: 'analytics', icon: FiDollarSign, label: 'Analytics' },
              { id: 'settings', icon: FiEdit, label: 'Settings' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
          </div>
          <Button>
            <FiPlus className="mr-2" />
            Add Product
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <stat.icon className="text-gray-600" size={24} />
                </div>
                <span className={`flex items-center gap-1 text-sm ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
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
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold">Recent Orders</h2>
              <Link href="/admin/orders" className="text-sm text-orange-500 hover:underline">
                View All
              </Link>
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
                  {recentOrders.map((order) => (
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

          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold">Top Products</h2>
              <Link href="/admin/products" className="text-sm text-orange-500 hover:underline">
                View All
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center p-4 hover:bg-gray-50">
                  <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium mr-4">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sold} sold</p>
                  </div>
                  <p className="font-medium">₹{product.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Manage Orders', icon: FiShoppingBag, color: 'bg-blue-500' },
            { label: 'Add New Product', icon: FiPlus, color: 'bg-green-500' },
            { label: 'Customer List', icon: FiUsers, color: 'bg-purple-500' },
            { label: 'View Reports', icon: FiTrendingUp, color: 'bg-orange-500' },
          ].map((action) => (
            <button
              key={action.label}
              className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white`}>
                <action.icon size={20} />
              </div>
              <span className="font-medium text-sm">{action.label}</span>
            </button>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
