import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';
import { syncStoreToFirestore } from '../lib/firestore-sync';
import { useUserStore } from './useUserStore';

interface WishlistState {
  items: Product[];
  setItems: (items: Product[]) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      setItems: (items) => set({ items }),
      toggleWishlist: (product) => {
        const items = get().items;
        const exists = items.find((item) => item.id === product.id);
        let newItems;
        if (exists) {
          newItems = items.filter((item) => item.id !== product.id);
        } else {
          newItems = [...items, product];
        }
        set({ items: newItems });
        const user = useUserStore.getState().user;
        if (user) syncStoreToFirestore('wishlists', user.uid, newItems);
      },
      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },
    }),
    {
      name: 'floperia-wishlist-storage',
    }
  )
);
