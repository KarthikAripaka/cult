import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem, User } from '@/types';

// Generate unique ID that works in both browser and server
const generateId = (): string => {
  if (typeof window !== 'undefined' && 'crypto' in window && 'randomUUID' in window.crypto) {
    return window.crypto.randomUUID();
  }
  // Fallback for server-side or older browsers
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, size: string, color: string, quantity: number, userId: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

interface UIStore {
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isMenuOpen: boolean;
  toggleCart: () => void;
  toggleSearch: () => void;
  toggleMenu: () => void;
  closeAll: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, size, color, quantity, userId) => {
        const items = get().items;
        const existingItem = items.find(
          (item) =>
            item.product_id === product.id &&
            item.size === size &&
            item.color === color
        );

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === existingItem.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          const newItem: CartItem = {
            id: generateId(),
            product_id: product.id,
            product,
            user_id: userId,
            quantity,
            size,
            color,
            created_at: new Date().toISOString(),
          };
          set({ items: [...items, newItem] });
        }
      },
      removeItem: (itemId) => {
        set({ items: get().items.filter((item) => item.id !== itemId) });
      },
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + (item.product?.price || 0) * item.quantity,
          0
        );
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cult-cart',
    }
  )
);

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user, isLoading: false }),
      setLoading: (loading) => set({ isLoading: loading }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'cult-auth',
    }
  )
);

export const useUIStore = create<UIStore>()((set) => ({
  isCartOpen: false,
  isSearchOpen: false,
  isMenuOpen: false,
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen, isMenuOpen: false, isSearchOpen: false })),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen, isMenuOpen: false, isCartOpen: false })),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen, isCartOpen: false, isSearchOpen: false })),
  closeAll: () => set({ isCartOpen: false, isSearchOpen: false, isMenuOpen: false }),
}));
