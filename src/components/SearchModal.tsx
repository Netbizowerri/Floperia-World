import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search as SearchIcon, SlidersHorizontal, ArrowRight, Star, History, TrendingUp } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/mock';
import { formatPrice } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  const saveSearch = (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const filteredProducts = useMemo(() => {
    if (!query && !selectedCategory && !showFilters) return [];
    
    return PRODUCTS.filter(product => {
      const matchesQuery = !query || 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase());
      
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesQuery && matchesCategory && matchesPrice;
    }).slice(0, 6);
  }, [query, selectedCategory, priceRange, showFilters]);

  const handleProductClick = (id: string) => {
    saveSearch(query);
    navigate(`/product/${id}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-white">
          {/* Header */}
          <div className="p-4 border-b border-brand-gray/10 flex items-center gap-3 bg-white sticky top-0 z-10">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray" size={20} />
              <input
                autoFocus
                type="text"
                placeholder="Search for accessories..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-brand-off-white border-none rounded-full py-3 pl-10 pr-4 text-brand-plum focus:ring-2 focus:ring-brand-gold transition-all"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "p-3 rounded-full transition-colors",
                showFilters ? "bg-brand-plum text-white" : "bg-brand-off-white text-brand-plum"
              )}
            >
              <SlidersHorizontal size={20} />
            </button>
            <button onClick={onClose} className="p-2 text-brand-plum">
              <X size={24} />
            </button>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-brand-off-white border-b border-brand-gray/10"
              >
                <div className="p-6 space-y-6">
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-brand-gray uppercase tracking-widest">Category</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={cn(
                          "px-4 py-2 rounded-full text-xs font-bold transition-all",
                          !selectedCategory ? "bg-brand-plum text-white" : "bg-white text-brand-plum border border-brand-gray/10"
                        )}
                      >
                        All
                      </button>
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={cn(
                            "px-4 py-2 rounded-full text-xs font-bold transition-all",
                            selectedCategory === cat.id ? "bg-brand-plum text-white" : "bg-white text-brand-plum border border-brand-gray/10"
                          )}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <p className="text-xs font-bold text-brand-gray uppercase tracking-widest">Price Range</p>
                      <p className="text-xs font-bold text-brand-plum">{formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</p>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full accent-brand-gold"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-8">
            {query === '' && !selectedCategory && (
              <>
                {recentSearches.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-brand-plum flex items-center gap-2">
                        <History size={16} /> Recent Searches
                      </h3>
                      <button 
                        onClick={() => {
                          setRecentSearches([]);
                          localStorage.removeItem('recentSearches');
                        }}
                        className="text-[10px] font-bold text-brand-gray uppercase tracking-widest"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term, i) => (
                        <button
                          key={i}
                          onClick={() => setQuery(term)}
                          className="px-4 py-2 bg-brand-off-white rounded-full text-xs text-brand-plum hover:bg-brand-plum/5 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-brand-plum flex items-center gap-2">
                    <TrendingUp size={16} /> Popular Categories
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {CATEGORIES.slice(0, 4).map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className="flex items-center gap-3 p-3 bg-brand-off-white rounded-2xl hover:bg-brand-plum/5 transition-all text-left group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-plum group-hover:bg-brand-plum group-hover:text-white transition-all">
                          <span className="font-bold">{cat.label[0]}</span>
                        </div>
                        <span className="text-sm font-bold text-brand-plum">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {filteredProducts.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-brand-gray uppercase tracking-widest">
                  Found {filteredProducts.length} Results
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {filteredProducts.map(product => (
                    <button
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      className="flex gap-4 p-3 bg-white rounded-2xl border border-brand-gray/5 hover:border-brand-gold transition-all text-left"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 py-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-brand-plum text-sm line-clamp-1">{product.name}</h4>
                          <p className="text-[10px] text-brand-gray uppercase tracking-widest">{product.subcategory}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-brand-plum">{formatPrice(product.price)}</span>
                          <div className="flex items-center gap-1 text-brand-gold">
                            <Star size={10} fill="currentColor" />
                            <span className="text-[10px] font-bold">{product.rating}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <Link 
                  to="/shop" 
                  onClick={onClose}
                  className="w-full py-4 text-center text-brand-gold font-bold text-sm flex items-center justify-center gap-2"
                >
                  View all products <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              query && (
                <div className="py-20 text-center space-y-4">
                  <div className="w-20 h-20 bg-brand-off-white rounded-full flex items-center justify-center mx-auto text-brand-gray">
                    <SearchIcon size={32} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-brand-plum">No results found</p>
                    <p className="text-sm text-brand-gray">Try adjusting your search or filters</p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
