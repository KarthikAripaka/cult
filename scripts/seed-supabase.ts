/**
 * Seed script to upload all 50+ products to Supabase
 * Run with: npx tsx scripts/seed-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { products, categories } from '../src/data/products';

// Supabase credentials
const supabaseUrl = 'https://qhmfvgqzcspufsvjrrvb.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFobWZ2Z3F6Y3NwdWZzdmpycnZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDQ1MjMxMCwiZXhwIjoyMDg2MDI4MzEwfQ.wYQJrWrmv8YSiN6OlI8-Um6lZE97sSTHGDffJQa39cs';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Track category UUIDs
const categoryUuidMap = new Map<string, string>();

async function seedDatabase() {
  console.log('🌱 Starting database seed...');
  console.log(`📡 Connected to: ${supabaseUrl}`);
  
  try {
    // 1. Fetch existing categories first
    console.log('\n📁 Checking existing categories...');
    const { data: existingCategories } = await supabase
      .from('categories')
      .select('id, slug');
    
    if (existingCategories) {
      for (const cat of existingCategories) {
        categoryUuidMap.set(cat.slug, cat.id);
        console.log(`  Found: ${cat.slug} (${cat.id})`);
      }
    }
    
    // 2. Insert missing categories
    console.log('\n📁 Seeding categories...');
    for (const category of categories) {
      let uuid = categoryUuidMap.get(category.slug);
      
      if (!uuid) {
        uuid = randomUUID();
        const { error } = await supabase
          .from('categories')
          .insert({
            id: uuid,
            name: category.name,
            slug: category.slug,
            is_active: true,
            sort_order: categories.indexOf(category) + 1,
          });
        
        if (error) {
          console.error(`❌ Error inserting category ${category.name}:`, error.message);
        } else {
          categoryUuidMap.set(category.slug, uuid);
          console.log(`✓ Inserted: ${category.name}`);
        }
      } else {
        // Update existing category
        const { error } = await supabase
          .from('categories')
          .update({ name: category.name, is_active: true })
          .eq('id', uuid);
        
        if (error) {
          console.error(`❌ Error updating category ${category.name}:`, error.message);
        } else {
          console.log(`✓ Updated: ${category.name} (existing)`);
        }
      }
    }
    
    // 3. Seed Products
    console.log('\n📦 Seeding products...');
    let productsInserted = 0;
    
    for (const product of products) {
      const categorySlug = product.category.toLowerCase().replace(/\s+/g, '-');
      const categoryUuid = categoryUuidMap.get(categorySlug);
      
      if (!categoryUuid) {
        console.error(`❌ Category not found for ${product.name}: ${categorySlug}`);
        continue;
      }
      
      // Check if product already exists
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('slug', product.slug)
        .single();
      
      let productUuid = existingProduct?.id;
      
      if (!productUuid) {
        productUuid = randomUUID();
      }
      
      const { error } = await supabase
        .from('products')
        .upsert({
          id: productUuid,
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          original_price: product.originalPrice || null,
          images: product.images,
          category_id: categoryUuid,
          stock: product.stock,
          is_featured: product.isFeatured || false,
          is_new: product.isNew || false,
          is_active: true,
          avg_rating: product.rating || 0,
          review_count: product.reviewCount || 0,
        }, { onConflict: 'slug' });
      
      if (error) {
        console.error(`❌ Error inserting ${product.name}:`, error.message);
      } else {
        productsInserted++;
        console.log(`✓ Product: ${product.name}`);
        
        // Insert product variants (sizes)
        if (product.sizes && product.sizes.length > 0) {
          for (const size of product.sizes) {
            // Check if variant exists
            const { data: existingVariant } = await supabase
              .from('product_variants')
              .select('id')
              .eq('product_id', productUuid)
              .eq('size', size)
              .single();
            
            if (!existingVariant) {
              const variantUuid = randomUUID();
              const { error: variantError } = await supabase
                .from('product_variants')
                .insert({
                  id: variantUuid,
                  product_id: productUuid,
                  size: size,
                  sku: `${product.slug}-${size}`.toUpperCase().replace(/\s+/g, '-'),
                  stock: Math.floor(product.stock / product.sizes.length),
                  price_modifier: 0,
                  is_active: true,
                });
              
              if (variantError) {
                console.error(`❌ Error inserting variant for ${product.name}:`, variantError.message);
              }
            }
          }
        }
      }
    }
    
    // 4. Seed Coupons
    console.log('\n🏷️ Seeding coupons...');
    const coupons = [
      { code: 'WELCOME10', discount_type: 'percent' as const, discount_value: 10, is_active: true },
      { code: 'FLAT200', discount_type: 'flat' as const, discount_value: 200, is_active: true },
      { code: 'CULT500', discount_type: 'flat' as const, discount_value: 500, is_active: true },
    ];
    
    for (const coupon of coupons) {
      const { error } = await supabase
        .from('coupons')
        .upsert({
          code: coupon.code,
          discount_type: coupon.discount_type,
          discount_value: coupon.discount_value,
          is_active: coupon.is_active,
        }, { onConflict: 'code' });
      
      if (error) {
        console.error(`❌ Error inserting coupon ${coupon.code}:`, error.message);
      } else {
        console.log(`✓ Coupon: ${coupon.code}`);
      }
    }
    
    console.log('\n✅ Database seed completed!');
    console.log(`📊 Summary: ${categoryUuidMap.size} categories, ${productsInserted} products, ${coupons.length} coupons`);
    
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seedDatabase();
