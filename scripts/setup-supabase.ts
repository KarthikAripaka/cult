/**
 * Supabase Seed Script - Matches schema-complete.sql
 * Run: npx tsx scripts/setup-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Add Supabase credentials to .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Categories (simplified schema)
const categories = [
  { name: 'T-Shirts', slug: 'tshirts', sort_order: 1 },
  { name: 'Jeans', slug: 'jeans', sort_order: 2 },
  { name: 'Hoodies', slug: 'hoodies', sort_order: 3 },
  { name: 'Jackets', slug: 'jackets', sort_order: 4 },
  { name: 'Accessories', slug: 'accessories', sort_order: 5 },
  { name: 'Women', slug: 'women', sort_order: 6 },
  { name: 'Footwear', slug: 'footwear', sort_order: 7 },
];

// Products (simplified schema - variants handle sizes/colors)
const products = [
  { name: 'Premium Cotton T-Shirt', slug: 'premium-cotton-tshirt', description: 'High-quality organic cotton t-shirt', price: 499, original_price: 799, category_slug: 'tshirts', stock: 100, is_featured: true, is_new: true },
  { name: 'Graphic Print T-Shirt', slug: 'graphic-print-tshirt', description: 'Modern graphic print t-shirt', price: 599, original_price: 899, category_slug: 'tshirts', stock: 75, is_featured: true, is_new: true },
  { name: 'Classic Denim Jeans', slug: 'classic-denim-jeans', description: 'Premium denim jeans with stretch comfort', price: 1599, original_price: 2499, category_slug: 'jeans', stock: 80, is_featured: true, is_new: true },
  { name: 'Slim Fit Chinos', slug: 'slim-fit-chinos', description: 'Classic slim fit chinos', price: 1399, original_price: 2099, category_slug: 'jeans', stock: 55, is_featured: false, is_new: false },
  { name: 'Oversized Hoodie', slug: 'oversized-hoodie', description: 'Comfortable oversized hoodie', price: 1299, original_price: 1899, category_slug: 'hoodies', stock: 60, is_featured: true, is_new: true },
  { name: 'Urban Jacket', slug: 'urban-jacket', description: 'Stylish urban jacket', price: 2499, original_price: 3499, category_slug: 'jackets', stock: 30, is_featured: true, is_new: false },
  { name: 'Leather Belt', slug: 'leather-belt', description: 'Premium leather belt', price: 899, original_price: 1399, category_slug: 'accessories', stock: 100, is_featured: false, is_new: false },
  { name: 'Sunglasses', slug: 'sunglasses', description: 'Classic wayfarer sunglasses', price: 999, original_price: 1599, category_slug: 'accessories', stock: 60, is_featured: true, is_new: true },
  { name: 'Floral Midi Dress', slug: 'floral-midi-dress', description: 'Beautiful floral print dress', price: 1899, original_price: 2799, category_slug: 'women', stock: 45, is_featured: true, is_new: true },
  { name: 'Running Sneakers', slug: 'running-sneakers', description: 'Lightweight running sneakers', price: 2999, original_price: 4499, category_slug: 'footwear', stock: 50, is_featured: true, is_new: true },
];

// Product Variants (sizes/colors)
const productVariants = [
  // T-Shirt variants
  { product_slug: 'premium-cotton-tshirt', size: 'S', color: 'White', sku: 'PCT-W-S', stock: 25 },
  { product_slug: 'premium-cotton-tshirt', size: 'M', color: 'White', sku: 'PCT-W-M', stock: 25 },
  { product_slug: 'premium-cotton-tshirt', size: 'L', color: 'White', sku: 'PCT-W-L', stock: 25 },
  { product_slug: 'premium-cotton-tshirt', size: 'XL', color: 'White', sku: 'PCT-W-XL', stock: 25 },
  { product_slug: 'graphic-print-tshirt', size: 'S', color: 'Black', sku: 'GPT-B-S', stock: 20 },
  { product_slug: 'graphic-print-tshirt', size: 'M', color: 'Black', sku: 'GPT-B-M', stock: 20 },
  { product_slug: 'graphic-print-tshirt', size: 'L', color: 'Black', sku: 'GPT-B-L', stock: 20 },
  { product_slug: 'graphic-print-tshirt', size: 'XL', color: 'Black', sku: 'GPT-B-XL', stock: 15 },
  // Jeans variants
  { product_slug: 'classic-denim-jeans', size: '30', color: 'Dark Blue', sku: 'CDJ-DB-30', stock: 20 },
  { product_slug: 'classic-denim-jeans', size: '32', color: 'Dark Blue', sku: 'CDJ-DB-32', stock: 20 },
  { product_slug: 'classic-denim-jeans', size: '34', color: 'Dark Blue', sku: 'CDJ-DB-34', stock: 20 },
  { product_slug: 'classic-denim-jeans', size: '36', color: 'Dark Blue', sku: 'CDJ-DB-36', stock: 20 },
  // Hoodie variants
  { product_slug: 'oversized-hoodie', size: 'M', color: 'Black', sku: 'OH-B-M', stock: 15 },
  { product_slug: 'oversized-hoodie', size: 'L', color: 'Black', sku: 'OH-B-L', stock: 15 },
  { product_slug: 'oversized-hoodie', size: 'XL', color: 'Black', sku: 'OH-B-XL', stock: 15 },
  // Footwear variants
  { product_slug: 'running-sneakers', size: '8', color: 'White', sku: 'RS-W-8', stock: 10 },
  { product_slug: 'running-sneakers', size: '9', color: 'White', sku: 'RS-W-9', stock: 10 },
  { product_slug: 'running-sneakers', size: '10', color: 'White', sku: 'RS-W-10', stock: 10 },
  { product_slug: 'running-sneakers', size: '11', color: 'White', sku: 'RS-W-11', stock: 10 },
  { product_slug: 'running-sneakers', size: '8', color: 'Black', sku: 'RS-B-8', stock: 10 },
];

// Coupons (simplified)
const coupons = [
  { code: 'WELCOME20', discount_type: 'percent', discount_value: 20, is_active: true },
  { code: 'FLAT500', discount_type: 'flat', discount_value: 500, is_active: true },
  { code: 'FREESHIP', discount_type: 'flat', discount_value: 0, is_active: true },
  { code: 'SPECIAL30', discount_type: 'percent', discount_value: 30, is_active: true },
];

async function seed() {
  console.log('🚀 Seeding Supabase database...\n');

  try {
    // Create categories
    console.log('📁 Creating categories...');
    for (const category of categories) {
      await supabase.from('categories').upsert(category, { onConflict: 'slug' });
    }
    console.log(`✅ Created ${categories.length} categories`);

    // Get category IDs
    const { data: categoryIds } = await supabase.from('categories').select('id, slug');
    const categoryMap = new Map(categoryIds?.map(c => [c.slug, c.id]) || []);

    // Create products
    console.log('👕 Creating products...');
    for (const product of products) {
      const categoryId = categoryMap.get(product.category_slug);
      if (!categoryId) continue;

      const { category_slug, ...productData } = product;
      await supabase.from('products').upsert({
        ...productData,
        id: uuidv4(),
        category_id: categoryId,
        avg_rating: 0,
        review_count: 0,
      }, { onConflict: 'slug' });
    }
    console.log(`✅ Created ${products.length} products`);

    // Get product IDs
    const { data: productIds } = await supabase.from('products').select('id, slug');
    const productMap = new Map(productIds?.map(p => [p.slug, p.id]) || []);

    // Create product variants
    console.log('📦 Creating product variants...');
    for (const variant of productVariants) {
      const productId = productMap.get(variant.product_slug);
      if (!productId) continue;

      const { product_slug, ...variantData } = variant;
      await supabase.from('product_variants').upsert({
        ...variantData,
        id: uuidv4(),
        product_id: productId,
        price_modifier: 0,
        is_active: true,
      }, { onConflict: 'product_id, size, color' });
    }
    console.log(`✅ Created ${productVariants.length} product variants`);

    // Create coupons
    console.log('🏷️ Creating coupons...');
    for (const coupon of coupons) {
      await supabase.from('coupons').upsert(coupon, { onConflict: 'code' });
    }
    console.log(`✅ Created ${coupons.length} coupons`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Configure .env.local with your Supabase URL and anon key');
    console.log('   2. Run "npm run dev" to start the server');

  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seed();
