'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiSearch } from 'react-icons/fi';
import Button from '@/components/ui/Button';

const faqs = [
  {
    question: 'How do I track my order?',
    answer: 'Once your order is shipped, you will receive an email with a tracking number. You can also track your order by logging into your account and visiting the Orders section.'
  },
  {
    question: 'What is the return policy?',
    answer: 'We offer a 30-day return policy. Items must be unworn, unwashed, and with original tags attached. Returns are free for all orders.'
  },
  {
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days. Orders are processed within 24 hours.'
  },
  {
    question: 'Is there free shipping?',
    answer: 'Yes! We offer free shipping on all orders above ₹2000. For orders below ₹2000, a shipping fee of ₹150 applies.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit/debit cards (Visa, Mastercard, RuPay), UPI, wallets (Paytm, PhonePe, Google Pay), and cash on delivery.'
  },
  {
    question: 'How do I apply a coupon code?',
    answer: 'You can apply a coupon code during checkout. Enter the code in the "Coupon Code" field and click "Apply". The discount will be reflected in your order total.'
  },
  {
    question: 'Can I cancel my order?',
    answer: 'You can cancel your order within 2 hours of placing it. After that, if the order has not been shipped, contact customer support for assistance.'
  },
  {
    question: 'How do I change my password?',
    answer: 'Log into your account and navigate to Profile > Security. Click on "Change Password" and follow the instructions. You will receive a verification email.'
  },
];

const helpCategories = [
  { name: 'Orders & Shipping', icon: '📦', count: 12 },
  { name: 'Returns & Refunds', icon: '↩️', count: 8 },
  { name: 'Payment', icon: '💳', count: 6 },
  { name: 'Account', icon: '👤', count: 5 },
  { name: 'Sizing', icon: '📏', count: 4 },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">How can we help?</h1>
          <p className="text-gray-600">Find answers to common questions</p>
        </motion.div>

        {/* Search */}
        <div className="relative mb-12">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-black text-lg"
          />
        </div>

        {/* Help Categories */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {helpCategories.map((category, idx) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow cursor-pointer"
            >
              <span className="text-3xl mb-3 block">{category.icon}</span>
              <p className="font-medium">{category.name}</p>
              <p className="text-sm text-gray-500">{category.count} articles</p>
            </motion.div>
          ))}
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          {filteredFaqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <span className="font-medium">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openFaq === idx ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiChevronDown size={20} />
                </motion.div>
              </button>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-4 text-gray-600">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-black text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
          <p className="text-gray-300 mb-6">
            Our customer support team is available 24/7 to assist you.
          </p>
          <Button variant="accent">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
