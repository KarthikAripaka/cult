'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FiUser, FiMapPin, FiHeart, FiClock, FiPackage, FiCreditCard, FiLogOut, FiEdit2, FiPlus, FiChevronRight } from 'react-icons/fi';
import { useAuthStore } from '@/store';
import Button from '@/components/ui/Button';

const mockOrders = [
  { id: 'ORD-001', date: '2024-01-15', status: 'delivered', total: 4999, items: 3 },
  { id: 'ORD-002', date: '2024-01-20', status: 'shipped', total: 2999, items: 2 },
  { id: 'ORD-003', date: '2024-01-25', status: 'processing', total: 7999, items: 1 },
];

const mockAddresses = [
  { id: '1', name: 'Home', address: '123 Main St, Mumbai, Maharashtra 400001', isDefault: true },
  { id: '2', name: 'Office', address: '456 Business Park, Mumbai, Maharashtra 400002', isDefault: false },
];

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('orders');

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please login to view your dashboard</h1>
          <Link href="/auth/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'orders', label: 'Orders', icon: FiPackage },
    { id: 'addresses', label: 'Addresses', icon: FiMapPin },
    { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
    { id: 'profile', label: 'Profile', icon: FiUser },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-6 mb-8"
        >
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden">
              {user.avatar_url ? (
                <Image src={user.avatar_url} alt={user.name || ''} width={80} height={80} className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-black text-white text-2xl font-bold">
                  {user.name?.charAt(0) || user.email.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name || 'User'}</h1>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500 mt-1">Member since {new Date(user.created_at).getFullYear()}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-32">
              <nav className="p-4">
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
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-red-50 text-red-600 mt-4"
                >
                  <FiLogOut size={20} />
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'orders' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-bold mb-6">Your Orders</h2>
                {mockOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <FiClock size={14} />
                          {order.date}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{order.items} items</span>
                      <span className="font-bold">₹{order.total.toLocaleString()}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-end">
                      <button className="text-sm text-orange-500 hover:underline flex items-center gap-1">
                        View Details <FiChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'addresses' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Your Addresses</h2>
                  <Button size="sm" leftIcon={<FiPlus size={16} />}>
                    Add New
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockAddresses.map((address) => (
                    <div key={address.id} className="bg-white rounded-xl shadow-sm p-6 relative">
                      {address.isDefault && (
                        <span className="absolute top-4 right-4 px-2 py-1 bg-black text-white text-xs rounded">
                          Default
                        </span>
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        <FiMapPin size={18} />
                        <span className="font-medium">{address.name}</span>
                      </div>
                      <p className="text-gray-600 text-sm">{address.address}</p>
                      <button className="mt-4 text-sm text-gray-500 hover:text-black flex items-center gap-1">
                        <FiEdit2 size={14} /> Edit
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'wishlist' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-xl font-bold mb-6">Your Wishlist</h2>
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <FiHeart size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Your wishlist is empty</p>
                  <Link href="/shop" className="mt-4 inline-block">
                    <Button variant="outline">Start Shopping</Button>
                  </Link>
                </div>
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h2 className="text-xl font-bold mb-6">Profile Information</h2>
                <form className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user.name}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    />
                  </div>
                  <Button>Save Changes</Button>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
