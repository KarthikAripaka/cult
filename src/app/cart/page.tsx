'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight, FiTag } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { useCartStore, useAuthStore } from '@/store';
import toast from 'react-hot-toast';
import { SHIPPING_THRESHOLD, SHIPPING_COST, TAX_RATE } from '@/constants/shipping';

export default function CartPage() {
  const { user } = useAuthStore();
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const subtotal = getTotal();
  const shipping = subtotal > SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const discount = appliedCoupon 
    ? appliedCoupon.discount_type === 'percentage'
      ? Math.min((subtotal * appliedCoupon.discount) / 100, appliedCoupon.max_discount || 10000)
      : appliedCoupon.discount
    : 0;
  const total = subtotal + shipping + tax - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setApplyingCoupon(true);

    try {
      const response = await fetch(`/api/coupons?code=${couponCode}`);
      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
        setAppliedCoupon(null);
        return;
      }

      if (subtotal < data.coupon.min_order) {
        toast.error(`Minimum order value of ₹${data.coupon.min_order} required`);
        return;
      }

      setAppliedCoupon(data.coupon);
      toast.success('Coupon applied!');
    } catch (error) {
      toast.error('Failed to apply coupon');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8"
            >
              <FiShoppingBag size={80} className="mx-auto text-gray-300" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <Link href="/shop">
              <Button size="lg">
                Continue Shopping
                <FiArrowRight className="ml-2" />
              </Button>
            </Link>
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
          <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-gray-400">{items.length} items in your cart</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-4 shadow-sm flex gap-4"
              >
                {/* Product Image */}
                <Link href={`/product/${item.product?.slug}`} className="relative w-28 h-36 flex-shrink-0">
                  {item.product?.images?.[0] && (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product?.name || 'Product'}
                      fill
                      className="object-cover rounded-lg"
                    />
                  )}
                </Link>

                {/* Product Info */}
                <div className="flex-1">
                  <Link href={`/product/${item.product?.slug}`}>
                    <h3 className="font-medium hover:text-orange-500 transition-colors">
                      {item.product?.name}
                    </h3>
                  </Link>
                  
                  <p className="text-sm text-gray-500 mt-1">
                    {item.color} / {item.size}
                  </p>
                  
                  <p className="font-semibold mt-2">
                    ₹{item.product?.price.toLocaleString()}
                  </p>

                  {/* Quantity & Remove */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <FiMinus size={16} />
                      </button>
                      <span className="w-10 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                        disabled={item.quantity >= (item.product?.stock || 10)}
                      >
                        <FiPlus size={16} />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        removeItem(item.id);
                        toast.success('Item removed from cart');
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="font-semibold">
                    ₹{((item.product?.price || 0) * item.quantity).toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Clear Cart */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  clearCart();
                  toast.success('Cart cleared');
                }}
                className="text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-28">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              {/* Coupon Code */}
              {!appliedCoupon ? (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Coupon Code
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black text uppercase"
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleApplyCoupon}
                      disabled={applyingCoupon}
                    >
                      Apply
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Try: WELCOME10, FLAT500, SUMMER20
                  </p>
                </div>
              ) : (
                <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-green-800">{appliedCoupon.code}</p>
                      <p className="text-sm text-green-600">
                        {appliedCoupon.discount_type === 'percentage' 
                          ? `${appliedCoupon.discount}% off` 
                          : `₹${appliedCoupon.discount} off`}
                      </p>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* Summary Details */}
              <div className="space-y-3 border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (18%)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center border-t border-gray-200 pt-4 mb-6">
                <span className="text-xl font-bold">Total</span>
                <span className="text-xl font-bold">₹{total.toLocaleString()}</span>
              </div>

              {/* Checkout Button */}
              <Link href={user ? "/checkout" : "/auth/login?redirect=/checkout"}>
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                  <FiArrowRight className="ml-2" />
                </Button>
              </Link>

              {/* Continue Shopping */}
              <Link href="/shop">
                <Button variant="ghost" className="w-full mt-4">
                  Continue Shopping
                </Button>
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-500">Secure</p>
                    <p className="text-sm font-medium">Payment</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Easy</p>
                    <p className="text-sm font-medium">Returns</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Free</p>
                    <p className="text-sm font-medium">Shipping</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
