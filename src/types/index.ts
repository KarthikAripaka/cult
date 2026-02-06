export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  is_admin: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number;
  images: string[];
  category_id: string;
  category?: Category;
  sizes: string[];
  colors: string[];
  stock: number;
  is_featured: boolean;
  is_new: boolean;
  created_at: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  product?: Product;
  user_id: string;
  quantity: number;
  size: string;
  color: string;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: Address;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed';
  created_at: string;
}

export interface OrderItem {
  product_id: string;
  product?: Product;
  quantity: number;
  size: string;
  color: string;
  price: number;
}

export interface Address {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  discount_type: 'percentage' | 'fixed';
  min_order: number;
  max_discount: number;
  expires_at: string;
  is_active: boolean;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user?: User;
  rating: number;
  comment: string;
  created_at: string;
}
