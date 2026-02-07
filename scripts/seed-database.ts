/**
 * Database Seed Script for Cult Fashion E-commerce
 * Run this script to populate your Supabase database with mock data
 * 
 * Usage: npx ts-node scripts/seed-database.ts
 */

import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Configuration - Replace with your Supabase credentials
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Mock Categories Data
const categories = [
  {
    id: uuidv4(),
    name: 'New Arrivals',
    slug: 'new-arrivals',
    image_url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Men',
    slug: 'men',
    image_url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Women',
    slug: 'women',
    image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Accessories',
    slug: 'accessories',
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Sale',
    slug: 'sale',
    image_url: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&q=80',
    created_at: new Date().toISOString(),
  },
];

// Mock Products Data
const products = [
  {
    id: uuidv4(),
    name: 'Premium Cotton T-Shirt',
    slug: 'premium-cotton-tshirt',
    description: 'High-quality organic cotton t-shirt with a comfortable fit. Perfect for everyday wear.',
    price: 49.99,
    original_price: 79.99,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'],
    category_id: categories[1].id, // Men
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Navy'],
    stock: 100,
    is_featured: true,
    is_new: true,
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Classic Denim Jeans',
    slug: 'classic-denim-jeans',
    description: 'Premium denim jeans with modern fit. Features a comfortable stretch fabric.',
    price: 89.99,
    original_price: 129.99,
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80'],
    category_id: categories[1].id, // Men
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: ['Blue', 'Black', 'Light Blue'],
    stock: 75,
    is_featured: true,
    is_new: true,
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Oversized Hoodie',
    slug: 'oversized-hoodie',
    description: 'Comfortable oversized hoodie made from premium cotton blend.',
    price: 69.99,
    original_price: 99.99,
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80'],
    category_id: categories[1].id, // Men
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Gray', 'Black', 'Navy', 'Olive'],
    stock: 60,
    is_featured: true,
    is_new: true,
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Baggy Cargo Pants',
    slug: 'baggy-cargo-pants',
    description: 'Street-style baggy cargo pants with multiple pockets.',
    price: 79.99,
    original_price: 109.99,
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80'],
    category_id: categories[1].id, // Men
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: ['Black', 'Olive', 'Khaki', 'Gray'],
    stock: 45,
    is_featured: true,
    is_new: true,
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Urban Jacket',
    slug: 'urban-jacket',
    description: 'Stylish urban jacket for men. Perfect for layering.',
    price: 149.99,
    original_price: 199.99,
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80'],
    category_id: categories[1].id, // Men
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'Brown'],
    stock: 30,
    is_featured: true,
    is_new: false,
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Graphic Print T-Shirt',
    slug: 'graphic-print-tshirt',
    description: 'Modern graphic print t-shirt with unique designs.',
    price: 39.99,
    original_price: 59.99,
    images: ['https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80'],
    category_id: categories[1].id, // Men
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Red'],
    stock: 80,
    is_featured: false,
    is_new: true,
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Slim Fit Chinos',
    slug: 'slim-fit-chinos',
    description: 'Classic slim fit chinos. Versatile for casual and semi-formal occasions.',
    price: 59.99,
    original_price: 89.99,
    images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80'],
    category_id: categories[1].id, // Men
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Beige', 'Navy', 'Black'],
    stock: 55,
    is_featured: false,
    is_new: false,
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Track Pants',
    slug: 'track-pants',
    description: 'Comfortable track pants for sports and casual wear.',
    price: 49.99,
    original_price: 69.99,
    images: ['https://images.unsplash.com/photo-1483721310020-03333e577078?w=600&q=80'],
    category_id: categories[1].id, // Men
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Gray', 'Navy'],
    stock: 70,
    is_featured: false,
    is_new: true,
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Leather Belt',
    slug: 'leather-belt',
    description: 'Premium leather belt with classic buckle.',
    price: 34.99,
    original_price: 49.99,
    images: ['https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&q=80'],
    category_id: categories[3].id, // Accessories
    sizes: ['32', '34', '36', '38', '40'],
    colors: ['Black', 'Brown'],
    stock: 100,
    is_featured: false,
    is_new: false,
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Classic Cap',
    slug: 'classic-cap',
    description: 'Stylish baseball cap. One size fits most.',
    price: 24.99,
    original_price: 34.99,
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80'],
    category_id: categories[3].id, // Accessories
    sizes: ['One Size'],
    colors: ['Black', 'Navy', 'White', 'Red'],
    stock: 120,
    is_featured: false,
    is_new: true,
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Puffer Jacket',
    slug: 'puffer-jacket',
    description: 'Warm puffer jacket for winter. Lightweight and insulated.',
    price: 189.99,
    original_price: 249.99,
    images: ['https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=80'],
    category_id: categories[1].id, // Men
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'Olive'],
    stock: 25,
    is_featured: true,
    is_new: false,
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Basic Crew Neck',
    slug: 'basic-crew-neck',
    description: 'Essential crew neck t-shirt. Perfect for layering.',
    price: 29.99,
    original_price: 39.99,
    images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80'],
    category_id: categories[1].id, // Men
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black', 'Gray', 'Navy'],
    stock: 150,
    is_featured: false,
    is_new: false,
    created_at: new Date().toISOString(),
  },
];

