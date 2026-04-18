import React, { useCallback, useEffect } from 'react';
import { motion } from 'motion/react';
import { CATEGORIES, PRODUCTS } from '../data/mock';
import { formatPrice } from '../lib/utils';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Star, 
  Heart, 
  ChevronLeft, 
  ChevronRight,
  Crown,
  UserRound,
  Sparkles,
  Palette,
  GraduationCap,
  CalendarHeart,
  Database
} from 'lucide-react';
import { useWishlistStore } from '../store/useWishlistStore';
import { useUserStore } from '../store/useUserStore';
import { migrateData, checkIsAdmin } from '../firebase';
import useEmblaCarousel from 'embla-carousel-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  Crown: <Crown size={48} strokeWidth={1.2} className="drop-shadow-[2px_2px_0px_rgba(74,14,60,0.2)] drop-shadow-[4px_4px_0px_rgba(74,14,60,0.1)] drop-shadow-[6px_6px_10px_rgba(0,0,0,0.2)]" />,
  UserRound: <UserRound size={48} strokeWidth={1.2} className="drop-shadow-[2px_2px_0px_rgba(74,14,60,0.2)] drop-shadow-[4px_4px_0px_rgba(74,14,60,0.1)] drop-shadow-[6px_6px_10px_rgba(0,0,0,0.2)]" />,
  Sparkles: <Sparkles size={48} strokeWidth={1.2} className="drop-shadow-[2px_2px_0px_rgba(74,14,60,0.2)] drop-shadow-[4px_4px_0px_rgba(74,14,60,0.1)] drop-shadow-[6px_6px_10px_rgba(0,0,0,0.2)]" />,
  Palette: <Palette size={48} strokeWidth={1.2} className="drop-shadow-[2px_2px_0px_rgba(74,14,60,0.2)] drop-shadow-[4px_4px_0px_rgba(74,14,60,0.1)] drop-shadow-[6px_6px_10px_rgba(0,0,0,0.2)]" />,
  GraduationCap: <GraduationCap size={48} strokeWidth={1.2} className="drop-shadow-[2px_2px_0px_rgba(74,14,60,0.2)] drop-shadow-[4px_4px_0px_rgba(74,14,60,0.1)] drop-shadow-[6px_6px_10px_rgba(0,0,0,0.2)]" />,
  CalendarHeart: <CalendarHeart size={48} strokeWidth={1.2} className="drop-shadow-[2px_2px_0px_rgba(74,14,60,0.2)] drop-shadow-[4px_4px_0px_rgba(74,14,60,0.1)] drop-shadow-[6px_6px_10px_rgba(0,0,0,0.2)]" />
};

