'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const footerLinks = {
  shop: [
    { label: 'New Arrivals', href: '/shop' },
    { label: 'Men', href: '/shop' },
    { label: 'Women', href: '/shop' },
    { label: 'Accessories', href: '/shop' },
    { label: 'Sale', href: '/shop' },
  ],
  help: [
    { label: 'Customer Service', href: '/shop' },
    { label: 'Track Order', href: '/shop' },
    { label: 'Returns & Exchanges', href: '/shop' },
    { label: 'Shipping Info', href: '/shop' },
    { label: 'Size Guide', href: '/shop' },
  ],
  company: [
    { label: 'About Us', href: '/shop' },
    { label: 'Careers', href: '/shop' },
    { label: 'Press', href: '/shop' },
    { label: 'Sustainability', href: '/shop' },
    { label: 'Contact', href: '/shop' },
  ],
};

const socialLinks = [
  { icon: FiInstagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: FiTwitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: FiFacebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: FiYoutube, href: 'https://youtube.com', label: 'YouTube' },
];

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Join the CULT</h3>
              <p className="text-gray-400">
                Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
              </p>
            </div>
            <form className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-bold tracking-tighter">CULT</span>
            </Link>
            <p className="mt-4 text-gray-400 text-sm">
              Premium fashion for the modern individual. Quality, style, and sustainability in every piece.
            </p>
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="font-semibold mb-4">Help</h4>
            <ul className="space-y-2">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center gap-2">
                <FiMail size={16} />
                <a href="mailto:support@cult.fashion" className="hover:text-white transition-colors">
                  support@cult.fashion
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FiPhone size={16} />
                <a href="tel:+911234567890" className="hover:text-white transition-colors">
                  +91 1234567890
                </a>
              </li>
              <li className="flex items-start gap-2">
                <FiMapPin size={16} className="mt-1" />
                <span>123 Fashion Street, Mumbai, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} CULT. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <Link href="/shop" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/shop" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/shop" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visa/visa-original.svg" alt="Visa" className="h-8" />
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mastercard/mastercard-original.svg" alt="Mastercard" className="h-8" />
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/paypal/paypal-original.svg" alt="PayPal" className="h-8" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
