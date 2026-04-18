import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, ArrowLeft, ShoppingBag, Lock } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { formatPrice } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal, getItemCount, clearCart } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="w-24 h-24 bg-brand-plum/5 rounded-full flex items-center justify-center">
          <ShoppingBag size={48} className="text-brand-plum/20" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-brand-plum">Your cart is empty</h2>
          <p className="text-brand-gray">Discover stunning bridal accessories and Ankara craft.</p>
        </div>
        <Link to="/shop" className="btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="pb-32">
      {/* Items List */}
      <div className="px-4 py-4 space-y-4">
        <div className="flex justify-between items-center px-2">
          <p className="text-xs font-bold text-brand-gray uppercase tracking-widest">{getItemCount()} Items</p>
          <button 
            onClick={() => clearCart()}
            className="text-[10px] font-bold text-red-400 uppercase tracking-widest"
          >
            Clear Bag
          </button>
        </div>
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white rounded-card p-3 flex gap-4 shadow-card-rest relative overflow-hidden"
            >
              <div className="w-20 h-20 rounded-image overflow-hidden flex-shrink-0">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1 space-y-1 min-w-0">
                <h3 className="text-sm font-bold text-brand-plum truncate">{item.name}</h3>
                <p className="text-xs text-brand-gray">{item.subcategory}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-brand-plum font-bold">{formatPrice(item.price)}</span>
                  <div className="flex items-center bg-brand-off-white rounded-full border border-brand-blush scale-90">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center font-bold text-brand-plum"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-brand-plum">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center font-bold text-brand-plum"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => removeItem(item.id)}
                className="absolute top-2 right-2 p-1 text-red-400"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Summary */}
      <div className="px-4 py-6 space-y-4">
        <div className="bg-white rounded-card p-6 space-y-3 shadow-card-rest">
          <div className="flex justify-between text-sm">
            <span className="text-brand-gray">Subtotal</span>
            <span className="font-bold text-brand-plum">{formatPrice(getTotal())}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-brand-gray">Delivery</span>
            <span className="text-brand-gold font-bold italic">Calculated at checkout</span>
          </div>
          <div className="border-t border-brand-gray/10 pt-3 flex justify-between items-center">
            <span className="font-bold text-brand-plum">Total</span>
            <span className="text-2xl font-bold text-brand-plum">{formatPrice(getTotal())}</span>
          </div>
        </div>
      </div>

      {/* Sticky Checkout Bar */}
      <div className="fixed bottom-20 left-0 right-0 z-40 bg-white border-t border-brand-gray/10 p-4 shadow-sticky-bar">
        <div className="max-w-lg mx-auto space-y-2">
          <button 
            onClick={() => navigate('/checkout')}
            className="btn-gold w-full flex items-center justify-center gap-2"
          >
            <Lock size={20} /> Proceed to Checkout
          </button>
          <p className="text-[10px] text-center text-brand-gray uppercase tracking-widest font-bold">
            Secure Checkout Guaranteed
          </p>
        </div>
      </div>
    </div>
  );
}
