'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FiPackage, FiTruck, FiCheck, FiX, FiClock, FiArrowRight } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { Order } from '@/types';
import toast from 'react-hot-toast';

// Demo orders for when database is unavailable
const demoOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    user_id: 'demo-user',
    items: [
      { product: { id: '1', name: 'Premium Cotton T-Shirt', images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200'] }, quantity: 2, price: 49.99, size: 'M', color: 'White' },
      { product: { id: '2', name: 'Classic Denim Jeans', images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=200'] }, quantity: 1, price: 89.99, size: '32', color: 'Blue' },
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
    user_id: 'demo-user',
    items: [
      { product: { id: '3', name: 'Urban Jacket', images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200'] }, quantity: 1, price: 149.99, size: 'L', color: 'Black' },
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
    user_id: 'demo-user',
    items: [
      { product: { id: '4', name: 'Oversized Hoodie', images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200'] }, quantity: 1, price: 69.99, size: 'XL', color: 'Gray' },
      { product: { id: '5', name: 'Track Pants', images: ['https://images.unsplash.com/photo-1483721310020-03333e577078?w=200'] }, quantity: 2, price: 49.99, size: 'L', color: 'Black' },
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
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load orders - in production, fetch from API
    setOrders(demoOrders);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (orderId && orders.length > 0) {
      const order = orders.find((o: Order) => o.id === orderId);
      if (order) setSelectedOrder(order);
    }
  }, [orderId, orders]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (selectedOrder) {
    const status = statusConfig[selectedOrder.status as keyof typeof statusConfig];
    const StatusIcon = status?.icon || FiPackage;

    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <button
            onClick={() => setSelectedOrder(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-black mb-6"
          >
            <FiArrowRight className="rotate-180" />
            Back to Orders
          </button>

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
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${status?.bg || 'bg-gray-100'} ${status?.color || 'text-gray-600'}`}>
                <StatusIcon size={18} />
                <span className="font-medium">{status?.label || selectedOrder.status}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h2 className="text-lg font-bold mb-4">Order Items</h2>
            <div className="space-y-4">
              {selectedOrder.items.map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-20 h-24 relative rounded-lg overflow-hidden bg-gray-100">
                    {item.product?.images?.[0] && (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name || 'Product'}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product?.name || 'Product'}</h3>
                    <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                    {item.size && <p className="text-xs text-gray-400">Size: {item.size}</p>}
                    {item.color && <p className="text-xs text-gray-400">Color: {item.color}</p>}
                  </div>
                  <p className="font-medium">₹{(item.quantity * item.price).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4">Payment Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{selectedOrder.shipping === 0 ? 'Free' : `₹${selectedOrder.shipping}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>₹{selectedOrder.tax?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>₹{selectedOrder.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4">Shipping Address</h2>
              {selectedOrder.shipping_address && (
                <div className="text-gray-600">
                  <p className="font-medium">{selectedOrder.shipping_address.name}</p>
                  <p>{selectedOrder.shipping_address.address_line1}</p>
                  <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.pincode}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-gray-500 mb-8">Track and manage your orders</p>

          {orders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl">
              <FiPackage size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">No orders yet</p>
              <Link href="/shop">
                <Button>Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order: Order) => {
                const status = statusConfig[order.status as keyof typeof statusConfig];
                const StatusIcon = status?.icon || FiPackage;
                
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 relative">
                          {order.items[0]?.product?.images?.[0] && (
                            <Image
                              src={order.items[0].product.images[0]}
                              alt={order.items[0].product.name || 'Product'}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-gray-500">
                            {order.items.length} item{order.items.length > 1 ? 's' : ''} • ₹{order.total?.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(order.created_at).toLocaleDateString('en-IN', {
                              year: 'numeric', month: 'long', day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${status?.bg || 'bg-gray-100'} ${status?.color || 'text-gray-600'}`}>
                          <StatusIcon size={14} />
                          <span className="text-sm font-medium">{status?.label || order.status}</span>
                        </div>
                        <Link href={`/orders?id=${order.id}`}>
                          <Button variant="outline" size="sm">View Details</Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
