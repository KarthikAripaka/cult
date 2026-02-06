'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FiPackage, FiEye, FiTruck, FiCheckCircle, FiClock, FiXCircle, FiChevronRight } from 'react-icons/fi';
import Button from '@/components/ui/Button';

const orders = [
  {
    id: 'ORD-2024-001',
    date: '2024-01-25',
    status: 'delivered',
    total: 4999,
    items: [
      { name: 'Premium Cotton T-Shirt', quantity: 2, price: 49.99, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=80' },
      { name: 'Designer Denim Jacket', quantity: 1, price: 149.99, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&q=80' },
    ],
  },
  {
    id: 'ORD-2024-002',
    date: '2024-01-28',
    status: 'shipped',
    total: 2999,
    items: [
      { name: 'Oversized Hoodie', quantity: 1, price: 69.99, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=80' },
    ],
  },
  {
    id: 'ORD-2024-003',
    date: '2024-01-30',
    status: 'processing',
    total: 7999,
    items: [
      { name: 'Classic Denim Jeans', quantity: 2, price: 89.99, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&q=80' },
    ],
  },
];

const statusConfig = {
  delivered: { icon: FiCheckCircle, color: 'green', label: 'Delivered' },
  shipped: { icon: FiTruck, color: 'blue', label: 'Shipped' },
  processing: { icon: FiClock, color: 'yellow', label: 'Processing' },
  cancelled: { icon: FiXCircle, color: 'red', label: 'Cancelled' },
  pending: { icon: FiPackage, color: 'gray', label: 'Pending' },
};

export default function OrdersPage() {
  const [filter, setFilter] = useState('all');

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </motion.div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'processing', 'shipped', 'delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === status
                  ? 'bg-black text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order, idx) => {
            const status = statusConfig[order.status as keyof typeof statusConfig];
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-medium">{order.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{order.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <status.icon size={20} className={`text-${status.color}-500`} />
                      <span className={`text-sm font-medium text-${status.color}-600`}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex gap-4">
                        <div className="relative w-20 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          <p className="font-medium mt-1">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-xl font-bold">₹{order.total.toLocaleString()}</p>
                    </div>
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                        <FiChevronRight className="ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <FiPackage size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
