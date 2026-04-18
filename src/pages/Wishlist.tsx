import React from 'react';
import { useWishlistStore } from '../store/useWishlistStore';
import { formatPrice } from '../lib/utils';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Wishlist() {
  const { items, toggleWishlist } = useWishlistStore();

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="w-24 h-24 bg-brand-plum/5 rounded-full flex items-center justify-center">
          <Heart size={48} className="text-brand-plum/20" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-brand-plum">Your wishlist is empty</h2>
          <p className="text-brand-gray">Tap the ♡ on any product to save your favourites here.</p>
        </div>
        <Link to="/shop" className="btn-primary">Discover Products</Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-brand-plum">My Wishlist</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {items.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-card overflow-hidden shadow-card-rest flex flex-col"
            >
              <Link to={`/product/${product.id}`} className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </Link>
              <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-brand-plum line-clamp-2 leading-tight">{product.name}</h3>
                  <p className="text-xs text-brand-gray">{product.subcategory}</p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-brand-plum font-bold text-sm">{formatPrice(product.price)}</span>
                  <button 
                    onClick={() => toggleWishlist(product)}
                    className="text-brand-plum p-1"
                  >
                    <Heart size={18} fill="currentColor" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
