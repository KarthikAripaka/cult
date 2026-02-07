'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiAward, FiTruck, FiShield, FiUsers, FiArrowRight } from 'react-icons/fi';
import Button from '@/components/ui/Button';

const stats = [
  { value: '50K+', label: 'Happy Customers' },
  { value: '500+', label: 'Products' },
  { value: '100+', label: 'Cities' },
  { value: '4.8', label: 'Rating' },
];

const values = [
  { icon: FiHeart, title: 'Quality First', desc: 'Premium materials and craftsmanship in every piece' },
  { icon: FiShield, title: 'Trust & Safety', desc: 'Secure payments and data protection' },
  { icon: FiTruck, title: 'Fast Delivery', desc: 'Quick and reliable shipping across India' },
  { icon: FiUsers, title: 'Community', desc: 'Building a community of fashion enthusiasts' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920"
          alt="About CULT"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white px-4"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">About CULT</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-200">
              We're on a mission to make premium fashion accessible to everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">{stat.value}</p>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                CULT was born from a simple idea: everyone deserves to look and feel their best without breaking the bank. Founded in 2020, we started as a small team with big dreams and a passion for fashion.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Today, we've grown into a trusted fashion destination serving thousands of customers across India. Our curated collection blends global trends with Indian sensibilities, creating styles that are both contemporary and timeless.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Every piece in our collection is handpicked for quality, style, and value. We work directly with manufacturers to bring you premium products at prices that make sense.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[500px] rounded-2xl overflow-hidden"
            >
              <Image
                src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800"
                alt="Our team"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do, from product selection to customer service.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-sm text-center"
              >
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="text-orange-500" size={32} />
                </div>
                <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="relative h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800"
                alt="Quality fashion"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose CULT?</h2>
                <div className="space-y-6">
                  {[
                    'Premium quality at affordable prices',
                    'Free shipping on orders above ₹2000',
                    '30-day easy returns',
                    'Secure payment options',
                    'Dedicated customer support',
                    'Regular new arrivals',
                  ].map((item, index) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3"
                    >
                      <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <FiHeart className="text-green-500" size={14} />
                      </span>
                      <span className="font-medium">{item}</span>
                    </motion.div>
                  ))}
                </div>
                <Link href="/shop" className="inline-block mt-8">
                  <Button size="lg">
                    Explore Collection
                    <FiArrowRight className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <FiAward className="mx-auto text-orange-500 mb-6" size={48} />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the CULT Community</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Be the first to know about new arrivals, exclusive offers, and style inspiration.
            </p>
            <Link href="/auth/signup">
              <Button variant="accent" size="lg">
                Create an Account
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
