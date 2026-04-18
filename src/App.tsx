/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ScrollToTop from './components/ScrollToTop';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useUserStore } from './store/useUserStore';
import { useCartStore } from './store/useCartStore';
import { useWishlistStore } from './store/useWishlistStore';
import { ProtectedRoute } from './components/ProtectedRoute';
import { subscribeToFirestoreStore } from './lib/firestore-sync';

// Lazy load other pages for better performance
const Shop = React.lazy(() => import('./pages/Shop'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const Cart = React.lazy(() => import('./pages/Cart'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const Orders = React.lazy(() => import('./pages/Orders'));
const OrderTracking = React.lazy(() => import('./pages/OrderTracking'));
const About = React.lazy(() => import('./pages/About'));
const Wishlist = React.lazy(() => import('./pages/Wishlist'));
const Training = React.lazy(() => import('./pages/Training'));
const Events = React.lazy(() => import('./pages/Events'));
const Login = React.lazy(() => import('./pages/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Contact = React.lazy(() => import('./pages/Contact'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

export default function App() {
  const { setUser, setLoading } = useUserStore();
  const { setItems: setCartItems } = useCartStore();
  const { setItems: setWishlistItems } = useWishlistStore();

  useEffect(() => {
    let unsubscribeCart: () => void = () => {};
    let unsubscribeWishlist: () => void = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);

      if (user) {
        // Subscribe to Firestore sync
        unsubscribeCart = subscribeToFirestoreStore('carts', user.uid, setCartItems);
        unsubscribeWishlist = subscribeToFirestoreStore('wishlists', user.uid, setWishlistItems);
      } else {
        unsubscribeCart();
        unsubscribeWishlist();
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeCart();
      unsubscribeWishlist();
    };
  }, [setUser, setLoading, setCartItems, setWishlistItems]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <React.Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-brand-off-white">
          <div className="w-12 h-12 border-4 border-brand-plum border-t-brand-gold rounded-full animate-spin" />
        </div>
      }>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="login" element={<Login />} />
            <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="orders/:id/track" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
            <Route path="about" element={<About />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="training" element={<Training />} />
            <Route path="events" element={<Events />} />
            <Route path="contact" element={<Contact />} />
            <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}
