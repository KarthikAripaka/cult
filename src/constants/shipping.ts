// Shipping Constants
export const SHIPPING_THRESHOLD = 2000;
export const SHIPPING_COST = 150;
export const TAX_RATE = 0.18;

// Indian States for shipping
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Chandigarh'
] as const;

export type IndianState = typeof INDIAN_STATES[number];

// Validation patterns
export const VALIDATION_PATTERNS = {
  PINCODE: /^\d{6}$/,
  PHONE: /^[6-9]\d{9}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// Cart Constants
export const CART_MAX_ITEMS = 50;
export const CART_ITEM_MAX_QUANTITY = 10;
