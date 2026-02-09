export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  phone?: string;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: string;
  is_active?: boolean;
  sort_order?: number;
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  original_price?: number;
  originalPrice?: number;
  images?: string[] | null;
  category_id?: string;
  category?: string | Category;
  subcategory?: string;
  stock: number;
  is_featured: boolean;
  is_new: boolean;
  is_active?: boolean;
  avg_rating?: number;
  rating?: number;
  review_count?: number;
  reviewCount?: number;
  created_at: string;
  createdAt?: string;
  updated_at?: string;
  // For display purposes
  sizes?: string[];
  colors?: string[] | { name: string; hex: string }[];
  material?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isSale?: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size?: string;
  color?: string;
  sku?: string;
  stock: number;
  price_modifier: number;
  is_active: boolean;
  created_at: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  variant_id?: string;
  product?: Product;
  user_id: string;
  quantity: number;
  size?: string;
  color?: string;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  subtotal: number;
  discount: number;
  total: number;
  shipping_address?: Record<string, unknown>;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  created_at: string;
  updated_at: string;
  // For display purposes
  items?: OrderItemWithProduct[];
  status_history?: { status: string; description: string; created_at: string }[];
}

export interface OrderItemWithProduct {
  id?: string;
  order_id?: string;
  product_id?: string;
  variant_id?: string;
  quantity?: number;
  price?: number;
  size?: string;
  color?: string;
  product?: {
    id?: string;
    name?: string;
    images?: string[];
    slug?: string;
  };
}

export interface OrderItem {
  id: string;
  order_id: string;
  variant_id?: string;
  quantity?: number;
  price?: number;
}

export interface Payment {
  id: string;
  order_id: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  amount?: number;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  name?: string;
  phone?: string;
  address_line1?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  is_default: boolean;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percent' | 'flat';
  discount_value: number;
  is_active: boolean;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user?: User;
  rating: number;
  comment?: string;
  is_approved: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Wishlist {
  user_id: string;
  product_id: string;
  product?: Product;
}
