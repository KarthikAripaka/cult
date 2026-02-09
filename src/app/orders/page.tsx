'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { FiPackage, FiTruck, FiCheck, FiX, FiClock, FiArrowRight, FiShoppingBag, FiAlertCircle } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store';
import { Order } from '@/types';

const statusConfig = {
  pending: { icon: FiClock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Pending' },
  processing: { icon: FiPackage, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Processing' },
  shipped: { icon: FiTruck, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Shipped' },
  delivered: { icon: FiCheck, color: 'text-green-600', bg: 'bg-green-100', label: 'Delivered' },
  cancelled: { icon: FiX, color: 'text-red-600', bg: 'bg-red-100', label: 'Cancelled' },
};

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const orderIdParam = searchParams.get('id');
  const orderNumberParam = searchParams.get('orderNumber');
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/orders?userId=${user.id}`);
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
        } else if (data.orders) {
          setOrders(data.orders);
        }
      } catch (err) {
        setError('Failed to fetch orders. Please try again.');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Fetch single order if ID or orderNumber provided
  useEffect(() => {
    const fetchSingleOrder = async () => {
      const orderId = orderIdParam || orderNumberParam;
      if (!orderId || !user?.id) return;
      
      setLoading(true);
      try {
        const response = await fetch(`/api/orders?userId=${user.id}&${orderNumberParam ? 'orderNumber' : 'id'}=${orderId}`);
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
        } else if (data.order) {
          setSelectedOrder(data.order);
        }
      } catch (err) {
        setError('Failed to fetch order details.');
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSingleOrder();
  }, [orderIdParam, orderNumberParam, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <FiAlertCircle className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Orders</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  // Show order details
  if (selectedOrder) {
    const status = statusConfig[selectedOrder.status as keyof typeof statusConfig];
    const StatusIcon = status?.icon || FiPackage;

    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <button
            onClick={() => {
              setSelectedOrder(null);
              router.push('/orders');
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-black mb-6"
          >
            <FiArrowRight className="rotate-180" />
            Back to Orders
          </button>

          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <h1 className="text-2xl font-bold">{selectedOrder.order_number || selectedOrder.id}</h1>
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

          {/* Order Items */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h2 className="text-lg font-bold mb-4">Order Items</h2>
            <div className="space-y-4">
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                selectedOrder.items.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-20 h-24 relative rounded-lg overflow-hidden bg-gray-100">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name || 'Product'}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name || 'Product'}</h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                      {item.size && <p className="text-xs text-gray-400">Size: {item.size}</p>}
                      {item.color && <p className="text-xs text-gray-400">Color: {item.color}</p>}
                    </div>
                    <p className="font-medium">₹{(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Order details not available</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4">Payment Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.subtotal?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>₹{selectedOrder.total?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4">Shipping Address</h2>
              {selectedOrder.shipping_address ? (
                <div className="text-gray-600">
                  <p className="font-medium">{(selectedOrder.shipping_address as any).name}</p>
                  <p>{(selectedOrder.shipping_address as any).address_line1}</p>
                  <p>{(selectedOrder.shipping_address as any).city}, {(selectedOrder.shipping_address as any).state} {(selectedOrder.shipping_address as any).pincode}</p>
                </div>
              ) : (
                <p className="text-gray-500">Address not available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show orders list
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-gray-500 mb-8">Track and manage your orders</p>

          {!user ? (
            <div className="text-center py-12 bg-white rounded-xl">
              <FiPackage size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">Please login to view your orders</p>
              <Link href="/auth/login">
                <Button>Login to View Orders</Button>
              </Link>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl">
              <FiPackage size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">No orders yet</p>
              <Link href="/shop">
                <Button>
                  <FiShoppingBag className="mr-2" />
                  Start Shopping
                </Button>
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
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                          <FiPackage size={24} className="text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium">{order.order_number || order.id}</p>
                          <p className="text-sm text-gray-500">
                            {order.items?.length || 0} items • ₹{order.total?.toFixed(2) || '0.00'}
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
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
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
