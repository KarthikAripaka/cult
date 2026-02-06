-- Supabase Database Schema for Cult Fashion E-commerce

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories Table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    images TEXT[] DEFAULT '{}',
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    sizes TEXT[] DEFAULT '{}',
    colors TEXT[] DEFAULT '{}',
    stock INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users Table (extends Supabase auth)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart Items Table
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    size VARCHAR(50),
    color VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id, size, color)
);

-- Addresses Table
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    items JSONB NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) DEFAULT 0,
    shipping DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    shipping_address JSONB NOT NULL,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending',
    coupon_code VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupons Table
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount DECIMAL(10, 2) NOT NULL,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    min_order DECIMAL(10, 2) DEFAULT 0,
    max_discount DECIMAL(10, 2),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Indexes for Performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_cart_items_user ON cart_items(user_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);

-- Insert Sample Categories
INSERT INTO categories (name, slug, image_url) VALUES
    ('New Arrivals', 'new-arrivals', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800'),
    ('Men', 'men', 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800'),
    ('Women', 'women', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800'),
    ('Accessories', 'accessories', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'),
    ('Sale', 'sale', 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800');

-- Insert Sample Products
INSERT INTO products (name, slug, description, price, original_price, images, category_id, sizes, colors, stock, is_featured, is_new) VALUES
    ('Premium Cotton T-Shirt', 'premium-cotton-tshirt', 'High-quality organic cotton t-shirt with a modern fit. Perfect for everyday wear.', 49.99, 79.99, ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800'], (SELECT id FROM categories WHERE slug='new-arrivals'), ARRAY['S', 'M', 'L', 'XL'], ARRAY['White', 'Black', 'Navy'], 100, true, true),
    ('Designer Denim Jacket', 'designer-denim-jacket', 'Classic denim jacket with modern styling. Features premium buttons and stitching.', 149.99, 199.99, ARRAY['https://images.unsplash.com/photo-1523205565295-f8e91625443c?w=800', 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800'], (SELECT id FROM categories WHERE slug='men'), ARRAY['S', 'M', 'L', 'XL'], ARRAY['Blue', 'Black'], 50, true, false),
    ('Elegant Silk Dress', 'elegant-silk-dress', 'Luxurious silk dress perfect for evening occasions. Flowing silhouette with delicate details.', 299.99, 399.99, ARRAY['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800'], (SELECT id FROM categories WHERE slug='women'), ARRAY['XS', 'S', 'M', 'L'], ARRAY['Red', 'Black', 'Champagne'], 30, true, true),
    ('Minimalist Watch', 'minimalist-watch', 'Sleek minimalist watch with genuine leather strap. Japanese quartz movement.', 199.99, 249.99, ARRAY['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800', 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800'], (SELECT id FROM categories WHERE slug='accessories'), ARRAY['One Size'], ARRAY['Silver', 'Gold', 'Rose Gold'], 75, true, false),
    ('Urban Cargo Pants', 'urban-cargo-pants', 'Versatile cargo pants with multiple pockets. Comfortable stretch fabric.', 89.99, 119.99, ARRAY['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800', 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800'], (SELECT id FROM categories WHERE slug='men'), ARRAY['28', '30', '32', '34', '36'], ARRAY['Olive', 'Black', 'Khaki'], 60, false, true),
    ('Cashmere Sweater', 'cashmere-sweater', 'Ultra-soft 100% cashmere sweater. Lightweight yet warm.', 189.99, 249.99, ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800', 'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?w=800'], (SELECT id FROM categories WHERE slug='women'), ARRAY['S', 'M', 'L', 'XL'], ARRAY['Cream', 'Gray', 'Burgundy'], 40, true, false),
    ('Leather Belt', 'leather-belt', 'Handcrafted genuine leather belt. Solid brass buckle.', 59.99, 79.99, ARRAY['https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800'], (SELECT id FROM categories WHERE slug='accessories'), ARRAY['30', '32', '34', '36', '38', '40'], ARRAY['Brown', 'Black'], 100, false, false),
    ('Summer Floral Dress', 'summer-floral-dress', 'Light and breezy floral print dress. Perfect for summer days.', 79.99, 109.99, ARRAY['https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800'], (SELECT id FROM categories WHERE slug='women'), ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['Floral Blue', 'Floral Pink'], 45, false, true),
    ('Running Sneakers', 'running-sneakers', 'Lightweight running sneakers with responsive cushioning.', 129.99, 169.99, ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800'], (SELECT id FROM categories WHERE slug='men'), ARRAY['7', '8', '9', '10', '11', '12'], ARRAY['White', 'Black', 'Red'], 80, true, false),
    ('Canvas Tote Bag', 'canvas-tote-bag', 'Eco-friendly canvas tote bag. Spacious and durable.', 39.99, 49.99, ARRAY['https://images.unsplash.com/photo-1544816155-12df9643f363?w=800', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800'], (SELECT id FROM categories WHERE slug='accessories'), ARRAY['One Size'], ARRAY['Natural', 'Black'], 120, false, false);

-- Insert Sample Coupons
INSERT INTO coupons (code, discount, discount_type, min_order, max_discount, expires_at, is_active) VALUES
    ('WELCOME10', 10, 'percentage', 0, 100, NOW() + INTERVAL '30 days', true),
    ('FLAT500', 500, 'fixed', 2000, NULL, NOW() + INTERVAL '15 days', true),
    ('SUMMER20', 20, 'percentage', 500, 500, NOW() + INTERVAL '7 days', true);

-- Row Level Security Policies
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cart items" ON cart_items
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own cart items" ON cart_items
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own addresses" ON addresses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own addresses" ON addresses
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view all orders (admin)" ON orders
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
    );

CREATE POLICY "Users can create orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);
