-- Migration Script: Add Missing Columns to Supabase Tables
-- Run this in Supabase SQL Editor

-- ============================================
-- ADD MISSING COLUMNS TO CATEGORIES
-- ============================================

-- Add description column if missing
DO $$ BEGIN
    ALTER TABLE categories ADD COLUMN IF NOT EXISTS description TEXT;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Add image_url column if missing
DO $$ BEGIN
    ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url TEXT;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Add parent_id column if missing
DO $$ BEGIN
    ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_id UUID;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Add updated_at column if missing
DO $$ BEGIN
    ALTER TABLE categories ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- ============================================
-- ADD MISSING COLUMNS TO PRODUCTS
-- ============================================

-- Add original_price column if missing
DO $$ BEGIN
    ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price DECIMAL(10, 2);
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Add sizes column if missing
DO $$ BEGIN
    ALTER TABLE products ADD COLUMN IF NOT EXISTS sizes TEXT[] DEFAULT '{}';
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Add colors column if missing
DO $$ BEGIN
    ALTER TABLE products ADD COLUMN IF NOT EXISTS colors TEXT[] DEFAULT '{}';
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Add min_stock column if missing
DO $$ BEGIN
    ALTER TABLE products ADD COLUMN IF NOT EXISTS min_stock INTEGER DEFAULT 5;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Add updated_at column if missing
DO $$ BEGIN
    ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- ============================================
-- REFRESH POSTGREST SCHEMA CACHE
-- ============================================

-- Notify PostgREST to refresh schema cache
SELECT pg_notify('pgrst', 'reload');

-- ============================================
-- VERIFICATION
-- ============================================

-- Check categories columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'categories' 
ORDER BY ordinal_position;

-- Check products columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;

-- Show result
SELECT 'Migration completed successfully!' as status;
