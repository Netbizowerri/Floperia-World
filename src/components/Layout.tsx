import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Grid, ShoppingBag, Package, Sparkles, Search, MessageCircle, ArrowLeft, Lock, Menu } from 'lucide-react';
import { cn } from '../lib/utils';
import { useCartStore } from '../store/useCartStore';
import { motion, AnimatePresence } from 'motion/react';

import ToastContainer from './ui/ToastContainer';
import Footer from './Footer';
import MobileMenu from './MobileMenu';
import SearchModal from './SearchModal';

export default function Layout() {
  const itemCount = useCartStore((state) => state.getItemCount());
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'shop', label: 'Shop', icon: Grid, path: '/shop' },
    { id: 'cart', label: 'Cart', icon: ShoppingBag, path: '/cart', badge: itemCount },
    { id: 'orders', label: 'Orders', icon: Package, path: '/orders' },
    { id: 'about', label: 'About', icon: Sparkles, path: '/about' },
  ];

  const isProductPage = location.pathname.startsWith('/product/');
  const isCheckoutPage = location.pathname === '/checkout';
  const isAboutPage = location.pathname === '/about';
  const isCartPage = location.pathname === '/cart';
  const isOrdersPage = location.pathname.startsWith('/orders');
  const isShopPage = location.pathname === '/shop';

  const getHeaderTitle = () => {
    if (isCartPage) return 'My Cart';
    if (isOrdersPage) return 'My Orders';
    if (isShopPage) return 'Shop';
    return null;
  };

  const showBackArrow = isCartPage || isOrdersPage || isShopPage;
  const title = getHeaderTitle();

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <ToastContainer />
      {/* Top App Bar */}
      {!isProductPage && !isCheckoutPage && !isAboutPage && (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-gray/10 px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBackArrow && (
              <button 
                onClick={() => navigate(-1)}
                className="p-2 -ml-2 text-brand-plum hover:bg-brand-plum/5 rounded-full transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
            )}
            {!title ? (
              <button onClick={() => navigate('/')} className="hover:opacity-80 transition-opacity flex items-center">
                <img src="https://i.ibb.co/vxHHjNDW/Floperia-Classic-World-1.png" alt="Floperia Classic World" className="h-10 object-contain" />
              </button>
            ) : (
              <span className="font-display text-xl font-bold text-brand-plum tracking-tight">{title}</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {!isCheckoutPage && (
              <>
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-brand-plum hover:bg-brand-plum/5 rounded-full transition-colors"
                >
                  <Search size={24} />
                </button>
                <button 
                  onClick={() => setIsMenuOpen(true)}
                  className="p-2 text-brand-plum hover:bg-brand-plum/5 rounded-full transition-colors"
                >
                  <Menu size={24} />
                </button>
              </>
            )}
            {isCheckoutPage && <Lock size={20} className="text-brand-plum" />}
          </div>
        </header>
      )}

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Main Content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 h-20 bg-white/95 backdrop-blur-md border-t border-brand-gray/10 px-2 shadow-bottom-nav flex items-center justify-around pb-safe">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all relative",
                isActive ? "text-brand-plum" : "text-brand-gray"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <item.icon size={24} strokeWidth={isActive ? 2.5 : 1.5} />
                  {item.badge > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-brand-gold text-brand-charcoal text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white"
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </div>
                <span className={cn("text-[10px] font-semibold uppercase tracking-wider", isActive ? "opacity-100" : "opacity-70")}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 w-1 h-1 bg-brand-gold rounded-full"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
