import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Heart, Star, ShoppingBag, Truck, RotateCcw, Palette, MessageCircle, Play } from 'lucide-react';
import { fetchProductById } from '../firebase';
import { formatPrice, cn } from '../lib/utils';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { motion } from 'motion/react';
import { useQuery } from '@tanstack/react-query';

import { useToastStore } from '../store/useToastStore';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id,
  });

  const [activeImage, setActiveImage] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const addToast = useToastStore((state) => state.addToast);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-plum border-t-brand-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold text-brand-plum">Product not found</h2>
        <button onClick={() => navigate('/shop')} className="btn-primary">Back to Shop</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product as any, quantity);
    addToast(`${product.name} added to cart`, 'success');
  };

  const handleOrderNow = () => {
    addItem(product as any, quantity);
    navigate('/checkout');
  };

  const handleAddToBag = () => {
    addItem(product as any, quantity);
    navigate('/cart');
  };

  const handleWhatsAppOrder = () => {
    const message = `Hello Floperia Classic World, I am interested in ordering ${product.name} For ${formatPrice(product.price)}. How can I order?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/2348067689955?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="pb-12">
      {/* Top Bar Overlay */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 pointer-events-none">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm pointer-events-auto text-brand-plum"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex gap-2 pointer-events-auto">
          <button className="p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm text-brand-plum">
            <Share2 size={24} />
          </button>
          <button 
            onClick={() => toggleWishlist(product)}
            className="p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm text-brand-plum"
          >
            <Heart size={24} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative aspect-square bg-white">
        {showVideo && product.videoUrl ? (
          <div className="w-full h-full bg-black">
            <iframe
              src={product.videoUrl.includes('vimeo.com') 
                ? `https://player.vimeo.com/video/${product.videoUrl.split('/').pop()}?autoplay=1`
                : product.videoUrl}
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
            <button 
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white p-2 rounded-full"
            >
              ✕
            </button>
          </div>
        ) : (
          <>
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {product.videoUrl && (
              <button 
                onClick={() => setShowVideo(true)}
                className="absolute bottom-20 right-4 bg-brand-plum/80 backdrop-blur-md text-white p-4 rounded-full shadow-xl flex items-center gap-2 font-bold text-sm"
              >
                <Play size={20} fill="currentColor" /> Watch Video
              </button>
            )}
          </>
        )}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {product.images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(idx)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                activeImage === idx ? "bg-brand-plum w-6" : "bg-brand-plum/30"
              )}
            />
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="px-4 py-6 space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-bold text-brand-gray uppercase tracking-widest">
            {product.category} / {product.subcategory}
          </p>
          <h1 className="text-2xl font-bold text-brand-plum leading-tight">
            {product.name}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-brand-gold">
              <Star size={16} fill="currentColor" />
              <span className="text-sm font-bold">{product.rating}</span>
            </div>
            <span className="text-brand-gray text-sm">{product.reviewCount} Reviews</span>
          </div>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-brand-plum">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-lg text-brand-gray line-through">{formatPrice(product.originalPrice)}</span>
          )}
          {product.discountPercent && (
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-md">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-brand-plum">Description</h3>
          <p className="text-brand-charcoal/80 leading-relaxed text-sm">
            {product.description}
          </p>
        </div>

        {/* Accordions */}
        <div className="border-t border-brand-gray/10 pt-4 space-y-4">
          <div className="flex items-center gap-3 py-2">
            <Truck className="text-brand-plum" size={20} />
            <div className="flex-1">
              <p className="text-sm font-bold text-brand-plum">Delivery Info</p>
              <p className="text-xs text-brand-gray">Nationwide delivery. PH same-day available.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 py-2">
            <Palette className="text-brand-plum" size={20} />
            <div className="flex-1">
              <p className="text-sm font-bold text-brand-plum">Custom Orders</p>
              <p className="text-xs text-brand-gray">Contact us for bespoke or bulk orders.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 py-2">
            <RotateCcw className="text-brand-plum" size={20} />
            <div className="flex-1">
              <p className="text-sm font-bold text-brand-plum">Returns</p>
              <p className="text-xs text-brand-gray">Custom items are non-returnable.</p>
            </div>
          </div>
        </div>

        {/* CTA Section (Non-sticky) */}
        <div className="pt-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-brand-off-white rounded-full p-1 border border-brand-blush">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center font-bold text-brand-plum"
              >
                -
              </button>
              <span className="w-8 text-center font-bold text-brand-plum">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center font-bold text-brand-plum"
              >
                +
              </button>
            </div>
            <button 
              onClick={handleOrderNow}
              className="btn-gold flex-1 flex items-center justify-center gap-2"
            >
              Order Now
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleAddToBag}
              className="btn-secondary flex items-center justify-center gap-2 py-3"
            >
              <ShoppingBag size={18} /> Add to Bag
            </button>
            <button 
              onClick={handleWhatsAppOrder}
              className="bg-[#25D366] text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 py-3 active:scale-95 transition-transform"
            >
              <MessageCircle size={18} fill="currentColor" /> WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
