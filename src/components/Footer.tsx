import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, MessageCircle, Mail, MapPin, Phone, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import { createNotification } from '../services/notificationService';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>('idle');

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setStatus('idle');

    const result = await createNotification(
      'newsletter',
      'New Newsletter Subscription',
      `New subscriber: ${email}`,
      { email }
    );

    if (result.success) {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    } else {
      setStatus('error');
    }
    setIsSubmitting(false);
  };

  return (
    <footer className="bg-brand-plum text-white pt-16 pb-32 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand Section */}
        <div className="space-y-6">
          <Link to="/" className="inline-block">
            <span className="font-display text-3xl font-bold tracking-tighter text-brand-gold uppercase">FLOPERIA</span>
          </Link>
          <p className="text-white/70 text-sm leading-relaxed max-w-xs">
            A world of unlimited creativity. Premium Nigerian bridal accessories and Ankara craft designed for the modern woman.
          </p>
          <div className="flex gap-4">
            <a href="https://instagram.com/floperia_classic_world" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold hover:text-brand-plum transition-all">
              <Instagram size={20} />
            </a>
            <a href="https://facebook.com/floperia" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold hover:text-brand-plum transition-all">
              <Facebook size={20} />
            </a>
            <a href="https://wa.me/2348067689955" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold hover:text-brand-plum transition-all">
              <MessageCircle size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-brand-gold uppercase tracking-widest">Quick Links</h3>
        <ul className="space-y-4">
          <li><Link to="/shop" className="text-white/70 hover:text-brand-gold transition-colors flex items-center gap-2 group"><ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" /> Shop All</Link></li>
          <li><Link to="/gallery" className="text-white/70 hover:text-brand-gold transition-colors flex items-center gap-2 group"><ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" /> Gallery</Link></li>
          <li><Link to="/videogallery" className="text-white/70 hover:text-brand-gold transition-colors flex items-center gap-2 group"><ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" /> Video Gallery</Link></li>
          <li><Link to="/about" className="text-white/70 hover:text-brand-gold transition-colors flex items-center gap-2 group"><ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" /> Our Story</Link></li>
          <li><Link to="/training" className="text-white/70 hover:text-brand-gold transition-colors flex items-center gap-2 group"><ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" /> Training</Link></li>
          <li><Link to="/events" className="text-white/70 hover:text-brand-gold transition-colors flex items-center gap-2 group"><ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" /> Events</Link></li>
          <li><Link to="/contact" className="text-white/70 hover:text-brand-gold transition-colors flex items-center gap-2 group"><ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" /> Contact Us</Link></li>
        </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-brand-gold uppercase tracking-widest">Contact Us</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-white/70">
              <MapPin size={18} className="text-brand-gold shrink-0 mt-1" />
              <span className="text-sm">1 Victory Estate, by Kilimanjaro Elelenwo, Port Harcourt, Rivers State</span>
            </li>
            <li className="flex items-center gap-3 text-white/70">
              <Phone size={18} className="text-brand-gold shrink-0" />
              <span className="text-sm">08067689955</span>
            </li>
            <li className="flex items-center gap-3 text-white/70">
              <Mail size={18} className="text-brand-gold shrink-0" />
              <span className="text-sm">service.floperia@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* Newsletter/CTA */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-brand-gold uppercase tracking-widest">Stay Inspired</h3>
          <p className="text-white/70 text-sm">Join our community for the latest bridal trends and craft updates.</p>
          <form onSubmit={handleNewsletter} className="relative">
            <input 
              type="email" 
              required
              placeholder="Your email address" 
              className="w-full bg-white/10 border border-white/20 rounded-full py-3 px-5 text-sm focus:outline-none focus:border-brand-gold transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button 
              disabled={isSubmitting}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-gold text-brand-plum font-bold text-[10px] uppercase tracking-widest px-4 py-2 rounded-full flex items-center gap-2"
            >
              {isSubmitting ? <RefreshCw size={12} className="animate-spin" /> : status === 'success' ? <CheckCircle2 size={12} /> : 'Join'}
            </button>
            {status === 'error' && <p className="text-[10px] text-red-400 mt-2 ml-4">Failed to join. Try again.</p>}
          </form>
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-white/10 text-center space-y-4">
        <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold">
          &copy; {currentYear} Floperia Classic World. All Rights Reserved.
        </p>
        <p className="text-white/20 text-[8px] uppercase tracking-widest">
          Designed for Excellence in Nigeria
        </p>
      </div>
    </footer>
  );
}
