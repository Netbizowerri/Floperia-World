import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DeliveryDetails } from '../types';
import { User } from 'firebase/auth';

interface UserState {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  deliveryDetails: DeliveryDetails | null;
  setUser: (user: User | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setLoading: (loading: boolean) => void;
  setDeliveryDetails: (details: DeliveryDetails) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAdmin: false,
      loading: true,
      deliveryDetails: null,
      setUser: (user) => set({ user }),
      setIsAdmin: (isAdmin) => set({ isAdmin }),
      setLoading: (loading) => set({ loading }),
      setDeliveryDetails: (details) => set({ deliveryDetails: details }),
    }),
    {
      name: 'floperia-user-storage',
      partialize: (state) => ({ deliveryDetails: state.deliveryDetails }), // Don't persist user object directly from firebase
    }
  )
);
