import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Star, Heart } from 'lucide-react';
import { fetchProducts, fetchCategories, migrateData, checkIsAdmin } from '../firebase';
import { formatPrice, cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { useWishlistStore } from '../store/useWishlistStore';
import { useUserStore } from '../store/useUserStore';
import { motion, AnimatePresence } from 'motion/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useUserStore();
  const isAdmin = checkIsAdmin(user);
  
  const activeCategory = searchParams.get('category') || 'all';
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const handleSync = async () => {
    if (window.confirm('Do you want to sync all mock products to the live database?')) {
      try {
        await migrateData();
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        alert('Database synced successfully!');
      } catch (error) {
        console.error('Sync failed:', error);
        alert('Sync failed. Check console for details.');
      }
    }
  };

  const filteredProducts = useMemo(() => {
    return (products as any[]).filter((product) => {
      if (product.active === false) return false;
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           product.subcategory.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, products]);

  if (isLoadingProducts || isLoadingCategories) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-plum border-t-brand-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Search Bar */}
      <div className="sticky top-16 z-30 bg-brand-off-white/95 backdrop-blur-sm py-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray" size={20} />
          <input
            type="text"
            placeholder="Search accessories, craft..."
            className="w-full h-12 pl-12 pr-4 bg-white rounded-full border-none shadow-card-rest focus:ring-2 focus:ring-brand-plum transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSearchParams({ category: 'all' })}
          className={cn(
            "px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all",
            activeCategory === 'all' ? "bg-brand-plum text-white" : "bg-white text-brand-charcoal shadow-sm"
          )}
        >
          All
        </button>
        {categories.map((cat: any) => (
          <button
            key={cat.id}
            onClick={() => setSearchParams({ category: cat.id })}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all",
              activeCategory === cat.id ? "bg-brand-plum text-white" : "bg-white text-brand-charcoal shadow-sm"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Filter/Sort Bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-brand-gray">
          {filteredProducts.length} Results
        </p>
        <button 
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 text-brand-plum font-bold text-sm bg-white px-4 py-2 rounded-full shadow-sm"
        >
          <SlidersHorizontal size={16} /> Filter
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="bg-white rounded-card overflow-hidden shadow-card-rest flex flex-col"
            >
              <Link to={`/product/${product.id}`} className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {product.isNew && (
                  <span className="absolute top-2 left-2 bg-brand-plum text-white text-[10px] font-bold px-2 py-1 rounded-full">
                    NEW
                  </span>
                )}
                {product.discountPercent && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                    -{product.discountPercent}%
                  </span>
                )}
              </Link>
              <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-brand-plum line-clamp-2 leading-tight">{product.name}</h3>
                  <p className="text-xs text-brand-gray">{product.subcategory}</p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-col">
                    <span className="text-brand-plum font-bold text-sm">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-[10px] text-brand-gray line-through">{formatPrice(product.originalPrice)}</span>
                    )}
                  </div>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(product);
                    }}
                    className="text-brand-plum p-1"
                  >
                    <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="py-20 text-center space-y-4">
          <div className="w-20 h-20 bg-brand-plum/5 rounded-full flex items-center justify-center mx-auto">
            <Search size={32} className="text-brand-plum/40" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-brand-plum">No pieces found</h3>
            <p className="text-brand-gray text-sm">Try different search terms or browse all categories.</p>
          </div>
          <div className="flex flex-col gap-3 items-center">
            <button 
              onClick={() => {
                setSearchQuery('');
                setSearchParams({ category: 'all' });
              }}
              className="btn-primary"
            >
              Clear All Filters
            </button>
            {isAdmin && (
              <button 
                onClick={handleSync}
                className="text-brand-plum font-bold text-sm hover:underline"
              >
                Sync Database (Admin Only)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
