'use client';

import { motion } from 'framer-motion';

const sizeCharts = {
  men: {
    title: "Men's Size Guide",
    sizes: [
      { size: 'XS', chest: '36-38', waist: '28-30', hip: '35-37' },
      { size: 'S', chest: '38-40', waist: '30-32', hip: '37-39' },
      { size: 'M', chest: '40-42', waist: '32-34', hip: '39-41' },
      { size: 'L', chest: '42-44', waist: '34-36', hip: '41-43' },
      { size: 'XL', chest: '44-46', waist: '36-38', hip: '43-45' },
      { size: 'XXL', chest: '46-48', waist: '38-40', hip: '45-47' },
    ],
  },
  women: {
    title: "Women's Size Guide",
    sizes: [
      { size: 'XS', bust: '32-34', waist: '24-26', hip: '34-36' },
      { size: 'S', bust: '34-36', waist: '26-28', hip: '36-38' },
      { size: 'M', bust: '36-38', waist: '28-30', hip: '38-40' },
      { size: 'L', bust: '38-40', waist: '30-32', hip: '40-42' },
      { size: 'XL', bust: '40-42', waist: '32-34', hip: '42-44' },
      { size: 'XXL', bust: '42-44', waist: '34-36', hip: '44-46' },
    ],
  },
  shoes: {
    title: 'Shoe Size Guide',
    sizes: [
      { size: '6', uk: '5.5', eu: '39', cm: '24' },
      { size: '7', uk: '6.5', eu: '40', cm: '25' },
      { size: '8', uk: '7.5', eu: '41', cm: '26' },
      { size: '9', uk: '8.5', eu: '42', cm: '27' },
      { size: '10', uk: '9.5', eu: '43', cm: '28' },
      { size: '11', uk: '10.5', eu: '44', cm: '29' },
      { size: '12', uk: '11.5', eu: '45', cm: '30' },
    ],
  },
};

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Size Guide</h1>
          <p className="text-gray-600">Find your perfect fit</p>
        </motion.div>

        {/* Men */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="bg-black text-white p-6">
              <h2 className="text-xl font-bold">{sizeCharts.men.title}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chest (inches)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waist (inches)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hip (inches)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sizeCharts.men.sizes.map((size) => (
                    <tr key={size.size} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{size.size}</td>
                      <td className="px-6 py-4">{size.chest}</td>
                      <td className="px-6 py-4">{size.waist}</td>
                      <td className="px-6 py-4">{size.hip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </section>

        {/* Women */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="bg-black text-white p-6">
              <h2 className="text-xl font-bold">{sizeCharts.women.title}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bust (inches)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waist (inches)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hip (inches)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sizeCharts.women.sizes.map((size) => (
                    <tr key={size.size} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{size.size}</td>
                      <td className="px-6 py-4">{size.bust}</td>
                      <td className="px-6 py-4">{size.waist}</td>
                      <td className="px-6 py-4">{size.hip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </section>

        {/* Shoes */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="bg-black text-white p-6">
              <h2 className="text-xl font-bold">{sizeCharts.shoes.title}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">US Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">UK Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">EU Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sizeCharts.shoes.sizes.map((size) => (
                    <tr key={size.size} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{size.size}</td>
                      <td className="px-6 py-4">{size.uk}</td>
                      <td className="px-6 py-4">{size.eu}</td>
                      <td className="px-6 py-4">{size.cm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </section>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-orange-50 rounded-xl p-6"
        >
          <h3 className="font-bold mb-4">💡 Tips for Perfect Fit</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Measure yourself while wearing lightweight clothing</li>
            <li>• Use a flexible measuring tape for accurate measurements</li>
            <li>• If you're between sizes, we recommend sizing up</li>
            <li>• Refer to the specific product description for any size variations</li>
            <li>• Still unsure? Contact our customer support for assistance</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
