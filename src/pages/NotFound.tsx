import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-off-white flex items-center justify-center px-4 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-8 max-w-md w-full"
      >
        {/* Large decorative 404 */}
        <div className="relative">
          <p className="text-[10rem] leading-none font-bold text-brand-plum/5 font-display select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 bg-brand-plum rounded-full flex items-center justify-center shadow-2xl"
            >
              <span className="text-brand-gold text-4xl font-bold font-display">?</span>
            </motion.div>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-plum uppercase tracking-tighter font-display">
            Page Not Found
          </h1>
          <p className="text-brand-gray font-medium text-base">
            The page you're looking for doesn't exist or may have been moved.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn-gold flex items-center justify-center gap-2 px-8 py-4"
          >
            <Home size={20} />
            Back to Home
          </Link>
          <Link
            to="/shop"
            className="btn-secondary flex items-center justify-center gap-2 px-8 py-4"
          >
            <ShoppingBag size={20} />
            Browse Shop
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
