/**
 * Cult Fashion - Seed Database Script
 * Run: npx tsx scripts/seed-database.ts
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Seed data
const categories = [
  {
    name: 'Men',
    slug: 'men',
    description: 'Trendy fashion for men',
    image_url: 'https://images.unsplash.com/photo-1617137968427-85924c809a1d?w=800',
    sort_order: 1,
  },
  {
    name: 'Women',
    slug: 'women',
    description: 'Stylish fashion for women',
    image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
    sort_order: 2,
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Complete your look',
    image_url: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800',
    sort_order: 3,
  },
  {
    name: 'Footwear',
    slug: 'footwear',
    description: 'Shoes for every occasion',
    image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
    sort_order: 4,
  },
];

const subcategories = [
  // Men subcategories
  { name: 'T-Shirts', slug: 'tshirts', parent_slug: 'men', image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800' },
  { name: 'Shirts', slug: 'shirts', parent_slug: 'men', image_url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800' },
  { name: 'Jeans', slug: 'jeans', parent_slug: 'men', image_url: 'https://images.unsplash.com/photo-1542272617-08f08375816c?w=800' },
  { name: 'Jackets', slug: 'jackets', parent_slug: 'men', image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800' },
  { name: 'Hoodies', slug: 'hoodies', parent_slug: 'men', image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800' },
  
  // Women subcategories
  { name: 'Dresses', slug: 'dresses', parent_slug: 'women', image_url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800' },
  { name: 'Tops', slug: 'tops', parent_slug: 'women', image_url: 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=800' },
  { name: 'Sarees', slug: 'sarees', parent_slug: 'women', image_url: 'https://images.unsplash.com/photo-1583391727854-9656f76859b4?w=800' },
  { name: 'Kurtis', slug: 'kurtis', parent_slug: 'women', image_url: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800' },
  { name: 'Leggings', slug: 'leggings', parent_slug: 'women', image_url: 'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=800' },
  
  // Accessories
  { name: 'Watches', slug: 'watches', parent_slug: 'accessories', image_url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800' },
  { name: 'Bags', slug: 'bags', parent_slug: 'accessories', image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800' },
  { name: 'Sunglasses', slug: 'sunglasses', parent_slug: 'accessories', image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800' },
  { name: 'Belts', slug: 'belts', parent_slug: 'accessories', image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800' },
  
  // Footwear
  { name: 'Sneakers', slug: 'sneakers', parent_slug: 'footwear', image_url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800' },
  { name: 'Sandals', slug: 'sandals', parent_slug: 'footwear', image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800' },
  { name: 'Formal Shoes', slug: 'formal-shoes', parent_slug: 'footwear', image_url: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800' },
];

const products = [
  // Men's T-Shirts
  {
    name: 'Classic Cotton T-Shirt',
    slug: 'classic-cotton-tshirt',
    description: 'Premium 100% cotton t-shirt for everyday comfort. Regular fit, round neck, short sleeves.',
    price: 499,
    original_price: 799,
    category_slug: 'tshirts',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black', 'Navy', 'Grey', 'Red'],
    stock: 100,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800',
    ],
    is_featured: true,
    is_new: true,
  },
  {
    name: 'Graphic Print T-Shirt',
    slug: 'graphic-print-tshirt',
    description: 'Trendy graphic print t-shirt made from premium cotton. Perfect for casual outings.',
    price: 599,
    original_price: 899,
    category_slug: 'tshirts',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Blue'],
    stock: 75,
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800',
    ],
    is_featured: true,
  },
  {
    name: 'Polo T-Shirt',
    slug: 'polo-tshirt',
    description: 'Classic polo t-shirt with collar. Perfect for both casual and semi-formal occasions.',
    price: 799,
    original_price: 1199,
    category_slug: 'tshirts',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Navy', 'Maroon', 'Green'],
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800',
    ],
    is_featured: false,
  },

  // Men's Shirts
  {
    name: 'Formal Cotton Shirt',
    slug: 'formal-cotton-shirt',
    description: 'Premium formal shirt made from 100% cotton. Button-down collar, single cuff.',
    price: 1299,
    original_price: 1899,
    category_slug: 'shirts',
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '38', '40', '42', '44'],
    colors: ['White', 'Light Blue', 'Pink', 'Grey'],
    stock: 60,
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800',
    ],
    is_featured: true,
  },
  {
    name: 'Casual Linen Shirt',
    slug: 'casual-linen-shirt',
    description: 'Breathable linen shirt perfect for summer. Relaxed fit, mandarin collar.',
    price: 999,
    original_price: 1499,
    category_slug: 'shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Beige', 'Light Grey', 'Blue'],
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
    ],
    is_featured: true,
  },
  {
    name: 'Denim Shirt',
    slug: 'denim-shirt',
    description: 'Classic denim shirt with button placket. Chest pockets with flaps.',
    price: 1499,
    original_price: 2199,
    category_slug: 'shirts',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Blue', 'Black'],
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800',
    ],
    is_featured: false,
  },

  // Men's Jeans
  {
    name: 'Slim Fit Jeans',
    slug: 'slim-fit-jeans',
    description: 'Modern slim fit jeans with stretch comfort. Classic 5-pocket styling.',
    price: 1599,
    original_price: 2499,
    category_slug: 'jeans',
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: ['Dark Blue', 'Light Blue', 'Black'],
    stock: 80,
    images: [
      'https://images.unsplash.com/photo-1542272617-08f08375816c?w=800',
      'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=800',
    ],
    is_featured: true,
  },
  {
    name: 'Relaxed Fit Jeans',
    slug: 'relaxed-fit-jeans',
    description: 'Comfortable relaxed fit jeans for everyday wear. Slightly loose from hip to hem.',
    price: 1399,
    original_price: 2099,
    category_slug: 'jeans',
    sizes: ['30', '32', '34', '36', '38', '40'],
    colors: ['Blue', 'Grey'],
    stock: 55,
    images: [
      'https://images.unsplash.com/photo-1542272617-08f08375816c?w=800',
    ],
    is_featured: false,
  },

  // Men's Jackets
  {
    name: 'Denim Jacket',
    slug: 'denim-jacket',
    description: 'Classic denim jacket with button closure. Vintage wash, chest pockets.',
    price: 2499,
    original_price: 3499,
    category_slug: 'jackets',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Light Blue', 'Dark Blue', 'Black'],
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
      'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=800',
    ],
    is_featured: true,
  },
  {
    name: 'Bomber Jacket',
    slug: 'bomber-jacket',
    description: 'Stylish bomber jacket with ribbed collar and cuffs. Perfect for casual wear.',
    price: 2999,
    original_price: 4299,
    category_slug: 'jackets',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'Olive', 'Burgundy'],
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
    ],
    is_featured: true,
  },
  {
    name: 'Leather Jacket',
    slug: 'leather-jacket',
    description: 'Premium faux leather jacket with asymmetric zip. Classic biker style.',
    price: 4999,
    original_price: 6999,
    category_slug: 'jackets',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Brown'],
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
    ],
    is_featured: true,
  },

  // Men's Hoodies
  {
    name: 'Pullover Hoodie',
    slug: 'pullover-hoodie',
    description: 'Comfortable pullover hoodie with kangaroo pocket. Adjustable drawstring hood.',
    price: 1299,
    original_price: 1899,
    category_slug: 'hoodies',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Grey', 'Navy', 'Maroon'],
    stock: 70,
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800',
    ],
    is_featured: true,
  },
  {
    name: 'Zip-Up Hoodie',
    slug: 'zip-up-hoodie',
    description: 'Full zip hoodie with side pockets. Perfect for layering.',
    price: 1499,
    original_price: 2199,
    category_slug: 'hoodies',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Grey', 'Blue', 'Green'],
    stock: 55,
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
    ],
    is_featured: false,
  },

  // Women's Dresses
  {
    name: 'Floral Midi Dress',
    slug: 'floral-midi-dress',
    description: 'Beautiful floral print midi dress with flowing silhouette. Perfect for summer.',
    price: 1899,
    original_price: 2799,
    category_slug: 'dresses',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Floral Print'],
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800',
    ],
    is_featured: true,
    is_new: true,
  },
  {
    name: 'Little Black Dress',
    slug: 'little-black-dress',
    description: 'Elegant black dress perfect for parties and special occasions. Knee length.',
    price: 2499,
    original_price: 3599,
    category_slug: 'dresses',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black'],
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800',
    ],
    is_featured: true,
  },
  {
    name: 'Summer Sundress',
    slug: 'summer-sundress',
    description: 'Light and breezy sundress with spaghetti straps. Perfect for beach days.',
    price: 1299,
    original_price: 1999,
    category_slug: 'dresses',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Yellow', 'Pink', 'White', 'Blue'],
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800',
    ],
    is_featured: true,
  },
  {
    name: 'A-Line Dress',
    slug: 'a-line-dress',
    description: 'Flattering A-line dress with fitted bodice and flared skirt. Great for office.',
    price: 1699,
    original_price: 2499,
    category_slug: 'dresses',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy', 'Burgundy', 'Forest Green'],
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
    ],
    is_featured: false,
  },

  // Women's Tops
  {
    name: 'Crop Top',
    slug: 'crop-top',
    description: 'Trendy crop top with trendy designs. Perfect for summer.',
    price: 599,
    original_price: 999,
    category_slug: 'tops',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['White', 'Black', 'Pink', 'Yellow'],
    stock: 80,
    images: [
      'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=800',
    ],
    is_featured: true,
  },
  {
    name: 'Blouse',
    slug: 'blouse',
    description: 'Elegant blouse with button-down front. Perfect for office or casual wear.',
    price: 999,
    original_price: 1499,
    category_slug: 'tops',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Pink', 'Blue', 'Lavender'],
    stock: 60,
    images: [
      'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=800',
    ],
    is_featured: false,
  },
  {
    name: 'Tunic Top',
    slug: 'tunic-top',
    description: 'Flowy tunic top with 3/4 sleeves. Comfortable and stylish.',
    price: 899,
    original_price: 1399,
    category_slug: 'tops',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Grey', 'Mustard', 'Teal'],
    stock: 55,
    images: [
      'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=800',
    ],
    is_featured: true,
  },

  // Women's Sarees
  {
    name: 'Silk Saree',
    slug: 'silk-saree',
    description: 'Traditional silk saree with intricate border. Perfect for weddings and festivals.',
    price: 4999,
    original_price: 7999,
    category_slug: 'sarees',
    sizes: ['Free'],
    colors: ['Red', 'Maroon', 'Gold', 'Pink', 'Blue'],
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
    ],
    is_featured: true,
    is_new: true,
  },
  {
    name: 'Cotton Saree',
    slug: 'cotton-saree',
    description: 'Lightweight cotton saree with traditional prints. Perfect for daily wear.',
    price: 1899,
    original_price: 2999,
    category_slug: 'sarees',
    sizes: ['Free'],
    colors: ['White', 'Grey', 'Orange', 'Green'],
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1583391727854-9656f76859b4?w=800',
    ],
    is_featured: false,
  },
  {
    name: 'Georgette Saree',
    slug: 'georgette-saree',
    description: 'Elegant georgette saree with delicate work. Great for parties.',
    price: 2999,
    original_price: 4499,
    category_slug: 'sarees',
    sizes: ['Free'],
    colors: ['Pink', 'Purple', 'Silver', 'Wine'],
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
    ],
    is_featured: true,
  },

  // Women's Kurtis
  {
    name: 'Cotton Kurti',
    slug: 'cotton-kurti',
    description: 'Comfortable cotton kurti with straight cut. Perfect for daily wear.',
    price: 1299,
    original_price: 1999,
    category_slug: 'kurtis',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Blue', 'Pink', 'Yellow', 'Green'],
    stock: 65,
    images: [
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800',
    ],
    is_featured: true,
  },
  {
    name: 'Designer Kurti',
    slug: 'designer-kurti',
    description: 'Embroidered designer kurti with intricate details. Perfect for special occasions.',
    price: 2499,
    original_price: 3799,
    category_slug: 'kurtis',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Red', 'Maroon', 'Navy', 'Purple'],
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800',
    ],
    is_featured: true,
  },

  // Women's Leggings
  {
    name: 'Cotton Leggings',
    slug: 'cotton-leggings',
    description: 'High-quality cotton leggings with elastic waistband. Super comfortable.',
    price: 699,
    original_price: 1099,
    category_slug: 'leggings',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Grey', 'Navy', 'Beige'],
    stock: 100,
    images: [
      'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=800',
    ],
    is_featured: true,
  },
  {
    name: 'Jeggings',
    slug: 'jeggings',
    description: 'Stylish jeggings that look like jeans. Super stretchy and comfortable.',
    price: 999,
    original_price: 1499,
    category_slug: 'leggings',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Blue', 'Grey'],
    stock: 80,
    images: [
      'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=800',
    ],
    is_featured: false,
  },

  // Accessories - Watches
  {
    name: 'Analog Watch',
    slug: 'analog-watch',
    description: 'Classic analog watch with leather strap. Water resistant.',
    price: 2499,
    original_price: 3999,
    category_slug: 'watches',
    sizes: ['Free'],
    colors: ['Silver', 'Gold', 'Rose Gold', 'Black'],
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800',
    ],
    is_featured: true,
  },
  {
    name: 'Digital Watch',
    slug: 'digital-watch',
    description: 'Modern digital watch with LED display. Multiple functions.',
    price: 1499,
    original_price: 2299,
    category_slug: 'watches',
    sizes: ['Free'],
    colors: ['Black', 'Blue', 'Grey'],
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800',
    ],
    is_featured: false,
  },

  // Accessories - Bags
  {
    name: 'Leather Handbag',
    slug: 'leather-handbag',
    description: 'Genuine leather handbag with multiple compartments. Stylish and functional.',
    price: 3999,
    original_price: 5999,
    category_slug: 'bags',
    sizes: ['Free'],
    colors: ['Brown', 'Black', 'Tan', 'Burgundy'],
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800',
    ],
    is_featured: true,
  },
  {
    name: 'Backpack',
    slug: 'backpack',
    description: 'Trendy backpack with laptop compartment. Perfect for college or work.',
    price: 1999,
    original_price: 2999,
    category_slug: 'bags',
    sizes: ['Free'],
    colors: ['Black', 'Navy', 'Grey', 'Red'],
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
    ],
    is_featured: true,
  },
  {
    name: 'Clutch Bag',
    slug: 'clutch-bag',
    description: 'Elegant clutch bag for parties and evening wear. Magnetic clasp.',
    price: 1299,
    original_price: 1999,
    category_slug: 'bags',
    sizes: ['Free'],
    colors: ['Gold', 'Silver', 'Black', 'Pink'],
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800',
    ],
    is_featured: false,
  },

  // Accessories - Sunglasses
  {
    name: 'Wayfarer Sunglasses',
    slug: 'wayfarer-sunglasses',
    description: 'Classic wayfarer style sunglasses. UV protection.',
    price: 999,
    original_price: 1599,
    category_slug: 'sunglasses',
    sizes: ['Free'],
    colors: ['Black', 'Tortoise', 'Brown', 'Grey'],
    stock: 60,
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800',
    ],
    is_featured: true,
  },
  {
    name: 'Aviator Sunglasses',
    slug: 'aviator-sunglasses',
    description: 'Timeless aviator sunglasses with metal frame. Premium finish.',
    price: 1499,
    original_price: 2299,
    category_slug: 'sunglasses',
    sizes: ['Free'],
    colors: ['Gold', 'Silver', 'Black'],
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800',
    ],
    is_featured: false,
  },

  // Accessories - Belts
  {
    name: 'Leather Belt',
    slug: 'leather-belt',
    description: 'Genuine leather belt with metal buckle. Classic design.',
    price: 899,
    original_price: 1399,
    category_slug: 'belts',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Brown', 'Black', 'Tan'],
    stock: 70,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
    ],
    is_featured: true,
  },

  // Footwear - Sneakers
  {
    name: 'Running Sneakers',
    slug: 'running-sneakers',
    description: 'Lightweight running sneakers with cushioned sole. Perfect for workouts.',
    price: 2999,
    original_price: 4499,
    category_slug: 'sneakers',
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['White', 'Black', 'Blue', 'Grey'],
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800',
    ],
    is_featured: true,
  },
  {
    name: 'Casual Sneakers',
    slug: 'casual-sneakers',
    description: 'Trendy casual sneakers for everyday wear. Canvas upper.',
    price: 1499,
    original_price: 2299,
    category_slug: 'sneakers',
    sizes: ['5', '6', '7', '8', '9', '10'],
    colors: ['White', 'Black', 'Red', 'Navy'],
    stock: 65,
    images: [
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800',
    ],
    is_featured: true,
  },
  {
    name: 'High-Top Sneakers',
    slug: 'high-top-sneakers',
    description: 'Cool high-top sneakers with ankle support. Street style favorite.',
    price: 2199,
    original_price: 3299,
    category_slug: 'sneakers',
    sizes: ['7', '8', '9', '10'],
    colors: ['White', 'Black', 'Red', 'Blue'],
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800',
    ],
    is_featured: false,
  },

  // Footwear - Sandals
  {
    name: 'Flip Flops',
    slug: 'flip-flops',
    description: 'Comfortable flip flops for beach and casual wear. Soft sole.',
    price: 399,
    original_price: 699,
    category_slug: 'sandals',
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Blue', 'Black', 'Red', 'Yellow', 'Green'],
    stock: 100,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800',
    ],
    is_featured: true,
  },
  {
    name: 'Sandals',
    slug: 'sandals',
    description: 'Stylish sandals with adjustable straps. Perfect for summer.',
    price: 999,
    original_price: 1599,
    category_slug: 'sandals',
    sizes: ['5', '6', '7', '8', '9'],
    colors: ['Brown', 'Black', 'Beige', 'White'],
    stock: 55,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800',
    ],
    is_featured: false,
  },

  // Footwear - Formal Shoes
  {
    name: 'Oxford Shoes',
    slug: 'oxford-shoes',
    description: 'Classic Oxford shoes with lace-up closure. Leather upper.',
    price: 3999,
    original_price: 5999,
    category_slug: 'formal-shoes',
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Black', 'Brown'],
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800',
    ],
    is_featured: true,
  },
  {
    name: 'Loafers',
    slug: 'loafers',
    description: 'Comfortable loafers with slip-on design. Leather upper with cushioned insole.',
    price: 3499,
    original_price: 4999,
    category_slug: 'formal-shoes',
    sizes: ['6', '7', '8', '9', '10'],
    colors: ['Black', 'Brown', 'Tan', 'Burgundy'],
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800',
    ],
    is_featured: true,
  },
];

const coupons = [
  {
    code: 'WELCOME20',
    description: '20% off on your first order',
    discount_type: 'percentage',
    discount_value: 20,
    min_order_value: 500,
    max_discount: 1000,
    usage_limit: 10000,
    usage_limit_per_user: 1,
    valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
  },
  {
    code: 'FLAT500',
    description: 'Flat ₹500 off on orders above ₹2000',
    discount_type: 'fixed',
    discount_value: 500,
    min_order_value: 2000,
    usage_limit: 5000,
    usage_limit_per_user: 3,
    valid_until: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
  },
  {
    code: 'FREESHIP',
    description: 'Free shipping on all orders',
    discount_type: 'shipping',
    discount_value: 0,
    min_order_value: 0,
    usage_limit: null,
    usage_limit_per_user: null,
    valid_until: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
  },
  {
    code: 'SPECIAL30',
    description: '30% off on orders above ₹5000',
    discount_type: 'percentage',
    discount_value: 30,
    min_order_value: 5000,
    max_discount: 3000,
    usage_limit: 1000,
    usage_limit_per_user: 2,
    valid_until: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
  },
];

const reviews = [
  {
    rating: 5,
    title: 'Amazing quality!',
    comment: 'Exceeded my expectations. The fabric is premium and the fit is perfect.',
    is_verified: true,
  },
  {
    rating: 4,
    title: 'Great value for money',
    comment: 'Good quality at a reasonable price. Would recommend.',
    is_verified: true,
  },
  {
    rating: 5,
    title: 'Must buy!',
    comment: 'Best purchase I made this year. Super comfortable and stylish.',
    is_verified: true,
  },
];

const shippingZones = [
  {
    name: 'Express Delivery - Metro Cities',
    pincode_range_start: '100000',
    pincode_range_end: '600000',
    base_rate: 99,
    rate_per_kg: 0,
    free_shipping_min: 999,
    estimated_days_min: 1,
    estimated_days_max: 3,
  },
  {
    name: 'Standard Delivery - Urban',
    pincode_range_start: '600001',
    pincode_range_end: '800000',
    base_rate: 79,
    rate_per_kg: 10,
    free_shipping_min: 799,
    estimated_days_min: 3,
    estimated_days_max: 7,
  },
  {
    name: 'Economy Delivery - Rural',
    pincode_range_start: '800001',
    pincode_range_end: '999999',
    base_rate: 99,
    rate_per_kg: 20,
    free_shipping_min: 1499,
    estimated_days_min: 7,
    estimated_days_max: 15,
  },
];

async function seed() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Insert categories
    console.log('📁 Creating categories...');
    for (const category of categories) {
      const { error } = await supabase.from('categories').upsert(
        { ...category, created_at: new Date().toISOString() },
        { onConflict: 'slug', ignoreDuplicates: false }
      );
      if (error) throw error;
    }
    console.log(`✅ Created ${categories.length} main categories`);

    // Insert subcategories
    console.log('📁 Creating subcategories...');
    for (const subcat of subcategories) {
      // Get parent ID
      const { data: parent } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', subcat.parent_slug)
        .single();

      if (parent) {
        const { error } = await supabase.from('categories').upsert(
          {
            name: subcat.name,
            slug: subcat.slug,
            image_url: subcat.image_url,
            parent_id: parent.id,
            sort_order: 0,
            created_at: new Date().toISOString(),
          },
          { onConflict: 'slug', ignoreDuplicates: false }
        );
        if (error) throw error;
      }
    }
    console.log(`✅ Created ${subcategories.length} subcategories`);

    // Insert products
    console.log('👕 Creating products...');
    for (const product of products) {
      // Get category ID
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', product.category_slug)
        .single();

      const { category_slug, ...productData } = product;

      const { error } = await supabase.from('products').upsert(
        {
          ...productData,
          category_id: category?.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'slug', ignoreDuplicates: false }
      );
      if (error) throw error;
    }
    console.log(`✅ Created ${products.length} products`);

    // Insert coupons
    console.log('🏷️ Creating coupons...');
    for (const coupon of coupons) {
      const { error } = await supabase.from('coupons').upsert(
        { ...coupon, created_at: new Date().toISOString() },
        { onConflict: 'code', ignoreDuplicates: false }
      );
      if (error) throw error;
    }
    console.log(`✅ Created ${coupons.length} coupons`);

    // Insert shipping zones
    console.log('🚚 Creating shipping zones...');
    for (const zone of shippingZones) {
      const { error } = await supabase.from('shipping_zones').upsert(
        { ...zone, created_at: new Date().toISOString() },
        { onConflict: 'name', ignoreDuplicates: false }
      );
      if (error) throw error;
    }
    console.log(`✅ Created ${shippingZones.length} shipping zones`);

    // Insert sample reviews for featured products
    console.log('⭐ Creating sample reviews...');
    const { data: featuredProducts } = await supabase
      .from('products')
      .select('id')
      .eq('is_featured', true)
      .limit(10);

    if (featuredProducts && featuredProducts.length > 0) {
      for (const product of featuredProducts) {
        for (const review of reviews) {
          const { error } = await supabase.from('reviews').insert({
            product_id: product.id,
            rating: review.rating,
            title: review.title,
            comment: review.comment,
            is_verified: review.is_verified,
            is_approved: true,
            created_at: new Date().toISOString(),
          });
          if (error && !error.message.includes('duplicate')) throw error;
        }
      }
      console.log(`✅ Created sample reviews for ${featuredProducts.length} products`);
    }

    console.log('\n🎉 Database seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
