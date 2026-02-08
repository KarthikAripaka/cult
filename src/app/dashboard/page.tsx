'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FiUser, FiPackage, FiHeart, FiSettings, FiLogOut, FiChevronRight, FiMail, FiPhone, FiMapPin, FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Order } from '@/types';

type Tab = 'overview' | 'orders' | 'wishlist' | 'settings';

const dashboardLinks = [
  { tab: 'overview', icon: FiUser, label: 'Overview', description: 'Dashboard overview' },
  { tab: 'orders', icon: FiPackage, label: 'My Orders', description: 'Track and view your orders' },
  { tab: 'wishlist', icon: FiHeart, label: 'Wishlist', description: 'Items you saved for later' },
  { tab: 'settings', icon: FiSettings, label: 'Account Settings', description: 'Manage your profile' },
];

// Mock addresses (in production, fetch from database)
const mockAddresses = [
  { id: '1', type: 'Home', address: '123 Main Street, Mumbai, Maharashtra 400001', default: true },
  { id: '2', type: 'Office', address: '456 Business Park, Mumbai, Maharashtra 400002', default: false },
];

function OrdersView() {
  const { user } = useAuthStore();
  // Use any type since Order type doesn't match the database response exactly
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/orders?userId=' + user.id);
        const data = await response.json();

        if (data.orders) {
          // Parse items JSON string back to object
          const parsedOrders = data.orders.map((order: any) => ({
            ...order,
            items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
            shipping_address: typeof order.shipping_address === 'string' 
              ? JSON.parse(order.shipping_address) 
              : order.shipping_address,
          }));
          setOrders(parsedOrders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">My Orders</h2>
        </div>
        <div className="text-center py-12 bg-white rounded-xl">
          <FiPackage size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">No orders yet</p>
          <Link href="/shop">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">My Orders</h2>
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-bold">{order.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-600">{(order.items as any[] || []).length} items</p>
              <p className="font-bold text-lg">₹{order.total}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
              <Button variant="outline" size="sm">View Details</Button>
              <Button variant="outline" size="sm">Track Order</Button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function WishlistView() {
  // Mock wishlist data for demo mode
  const mockWishlist = [
    { id: '1', name: 'Premium Cotton T-Shirt', price: 49.99 },
    { id: '5', name: 'Urban Jacket', price: 149.99 },
    { id: '11', name: 'Puffer Jacket', price: 189.99 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">My Wishlist</h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockWishlist.map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm group">
            <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
              <FiHeart className="text-gray-400" size={32} />
            </div>
            <h3 className="font-medium mb-1">{item.name}</h3>
            <p className="text-orange-500 font-bold mb-3">₹{item.price}</p>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">Add to Cart</Button>
              <button className="p-2 rounded-lg border border-gray-200 hover:bg-red-50 hover:text-red-500 transition-colors">
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function SettingsView() {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+91 98765 43210',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Profile Form */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
        <h2 className="text-xl font-bold mb-6">Profile Information</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="pt-4">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>

      {/* Addresses */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">My Addresses</h2>
          <Button variant="outline" size="sm">
            <FiPlus size={16} className="mr-2" />
            Add Address
          </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {mockAddresses.map((address) => (
            <div key={address.id} className="p-4 border border-gray-200 rounded-lg relative">
              {address.default && (
                <span className="absolute top-2 right-2 text-xs bg-orange-500 text-white px-2 py-1 rounded">
                  Default
                </span>
              )}
              <h3 className="font-bold mb-2">{address.type}</h3>
              <p className="text-gray-600 text-sm">{address.address}</p>
              <div className="flex gap-2 mt-4">
                <button className="text-sm text-gray-500 hover:text-gray-700">
                  <FiEdit2 size={14} className="inline mr-1" />
                  Edit
                </button>
                <button className="text-sm text-red-500 hover:text-red-700">
                  <FiTrash2 size={14} className="inline mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Change Password</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="pt-4">
            <Button type="submit">Update Password</Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

function OverviewView({ user }: { user: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Orders', value: '3' },
          { label: 'Wishlist Items', value: '12' },
          { label: 'Coupons', value: '2' },
          { label: 'Points', value: '500' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm text-center"
          >
            <p className="text-3xl font-bold text-orange-500">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Profile Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-sm mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Profile Information</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <FiMail className="text-gray-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <FiPhone className="text-gray-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">+91 98765 43210</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <FiMapPin className="text-gray-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Default Address</p>
              <p className="font-medium">Mumbai, Maharashtra</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { action: 'Order delivered', desc: 'ORD-2024-001', date: '2 days ago', type: 'order' },
            { action: 'Added to wishlist', desc: 'Premium Cotton T-Shirt', date: '3 days ago', type: 'wishlist' },
            { action: 'New coupon', desc: 'WELCOME10 applied', date: '1 week ago', type: 'coupon' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                {activity.type === 'order' && <FiPackage className="text-green-500" size={18} />}
                {activity.type === 'wishlist' && <FiHeart className="text-red-500" size={18} />}
                {activity.type === 'coupon' && <FiLogOut className="text-orange-500" size={18} />}
              </div>
              <div className="flex-1">
                <p className="font-medium">{activity.action}</p>
                <p className="text-sm text-gray-500">{activity.desc}</p>
              </div>
              <p className="text-sm text-gray-400">{activity.date}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Please Login</h1>
        <p className="text-gray-500 mb-6">You need to be logged in to access the dashboard.</p>
        <Link href="/auth/login">
          <Button>Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Header */}
      <section className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user.name || 'User'}!</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24">
              {/* Profile Section */}
              <div className="p-6 text-center border-b border-gray-100">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600">
                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="font-bold">{user.name || 'User'}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>

              {/* Navigation */}
              <nav className="p-4">
                {dashboardLinks.map((link) => (
                  <button
                    key={link.tab}
                    onClick={() => setActiveTab(link.tab as Tab)}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors mb-2 w-full text-left ${
                      activeTab === link.tab
                        ? 'bg-orange-500 text-white'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <link.icon size={20} />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{link.label}</p>
                    </div>
                    <FiChevronRight size={16} />
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-red-500 transition-colors w-full mt-4"
                >
                  <FiLogOut size={20} />
                  <span className="font-medium text-sm">Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && <OverviewView key="overview" user={user} />}
              {activeTab === 'orders' && <OrdersView key="orders" />}
              {activeTab === 'wishlist' && <WishlistView key="wishlist" />}
              {activeTab === 'settings' && <SettingsView key="settings" />}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