// Mock Coupons Data
const coupons = [
  {
    id: uuidv4(),
    code: 'WELCOME10',
    discount: 10,
    discount_type: 'percentage',
    min_order: 0,
    max_discount: 100,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    code: 'FLAT500',
    discount: 500,
    discount_type: 'fixed',
    min_order: 2000,
    max_discount: null,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    code: 'SUMMER20',
    discount: 20,
    discount_type: 'percentage',
    min_order: 500,
    max_discount: 500,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

// Mock Reviews Data
const generateReviews = (productId: string, userId: string) => {
  return [
    {
      id: uuidv4(),
      product_id: productId,
      user_id: userId,
      rating: 5,
      comment: 'Excellent quality! Perfect fit and amazing fabric. Would definitely recommend.',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: uuidv4(),
      product_id: productId,
      user_id: userId,
      rating: 4,
      comment: 'Great product, exactly as shown in the pictures. Fast shipping too.',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: uuidv4(),
      product_id: productId,
      user_id: userId,
      rating: 5,
      comment: 'Fast shipping and the product exceeded my expectations! Love it.',
      created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    },
  ];
};

async function seedDatabase() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Insert Categories
    console.log('📦 Inserting categories...');
    const { data: insertedCategories, error: categoriesError } = await supabase
      .from('categories')
      .insert(categories)
      .select();
    
    if (categoriesError) {
      console.error('Error inserting categories:', categoriesError);
    } else {
      console.log(`✅ Inserted ${insertedCategories?.length || 0} categories`);
    }

    // Insert Products
    console.log('📦 Inserting products...');
    const { data: insertedProducts, error: productsError } = await supabase
      .from('products')
      .insert(products)
      .select();
    
    if (productsError) {
      console.error('Error inserting products:', productsError);
    } else {
      console.log(`✅ Inserted ${insertedProducts?.length || 0} products`);
    }

    // Insert Coupons
    console.log('📦 Inserting coupons...');
    const { data: insertedCoupons, error: couponsError } = await supabase
      .from('coupons')
      .insert(coupons)
      .select();
    
    if (couponsError) {
      console.error('Error inserting coupons:', couponsError);
    } else {
      console.log(`✅ Inserted ${insertedCoupons?.length || 0} coupons`);
    }

    // Insert Reviews for each product
    console.log('📦 Inserting reviews...');
    const allReviews = products.flatMap((product) => 
      generateReviews(product.id, 'demo-user')
    );
    
    const { data: insertedReviews, error: reviewsError } = await supabase
      .from('reviews')
      .insert(allReviews)
      .select();
    
    if (reviewsError) {
      console.error('Error inserting reviews:', reviewsError);
    } else {
      console.log(`✅ Inserted ${insertedReviews?.length || 0} reviews`);
    }

    console.log('\n🎉 Database seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Coupons: ${coupons.length}`);
    console.log(`   - Reviews: ${allReviews.length}`);
    
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

// Run the seed
seedDatabase();
