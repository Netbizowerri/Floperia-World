import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ArrowLeft, ShoppingBag, Home, Package, Info } from 'lucide-react';
import { CATEGORIES } from '../data/mock';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useUserStore } from '../store/useUserStore';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [showCategories, setShowCategories] = useState(false);
  const navigate = useNavigate();
  const { user } = useUserStore();

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/shop?category=${categoryId}`);
    onClose();
    // Reset state after a delay to avoid flicker during exit animation
    setTimeout(() => setShowCategories(false), 300);
  };

  const menuItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Shop', icon: ShoppingBag, onClick: () => setShowCategories(true) },
    { label: 'My Orders', icon: Package, path: '/orders' },
    { label: 'About Us', icon: Info, path: '/about' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* Menu Tray */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white z-[70] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-brand-gray/10 flex items-center justify-between bg-brand-off-white text-brand-plum">
              <img src="https://i.ibb.co/vxHHjNDW/Floperia-Classic-World-1.png" alt="Floperia Classic World" className="h-8 object-contain" />
              <button onClick={onClose} className="p-2 hover:bg-brand-plum/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Content Area with Sliding Panels */}
            <div className="flex-1 relative">
              {/* Main Menu Panel */}
              <motion.div
                animate={{ x: showCategories ? '-100%' : '0%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute inset-0 p-4 space-y-2"
              >
                {menuItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (item.onClick) {
                        item.onClick();
                      } else if (item.path) {
                        navigate(item.path);
                        onClose();
                      }
                    }}
                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-brand-plum/5 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-plum/5 flex items-center justify-center text-brand-plum group-hover:bg-brand-plum group-hover:text-white transition-all">
                        <item.icon size={20} />
                      </div>
                      <span className="font-bold text-brand-plum text-lg">{item.label}</span>
                    </div>
                    {(item.label === 'Shop') && <ChevronRight size={20} className="text-brand-gray" />}
                  </button>
                ))}
              </motion.div>

              {/* Categories Panel */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: showCategories ? '0%' : '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute inset-0 bg-brand-off-white p-4 flex flex-col"
              >
                <button 
                  onClick={() => setShowCategories(false)}
                  className="flex items-center gap-2 p-4 text-brand-plum font-bold mb-4 hover:bg-brand-plum/5 rounded-xl transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span>Back to Menu</span>
                </button>

                <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                  <p className="px-4 text-xs font-bold text-brand-gray uppercase tracking-widest mb-4">Shop by Category</p>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.id)}
                      className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-brand-gray/5 hover:border-brand-gold transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-brand-plum"
                          style={{ backgroundColor: `${cat.color}33` }}
                        >
                          <span className="font-bold">{cat.label[0]}</span>
                        </div>
                        <span className="font-bold text-brand-plum">{cat.label}</span>
                      </div>
                      <ChevronRight size={18} className="text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-brand-plum/5 border-t border-brand-gray/10">
              <p className="text-xs text-brand-gray text-center font-medium">
                © 2026 Floperia Classic World
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
