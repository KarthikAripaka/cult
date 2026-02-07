'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiChevronDown, FiSearch, FiShoppingBag, FiTruck, FiRefreshCw, FiShield, FiCreditCard, FiUser, FiMail } from 'react-icons/fi';
import Button from '@/components/ui/Button';

const faqCategories = [
  {
    title: 'Orders & Shipping',
    icon: FiTruck,
    faqs: [
      { q: 'How can I track my order?', a: 'You can track your order by logging into your account and visiting the Orders section. We also send tracking updates via email and SMS once your order is shipped.' },
      { q: 'How long does shipping take?', a: 'Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days. Delivery times may vary based on your location.' },
      { q: 'Do you offer free shipping?', a: 'Yes! We offer free shipping on all orders above ₹2000. For orders below ₹2000, a shipping fee of ₹150 applies.' },
      { q: 'Can I change my shipping address after ordering?', a: 'Address changes can only be made within 1 hour of placing your order. Please contact our support team immediately for assistance.' },
    ],
  },
  {
    title: 'Returns & Refunds',
    icon: FiRefreshCw,
    faqs: [
      { q: 'What is your return policy?', a: 'We offer a 30-day easy return policy. Items must be unused, unwashed, and in original packaging with all tags attached. Sale items can only be exchanged.' },
      { q: 'How do I initiate a return?', a: 'Log into your account, go to Orders, select the item you want to return, and click on "Return Item". Follow the instructions to schedule a pickup.' },
      { q: 'When will I receive my refund?', a: 'Refunds are processed within 5-7 business days after we receive and inspect your return. The amount will be credited to your original payment method.' },
      { q: 'Can I exchange an item?', a: 'Yes! You can exchange items for a different size or color within 30 days. Log into your account to initiate an exchange.' },
    ],
  },
  {
    title: 'Payment',
    icon: FiCreditCard,
    faqs: [
      { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards (Visa, Mastercard, RuPay), UPI, net banking, and cash on delivery.' },
      { q: 'Is cash on delivery available?', a: 'Yes! Cash on delivery is available on all orders. A COD fee of ₹50 applies.' },
      { q: 'Is my payment information secure?', a: 'Absolutely! We use industry-standard encryption and are PCI-DSS compliant to ensure your payment information is always secure.' },
    ],
  },
  {
    title: 'Account',
    icon: FiUser,
    faqs: [
      { q: 'How do I create an account?', a: 'Click on the "Sign Up" button in the top right corner. Fill in your details and verify your email to create your account.' },
      { q: 'How can I reset my password?', a: 'Go to the login page and click "Forgot Password". Enter your email and follow the instructions to reset your password.' },
      { q: 'Can I delete my account?', a: 'Yes, you can request account deletion by contacting our support team. Please note this action is irreversible.' },
    ],
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero Section */}
      <section className="bg-black text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">How can we help?</h1>
            <p className="text-gray-400 mb-8">
              Search our help center or browse categories below
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help..."
                className="w-full pl-12 pr-4 py-4 rounded-full bg-white text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 -mt-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: FiShoppingBag, label: 'Track Order', href: '/orders' },
              { icon: FiRefreshCw, label: 'Returns', href: '#returns' },
              { icon: FiShield, label: 'Secure Payment', href: '#payment' },
              { icon: FiMail, label: 'Contact Us', href: '/contact' },
            ].map((link, index) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <link.icon size={32} className="text-orange-500 mb-3" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          {searchQuery && filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <FiSearch size={48} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-bold mb-2">No results found</h2>
              <p className="text-gray-500 mb-6">
                We couldn't find any answers matching "{searchQuery}"
              </p>
              <Link href="/contact">
                <Button>Contact Support</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredCategories.map((category) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <category.icon className="text-orange-500" size={20} />
                    </div>
                    <h2 className="text-2xl font-bold">{category.title}</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {category.faqs.map((faq, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => setOpenFaq(openFaq === index ? null : index)}
                          className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-left">{faq.q}</span>
                          <FiChevronDown 
                            size={20} 
                            className={`transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                          />
                        </button>
                        <AnimatePresence>
                          {openFaq === index && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <p className="p-4 bg-gray-50 text-gray-600">
                                {faq.a}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
            <p className="text-gray-600 mb-8">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <Link href="/contact">
              <Button size="lg">
                Contact Support
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Policies Links */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Terms & Conditions',
                links: ['Terms of Service', 'Privacy Policy', 'Cookie Policy'],
              },
              {
                title: 'Shipping',
                links: ['Delivery Information', 'Shipping Rates', 'International Shipping'],
              },
              {
                title: 'Returns',
                links: ['Return Policy', 'Refund Timeline', 'Exchange Process'],
              },
            ].map((section) => (
              <div key={section.title}>
                <h3 className="font-bold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