export default function Home() {
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { user } = useUserStore();
  const isAdmin = checkIsAdmin(user);

  const handleMigrate = async () => {
    if (window.confirm('Do you want to sync all mock products to the live database?')) {
      try {
        await migrateData();
        alert('Migration successful! All products are now live.');
      } catch (error) {
        console.error('Migration failed:', error);
        alert('Migration failed. Check console for details.');
      }
    }
  };

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 }
    }
  });

  const [newArrivalsRef, newArrivalsApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 }
    }
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollNewPrev = useCallback(() => {
    if (newArrivalsApi) newArrivalsApi.scrollPrev();
  }, [newArrivalsApi]);

  const scrollNewNext = useCallback(() => {
    if (newArrivalsApi) newArrivalsApi.scrollNext();
  }, [newArrivalsApi]);

  // Latest 10 products for New Arrivals
  const newArrivals = [...PRODUCTS].reverse().slice(0, 10);
  
  // Featured products (highest prices)
  const featuredProducts = [...PRODUCTS].sort((a, b) => b.price - a.price).slice(0, 6);

  return (
    <div className="space-y-16 pb-16 font-sans">
      {/* Hero Section */}
      <section className="relative h-[75vh] overflow-hidden">
        {/* Mobile Hero */}
        <img
          src="https://i.ibb.co/46nwpWJ/Floperia.jpg"
          alt="Floperia Bridal Mobile"
          className="w-full h-full object-cover object-top md:hidden"
          referrerPolicy="no-referrer"
        />
        {/* Desktop Hero */}
        <img
          src="https://i.ibb.co/2Y6Mz6Yg/Untitled-design-1.jpg"
          alt="Floperia Bridal Desktop"
          className="hidden md:block w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-plum via-brand-plum/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white text-3xl md:text-5xl font-semibold leading-none tracking-tight drop-shadow-lg"
          >
            CROWN YOUR <br />
            <span className="text-brand-gold">CELEBRATION</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-brand-off-white/90 text-xl md:text-2xl max-w-xl font-medium"
          >
            Exquisite handcrafted bridal accessories and Ankara craft for your most memorable moments.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/shop" className="btn-gold px-10 py-5 text-lg inline-flex items-center gap-3">
              EXPLORE COLLECTION <ArrowRight size={24} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Carousel */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-bold text-brand-plum tracking-tight uppercase">Shop by Category</h2>
            <div className="w-24 h-1.5 bg-brand-gold mx-auto md:mx-0 rounded-full" />
          </div>
          <div className="flex items-center justify-center gap-4">
            <button 
              onClick={scrollPrev}
              className="w-12 h-12 rounded-full border-2 border-brand-plum/10 flex items-center justify-center text-brand-plum hover:bg-brand-plum hover:text-white transition-all"
              aria-label="Previous categories"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={scrollNext}
              className="w-12 h-12 rounded-full border-2 border-brand-plum/10 flex items-center justify-center text-brand-plum hover:bg-brand-plum hover:text-white transition-all"
              aria-label="Next categories"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-6">
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="flex-[0_0_50%] sm:flex-[0_0_33.33%] md:flex-[0_0_25%] lg:flex-[0_0_16.66%] pl-6">
                <Link
                  to={`/shop?category=${cat.id}`}
                  className="flex flex-col items-center gap-4 group perspective-1000"
                >
                  <motion.div 
                    whileHover={{ 
                      scale: 1.05
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-full aspect-square rounded-[2.5rem] flex items-center justify-center transition-all duration-500 shadow-card-rest group-hover:shadow-card-hover group-active:scale-95 relative overflow-hidden bg-brand-off-white border border-white/40"
                  >
                    {cat.bgImage && (
                      <div className="absolute inset-0">
                        <img 
                          src={cat.bgImage} 
                          alt={cat.label} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                  </motion.div>
                  <p className="text-sm md:text-base font-bold text-center uppercase tracking-wider text-brand-charcoal group-hover:text-brand-plum transition-colors line-clamp-1 px-2">
                    {cat.label}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Carousel */}
      <section className="bg-brand-plum py-10 md:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6 md:space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-2xl md:text-5xl font-bold text-white tracking-tight uppercase">New Arrivals</h2>
              <p className="text-brand-blush text-sm md:text-base font-medium">The latest additions to our creative world</p>
            </div>
            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={scrollNewPrev}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-brand-plum transition-all"
                aria-label="Previous arrivals"
              >
                <ChevronLeft size={20} className="md:w-6 md:h-6" />
              </button>
              <button 
                onClick={scrollNewNext}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-brand-plum transition-all"
                aria-label="Next arrivals"
              >
                <ChevronRight size={20} className="md:w-6 md:h-6" />
              </button>
              <Link to="/shop" className="hidden md:flex text-brand-gold font-bold text-sm items-center gap-2 hover:gap-3 transition-all uppercase tracking-widest ml-4">
                View All <ArrowRight size={20} />
              </Link>
            </div>
          </div>
          
          <div className="overflow-hidden" ref={newArrivalsRef}>
            <div className="flex -ml-6">
              {newArrivals.map((product) => (
                <div key={product.id} className="flex-[0_0_70%] md:flex-[0_0_40%] lg:flex-[0_0_30%] pl-6 group">
                  <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                    <Link to={`/product/${product.id}`} className="relative aspect-square md:aspect-[4/5] block overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-brand-gold text-brand-plum text-[8px] md:text-[10px] font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-xl">
                        NEW
                      </div>
                    </Link>
                    <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                      <div className="space-y-1">
                        <h3 className="text-sm md:text-lg font-semibold text-brand-plum line-clamp-1 leading-tight group-hover:text-brand-gold transition-colors uppercase tracking-tight">
                          {product.name}
                        </h3>
                        <p className="text-[10px] md:text-xs font-bold text-brand-gray uppercase tracking-widest">{product.subcategory}</p>
                      </div>
                      <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-brand-gray/10">
                        <span className="text-brand-plum font-bold text-base md:text-xl">{formatPrice(product.price)}</span>
                        <button 
                          onClick={() => toggleWishlist(product)}
                          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-brand-plum/5 flex items-center justify-center text-brand-plum hover:bg-brand-plum hover:text-white transition-all shadow-sm"
                        >
                          <Heart size={18} className="md:w-5 md:h-5" fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section (Highest Prices) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-plum tracking-tight uppercase">Luxury Collection</h2>
          <p className="text-brand-gray font-medium max-w-2xl mx-auto">Our most exclusive and premium handcrafted pieces for those who settle for nothing but the best.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-12">
          {featuredProducts.map((product) => (
            <div key={product.id} className="group relative bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-card-rest hover:shadow-card-hover transition-all duration-500">
              <Link to={`/product/${product.id}`} className="relative aspect-[3/4] block overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-plum/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 right-4 md:right-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <button className="w-full bg-white text-brand-plum py-2 md:py-4 rounded-full font-bold text-[10px] md:text-sm uppercase tracking-widest shadow-2xl">
                    View Details
                  </button>
                </div>
              </Link>
              <div className="p-4 md:p-8 space-y-2 md:space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start gap-2">
                  <div className="space-y-1">
                    <h3 className="text-sm md:text-xl font-semibold text-brand-plum uppercase tracking-tight leading-tight line-clamp-2 md:line-clamp-none">{product.name}</h3>
                    <p className="text-[10px] md:text-xs font-bold text-brand-gold uppercase tracking-[0.2em]">{product.category}</p>
                  </div>
                  <div className="flex items-center gap-1 text-brand-gold">
                    <Star size={12} className="md:w-4 md:h-4" fill="currentColor" />
                    <span className="text-[10px] md:text-sm font-bold">{product.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 md:pt-6 border-t border-brand-gray/5">
                  <span className="text-brand-plum font-bold text-sm md:text-2xl">{formatPrice(product.price)}</span>
                  <button 
                    onClick={() => toggleWishlist(product)}
                    className="text-brand-plum hover:text-brand-gold transition-colors"
                  >
                    <Heart size={18} className="md:w-6 md:h-6" fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Training & Events Banners */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Training Banner */}
        <motion.div 
          whileHover={{ y: -10 }}
          className="relative h-[500px] rounded-[3rem] overflow-hidden group shadow-2xl"
        >
          <img 
            src="https://i.ibb.co/NdYq2f1J/Whats-App-Image-2026-04-08-at-1-18-50-AM-1.jpg" 
            alt="Training" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-brand-plum/40 group-hover:bg-brand-plum/60 transition-colors duration-500" />
          <div className="absolute inset-0 p-10 flex flex-col justify-end space-y-4">
            <span className="bg-brand-gold text-brand-plum text-[10px] font-bold px-4 py-2 rounded-full w-fit uppercase tracking-widest">Masterclass</span>
            <h3 className="text-white text-4xl font-bold uppercase tracking-tighter leading-none">Creative <br />Training</h3>
            <p className="text-white/80 font-medium max-w-xs">Learn the art of Ankara craft and bridal accessories from the best.</p>
            <Link to="/training" className="btn-gold w-fit py-4 px-8 text-sm uppercase tracking-widest mt-4">
              Enroll Now
            </Link>
          </div>
        </motion.div>

        {/* Events Banner */}
        <motion.div 
          whileHover={{ y: -10 }}
          className="relative h-[500px] rounded-[3rem] overflow-hidden group shadow-2xl"
        >
          <img 
            src="https://i.ibb.co/46nwpWJ/Floperia.jpg" 
            alt="Events" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-brand-charcoal/40 group-hover:bg-brand-charcoal/60 transition-colors duration-500" />
          <div className="absolute inset-0 p-10 flex flex-col justify-end space-y-4">
            <span className="bg-brand-blush text-brand-plum text-[10px] font-bold px-4 py-2 rounded-full w-fit uppercase tracking-widest">Planning</span>
            <h3 className="text-white text-4xl font-bold uppercase tracking-tighter leading-none">Event <br />Planning</h3>
            <p className="text-white/80 font-medium max-w-xs">Let us turn your dream celebration into a stunning reality.</p>
            <Link to="/events" className="bg-white text-brand-plum py-4 px-8 rounded-full font-bold text-sm uppercase tracking-widest w-fit mt-4 hover:bg-brand-gold transition-colors">
              Book Consultation
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Brand Story Teaser */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-brand-plum rounded-[3rem] overflow-hidden relative p-10 md:p-20 text-white shadow-2xl">
          <div className="max-w-full md:max-w-[60%] space-y-8 relative z-10">
            <p className="font-accent italic text-3xl md:text-5xl leading-tight text-brand-gold">
              "Floperia Classic World is a world of unlimited creativity."
            </p>
            <div className="space-y-2">
              <p className="font-bold text-xl md:text-2xl tracking-tight uppercase">Iniobong Donatus</p>
              <p className="text-white/60 text-base md:text-lg font-medium">Creative Director & PhD Candidate</p>
            </div>
            <Link to="/about" className="btn-gold py-5 px-12 text-base inline-block hover:scale-105 transition-transform uppercase tracking-widest">
              Our Story
            </Link>
          </div>
          <img
            src="https://picsum.photos/seed/founder/800/1200"
            alt="Iniobong Donatus"
            className="absolute right-0 top-0 bottom-0 w-full md:w-[40%] h-full object-cover opacity-20 md:opacity-80 mix-blend-luminosity"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

    </div>
  );
}
