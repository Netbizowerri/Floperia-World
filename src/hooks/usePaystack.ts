import { useUserStore } from '../store/useUserStore';

interface PaystackProps {
  amount: number;
  email: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export const usePaystack = () => {
  const { user } = useUserStore();

  const initializePayment = ({ amount, email, onSuccess, onClose }: PaystackProps) => {
    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_mock_key',
      email: email || user?.email || '',
      amount: amount * 100, // Paystack expects amount in kobo
      currency: 'NGN',
      ref: `FLOP-${Math.floor(Math.random() * 1000000000 + 1)}`,
      callback: (response: any) => {
        onSuccess(response.reference);
      },
      onClose: () => {
        onClose();
      },
    });
    handler.openIframe();
  };

  return { initializePayment };
};
