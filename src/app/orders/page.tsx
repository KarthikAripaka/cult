'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FiPackage, FiTruck, FiCheck, FiX, FiClock, FiEye, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import Button from '@/components/ui/Button';

// Mock orders data
const mockOrders = [
  {
    id: 'ORD-2024-001',
    items: [
      { product: { name: 'Premium Cotton T-Shirt', images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200'] }, quantity: 2, price: 49.99 },
      { product: { name: 'Classic Denim Jeans', images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=200'] }, quantity: 1, price: 89.99 },
    ],
    subtotal: 189.97,
    shipping: 150,
    tax: 34.20,
    total: 374.17,
    status: 'delivered',
    payment_status: 'paid',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    shipping_address: {
      name: 'John Doe',
      address_line1: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
    },
  },
  {
    id: 'ORD-2024-002',
    items: [
      { product: { name: 'Urban Jacket', images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200'] }, quantity: 1, price: 149.99 },
    ],
    subtotal: 149.99,
    shipping: 0,
    tax: 27.00,
    total: 176.99,
    status: 'shipped',
    payment_status: 'paid',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    shipping_address: {
      name: 'John Doe',
      address_line1: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
    },
  },
  {
    id: 'ORD-2024-003',
    items: [
      { product: { name: 'Oversized Hoodie', images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200'] }, quantity: 1, price: 69.99 },
      { product: { name: 'Track Pants', images: ['https://images.unsplash.com/photo-1483721310020-03333e577078?w=200'] }, quantity: 2, price: 49.99 },
    ],
    subtotal: 169.97,
    shipping: 0,
    tax: 30.60,
    total: 200.57,
    status: 'processing',
    payment_status: 'paid',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    shipping_address: {
      name: 'John Doe',
      address_line1: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
    },
  },
];

const statusConfig = {
  pending: { icon: FiClock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Pending' },
  processing: { icon: FiPackage, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Processing' },
  shipped: { icon: FiTruck, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Shipped' },
  delivered: { icon: FiCheck, color: 'text-green-600', bg: 'bg-green-100', label: 'Delivered' },
  cancelled: { icon: FiX, color: 'text-red-600', bg: 'bg-red-100', label: 'Cancelled' },
};

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orders, setOrders] = useState(mockOrders);

  useEffect(() => {
    if (orderId) {
      const order = orders.find(o => o.id === orderId);
      if (order) setSelectedOrder(order);
    }
  }, [orderId, orders]);

  if (selectedOrder) {
    const status = statusConfig[selectedOrder.status as keyof typeof statusConfig];
    const StatusIcon = status.icon;

    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Back Button */}
          <button
            onClick={() => setSelectedOrder(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-black mb-6"
          >
            <FiArrowRight className="rotate-180" />
            Back to Orders
          </button>

          {/* Order Header */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <h1 className="text-2xl font-bold">{selectedOrder.id}</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Placed on {new Date(selectedOrder.created_at).toLocaleDateString('en-IN', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${status.bg} ${status.color}`}>
                <StatusIcon size={18} />
                <span className="font-medium">{status.label}</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h2 className="text-lg font-bold mb-4">Order Items</h2>
            <div className="space-y-4">
              {selectedOrder.items.map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-20 h-24 relative rounded-lg overflow-hidden">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{selectedOrder.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{selectedOrder.shipping === 0 ? 'Free' : `₹${selectedOrder.shipping}`}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>₹{selectedOrder.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-3 border-t">
                <span>Total</span>
                <span>₹{selectedOrder.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Shipping Address</h2>
            <p className="text-gray-600">
              {selectedOrder.shipping_address.name}<br />
              {selectedOrder.shipping_address.address_line1}<br />
              {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} - {selectedOrder.shipping_address.pincode}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Header */}
      <section className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-gray-400">{orders.length} orders placed</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <FiShoppingBag size={60} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold mb-2">No Orders Yet</h2>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
            <Link href="/shop">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const status = statusConfig[order.status as keyof typeof statusConfig];
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                      {/* First Product Image */}
                      <div className="w-20 h-24 relative rounded-lg overflow-hidden hidden sm:block">
                        <Image
                          src={order.items[0].product.images[0]}
                          alt={order.items[0].product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{order.id}</p>
                        <h3 className="font-bold">
                          {order.items.length > 1 
                            ? `${order.items[0].product.name} + ${order.items.length - 1} more`
                            : order.items[0].product.name
                          }
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {order.items.reduce((acc: number, item: any) => acc + item.quantity, 0)} items • ₹{order.total.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${status.bg} ${status.color}`}>
                        <StatusIcon size={16} />
                        <span className="text-sm font-medium">{status.label}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <FiEye className="mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
