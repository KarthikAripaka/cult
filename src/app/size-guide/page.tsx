'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FiChevronDown } from 'react-icons/fi';

type SizeChartType = 'tops' | 'bottoms' | 'footwear' | 'accessories';

const sizeCharts: Record<SizeChartType, { name: string; headers: string[]; rows: Record<string, string[]> }> = {
  tops: {
    name: 'Tops & Outerwear',
    headers: ['Size', 'Chest (in)', 'Shoulder (in)', 'Length (in)', 'Sleeve (in)'],
    rows: {
      'XS': ['34-36', '17-18', '26-27', '24'],
      'S': ['36-38', '18-19', '27-28', '25'],
      'M': ['38-40', '19-20', '28-29', '26'],
      'L': ['40-42', '20-21', '29-30', '27'],
      'XL': ['42-44', '21-22', '30-31', '28'],
      'XXL': ['44-46', '22-23', '31-32', '29'],
    },
  },
  bottoms: {
    name: 'Bottoms',
    headers: ['Size', 'Waist (in)', 'Hip (in)', 'Inseam (in)', 'Rise (in)'],
    rows: {
      '28': ['28', '36', '30', '10'],
      '30': ['30', '38', '30', '10.5'],
      '32': ['32', '40', '31', '11'],
      '34': ['34', '42', '32', '11.5'],
      '36': ['36', '44', '32', '12'],
      '38': ['38', '46', '33', '12.5'],
    },
  },
  footwear: {
    name: 'Footwear (UK Size)',
    headers: ['UK', 'US', 'EU', 'Foot Length (cm)'],
    rows: {
      '6': ['6', '7', '40', '24.5'],
      '7': ['7', '8', '41', '25.5'],
      '8': ['8', '9', '42', '26.5'],
      '9': ['9', '10', '43', '27.5'],
      '10': ['10', '11', '44', '28.5'],
      '11': ['11', '12', '45', '29.5'],
    },
  },
  accessories: {
    name: 'Accessories',
    headers: ['Item', 'S/M', 'L/XL', 'One Size'],
    rows: {
      'Belts': ['28-34', '36-40', '-'],
      'Caps': ['22-22.5', '23-23.5', '22-24'],
      'Gloves': ['S', 'L', 'M'],
    },
  },
};

const measurementTips = [
  { title: 'Chest/Bust', desc: 'Measure around the fullest part of your chest/bust, keeping the tape horizontal.' },
  { title: 'Waist', desc: 'Find the natural waistline, usually above your belly button.' },
  { title: 'Hips', desc: 'Measure around the fullest part of your hips, about 8 inches below your waist.' },
  { title: 'Inseam', desc: 'Measure from the crotch to the bottom of your leg, along the inside.' },
];

export default function SizeGuidePage() {
  const [activeTab, setActiveTab] = useState<SizeChartType>('tops');

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero Section */}
      <section className="bg-black text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Size Guide</h1>
            <p className="text-gray-400">
              Find your perfect fit with our comprehensive size charts
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <div className="bg-gray-50 sticky top-20 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-4 py-4 overflow-x-auto">
            {(['tops', 'bottoms', 'footwear', 'accessories'] as SizeChartType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {sizeCharts[tab].name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Size Chart */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold mb-6">{sizeCharts[activeTab].name} Size Chart</h2>
            
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    {sizeCharts[activeTab].headers.map((header) => (
                      <th key={header} className="px-6 py-4 text-left font-medium text-gray-700">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(sizeCharts[activeTab].rows).map(([size, values], index) => (
                    <tr
                      key={size}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-6 py-4 font-bold">{size}</td>
                      {values.map((value, i) => (
                        <td key={i} className="px-6 py-4 text-gray-600">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How to Measure */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold mb-4">How to Measure</h2>
            <p className="text-gray-600">
              Follow these simple steps for accurate measurements
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {measurementTips.map((tip, index) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <h3 className="font-bold text-lg mb-2">{tip.title}</h3>
                <p className="text-gray-600">{tip.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-6">Tips for Finding Your Size</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-orange-50 rounded-xl p-6">
                <h3 className="font-bold text-orange-800 mb-3">If You're Between Sizes</h3>
                <p className="text-gray-700">
                  We recommend sizing up for a more relaxed fit and sizing down for a fitted look. 
                  Check the product description for fit information.
                </p>
              </div>
              
              <div className="bg-orange-50 rounded-xl p-6">
                <h3 className="font-bold text-orange-800 mb-3">International Sizes</h3>
                <p className="text-gray-700">
                  Our sizes follow Indian/International standards. If you're ordering from another 
                  country, use the conversion chart above.
                </p>
              </div>
              
              <div className="bg-orange-50 rounded-xl p-6">
                <h3 className="font-bold text-orange-800 mb-3">Product-Specific Fit</h3>
                <p className="text-gray-700">
                  Some products may fit differently due to their design. Check the product 
                  page for specific fit notes.
                </p>
              </div>
              
              <div className="bg-orange-50 rounded-xl p-6">
                <h3 className="font-bold text-orange-800 mb-3">Need Help?</h3>
                <p className="text-gray-700">
                  Contact our customer support team for personalized size assistance. 
                  We're happy to help you find the perfect fit!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Return Policy Reminder */}
      <section className="py-12 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-4">Easy Returns if It Doesn't Fit</h2>
            <p className="text-gray-400 mb-6">
              Not sure about your size? No worries! We offer 30-day easy returns 
              so you can exchange for the perfect fit.
            </p>
            <button className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
              View Return Policy
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
