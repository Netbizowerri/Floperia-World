import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';
import { syncStoreToFirestore } from '../lib/firestore-sync';
import { useUserStore } from './useUserStore';

interface CartState {
  items: CartItem[];
  setItems: (items: CartItem[]) => void;
  addItem: (product: Product, quantity?: number, selectedVariants?: Record<string, string>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      setItems: (items) => set({ items }),
      addItem: (product, quantity = 1, selectedVariants = {}) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === product.id);
        let newItems;

        if (existingItem) {
          newItems = items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          newItems = [...items, { ...product, quantity, selectedVariants }];
        }
        set({ items: newItems });
        const user = useUserStore.getState().user;
        if (user) syncStoreToFirestore('carts', user.uid, newItems);
      },
      removeItem: (productId) => {
        const newItems = get().items.filter((item) => item.id !== productId);
        set({ items: newItems });
        const user = useUserStore.getState().user;
        if (user) syncStoreToFirestore('carts', user.uid, newItems);
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        const newItems = get().items.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        );
        set({ items: newItems });
        const user = useUserStore.getState().user;
        if (user) syncStoreToFirestore('carts', user.uid, newItems);
      },
      clearCart: () => {
        set({ items: [] });
        const user = useUserStore.getState().user;
        if (user) syncStoreToFirestore('carts', user.uid, []);
      },
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'floperia-cart-storage',
    }
  )
);
