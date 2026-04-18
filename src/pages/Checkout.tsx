import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Lock, CreditCard, Truck, MapPin, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useOrderStore } from '../store/useOrderStore';
import { useUserStore } from '../store/useUserStore';
import { formatPrice, cn } from '../lib/utils';
import { DeliveryDetails, Order } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { usePaystack } from '../hooks/usePaystack';

import { createNotification } from '../services/notificationService';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(11, 'Valid Nigerian phone number required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().min(5, 'Full address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  notes: z.string().optional(),
});

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const { addOrder } = useOrderStore();
  const { deliveryDetails, setDeliveryDetails, user } = useUserStore();
  const { initializePayment } = usePaystack();
  const [step, setStep] = useState<'delivery' | 'payment' | 'success'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'transfer' | 'pod'>('paystack');
  // confirmedOrderId is set once in placeOrder() so the success screen always shows the correct reference
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<DeliveryDetails>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: deliveryDetails || {},
  });

  const onDeliverySubmit = (data: DeliveryDetails) => {
    setDeliveryDetails(data);
    setStep('payment');
  };

  /**
   * Core order placement logic — called after payment is confirmed (or immediately for non-Paystack methods).
   * @param paystackRef Optional Paystack transaction reference for card payments.
   */
  const placeOrder = async (paystackRef?: string) => {
    if (isPlacingOrder) return;
    setIsPlacingOrder(true);

    // Generate a stable order ID and store it in state so both Firestore and the success screen use the same value
    const newOrderId = `FCW-${Math.floor(Math.random() * 1000000)}`;
    setConfirmedOrderId(newOrderId);

    const order: Order = {
      id: newOrderId,
      items,
      total: getTotal(),
      status: 'order_placed',
      createdAt: new Date().toISOString(),
      deliveryDetails: deliveryDetails!,
      paymentMethod,
    };

    try {
      // Persist order to Firestore — survives page refresh and is visible in the admin dashboard
      await setDoc(doc(db, 'orders', newOrderId), {
        ...order,
        userId: user?.uid || 'guest',
        totalAmount: getTotal() + 2500, // Grand total including delivery fee (matches Firestore rule)
        paystackReference: paystackRef || null,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      // Non-fatal: order still placed locally even if Firestore write fails
      console.error('[Checkout] Firestore order write failed:', err);
    }

    // Notify admin via Firestore + Privyr CRM webhook
    await createNotification(
      'order',
      `New Order: ${newOrderId}`,
      `Order ${newOrderId} placed by ${deliveryDetails?.fullName} for ₦${(getTotal() + 2500).toLocaleString()}. Payment: ${paymentMethod}.`,
      { order, deliveryDetails }
    );

    addOrder(order);
    clearCart();
    setStep('success');
    setIsPlacingOrder(false);
  };

  /**
   * Triggers the Paystack inline payment popup.
   * Only calls placeOrder() after successful payment confirmation.
   */
  const handlePaystackPayment = () => {
    initializePayment({
      amount: getTotal() + 2500,
      email: deliveryDetails?.email || `${deliveryDetails?.phone || '0000000000'}@floperia.customer`,
      onSuccess: (reference: string) => {
        placeOrder(reference);
      },
      onClose: () => {
        // User dismissed the payment modal — do not place order
        console.log('[Checkout] Paystack modal dismissed.');
      },
    });
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center space-y-8 bg-brand-off-white">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12 }}
          className="w-32 h-32 bg-brand-plum text-brand-gold rounded-full flex items-center justify-center shadow-2xl"
        >
          <CheckCircle2 size={80} />
        </motion.div>
        
        <div className="space-y-3">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-brand-plum tracking-tight font-display"
          >
            Order Received!
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-brand-charcoal/70 max-w-xs mx-auto"
          >
            Your beautiful pieces are being prepared with love. We'll notify you once they're on the way!
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-8 rounded-3xl shadow-card-rest w-full max-w-sm space-y-4 border border-brand-blush"
        >
          <div className="space-y-1">
            <p className="text-[10px] text-brand-gray font-bold uppercase tracking-[0.2em]">Order Reference</p>
            {/* Always shows the same ID that was saved to Firestore — Bug fix: was previously re-generating a random ID on each render */}
            <p className="text-3xl font-bold text-brand-plum tracking-widest">{confirmedOrderId}</p>
          </div>
          <div className="h-px bg-brand-gray/10 w-full" />
          <p className="text-xs text-brand-gray italic">A confirmation has been sent to your device.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col w-full max-w-sm gap-4"
        >
          <button onClick={() => navigate('/orders')} className="btn-gold w-full py-4 shadow-lg">
            Track My Order
          </button>
          <button onClick={() => navigate('/')} className="text-brand-plum font-bold text-sm uppercase tracking-widest hover:underline">
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="p-4 flex items-center gap-3 sticky top-0 bg-brand-off-white z-30 border-b border-brand-gray/10">
        <button onClick={() => step === 'payment' ? setStep('delivery') : navigate('/cart')} className="p-2 text-brand-plum">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-brand-plum">
          {step === 'delivery' ? 'Delivery Details' : 'Payment Method'}
        </h1>
      </div>

      {/* Progress */}
      <div className="px-8 py-4 flex items-center justify-between relative">
        <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-brand-gray/10 z-0" />
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center z-10 font-bold text-sm transition-all", step === 'delivery' || step === 'payment' ? "bg-brand-plum text-white" : "bg-brand-gray/20 text-brand-gray")}>1</div>
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center z-10 font-bold text-sm transition-all", step === 'payment' ? "bg-brand-plum text-white" : "bg-brand-gray/20 text-brand-gray")}>2</div>
        <div className="w-8 h-8 rounded-full bg-brand-gray/20 text-brand-gray flex items-center justify-center z-10 font-bold text-sm">3</div>
      </div>

      <div className="px-4 py-4">
        {step === 'delivery' ? (
          <form onSubmit={handleSubmit(onDeliverySubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-plum uppercase ml-2">Full Name</label>
              <input {...register('fullName')} className="w-full h-14 bg-white rounded-input px-4 border-none shadow-card-rest focus:ring-2 focus:ring-brand-plum" placeholder="Iniobong Donatus" />
              {errors.fullName && <p className="text-red-500 text-[10px] font-bold ml-2 uppercase">{errors.fullName.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-plum uppercase ml-2">Phone Number</label>
              <input {...register('phone')} type="tel" className="w-full h-14 bg-white rounded-input px-4 border-none shadow-card-rest focus:ring-2 focus:ring-brand-plum" placeholder="08067689955" />
              {errors.phone && <p className="text-red-500 text-[10px] font-bold ml-2 uppercase">{errors.phone.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-plum uppercase ml-2">Email (Optional)</label>
              <input {...register('email')} type="email" className="w-full h-14 bg-white rounded-input px-4 border-none shadow-card-rest focus:ring-2 focus:ring-brand-plum" placeholder="service.floperia@gmail.com" />
              {errors.email && <p className="text-red-500 text-[10px] font-bold ml-2 uppercase">{errors.email.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-plum uppercase ml-2">Street Address</label>
              <input {...register('address')} className="w-full h-14 bg-white rounded-input px-4 border-none shadow-card-rest focus:ring-2 focus:ring-brand-plum" placeholder="1 Victory Estate, Elelenwo" />
              {errors.address && <p className="text-red-500 text-[10px] font-bold ml-2 uppercase">{errors.address.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-plum uppercase ml-2">City</label>
                <input {...register('city')} className="w-full h-14 bg-white rounded-input px-4 border-none shadow-card-rest focus:ring-2 focus:ring-brand-plum" placeholder="Port Harcourt" />
                {errors.city && <p className="text-red-500 text-[10px] font-bold ml-2 uppercase">{errors.city.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-plum uppercase ml-2">State</label>
                <input {...register('state')} className="w-full h-14 bg-white rounded-input px-4 border-none shadow-card-rest focus:ring-2 focus:ring-brand-plum" placeholder="Rivers" />
                {errors.state && <p className="text-red-500 text-[10px] font-bold ml-2 uppercase">{errors.state.message}</p>}
              </div>
            </div>
            <button type="submit" className="btn-gold w-full mt-8">Continue to Payment</button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <button 
                onClick={() => setPaymentMethod('paystack')}
                className={cn(
                  "w-full p-4 rounded-card border-2 transition-all flex items-center gap-4",
                  paymentMethod === 'paystack' ? "border-brand-plum bg-brand-plum/5" : "border-brand-gray/10 bg-white"
                )}
              >
                <div className="w-10 h-10 rounded-full bg-brand-plum/10 flex items-center justify-center text-brand-plum">
                  <CreditCard size={20} />
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold text-brand-plum">Pay with Card / Paystack</p>
                  <p className="text-xs text-brand-gray">Debit card, USSD, bank transfer</p>
                </div>
                {paymentMethod === 'paystack' && <CheckCircle2 className="text-brand-plum" size={20} />}
              </button>

              <button 
                onClick={() => setPaymentMethod('transfer')}
                className={cn(
                  "w-full p-4 rounded-card border-2 transition-all flex items-center gap-4",
                  paymentMethod === 'transfer' ? "border-brand-plum bg-brand-plum/5" : "border-brand-gray/10 bg-white"
                )}
              >
                <div className="w-10 h-10 rounded-full bg-brand-plum/10 flex items-center justify-center text-brand-plum">
                  <Truck size={20} />
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold text-brand-plum">Bank Transfer</p>
                  <p className="text-xs text-brand-gray">Transfer and upload receipt</p>
                </div>
                {paymentMethod === 'transfer' && <CheckCircle2 className="text-brand-plum" size={20} />}
              </button>

              <button 
                onClick={() => setPaymentMethod('pod')}
                className={cn(
                  "w-full p-4 rounded-card border-2 transition-all flex items-center gap-4",
                  paymentMethod === 'pod' ? "border-brand-plum bg-brand-plum/5" : "border-brand-gray/10 bg-white"
                )}
              >
                <div className="w-10 h-10 rounded-full bg-brand-plum/10 flex items-center justify-center text-brand-plum">
                  <MapPin size={20} />
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold text-brand-plum">Pay on Delivery</p>
                  <p className="text-xs text-brand-gray">Cash on arrival (PH only)</p>
                </div>
                {paymentMethod === 'pod' && <CheckCircle2 className="text-brand-plum" size={20} />}
              </button>
            </div>

            <div className="bg-white p-6 rounded-card shadow-card-rest space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-brand-gray">Order Total</span>
                <span className="font-bold text-brand-plum">{formatPrice(getTotal())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-gray">Delivery Fee</span>
                <span className="font-bold text-brand-plum">₦2,500</span>
              </div>
              <div className="border-t border-brand-gray/10 pt-3 flex justify-between items-center">
                <span className="font-bold text-brand-plum">Grand Total</span>
                <span className="text-2xl font-bold text-brand-plum">{formatPrice(getTotal() + 2500)}</span>
              </div>
            </div>

            <button
              onClick={paymentMethod === 'paystack' ? handlePaystackPayment : () => placeOrder()}
              disabled={isPlacingOrder}
              className="btn-gold w-full mt-4 flex items-center justify-center gap-2"
            >
              <Lock size={20} />
              {isPlacingOrder ? 'Processing...' : `Pay ${formatPrice(getTotal() + 2500)} Now`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
