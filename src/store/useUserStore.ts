import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DeliveryDetails } from '../types';
import { User } from 'firebase/auth';

interface UserState {
  user: User | null;
  loading: boolean;
  deliveryDetails: DeliveryDetails | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setDeliveryDetails: (details: DeliveryDetails) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      deliveryDetails: null,
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      setDeliveryDetails: (details) => set({ deliveryDetails: details }),
    }),
    {
      name: 'floperia-user-storage',
      partialize: (state) => ({ deliveryDetails: state.deliveryDetails }), // Don't persist user object directly from firebase
    }
  )
);
