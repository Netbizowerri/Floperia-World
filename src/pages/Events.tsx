import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Heart, Star, Camera, Music, Utensils, Sparkles, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { createNotification } from '../services/notificationService';

export default function Events() {
  const [isBooking, setIsBooking] = React.useState(false);
  const [bookForm, setBookForm] = React.useState({ name: '', email: '', phone: '', date: '', type: '' });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'success' | 'error'>('idle');

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    const result = await createNotification(
      'event',
      `Event Consultation: ${bookForm.name}`,
      `${bookForm.name} requested a ${bookForm.type} consultation for ${bookForm.date}. Contact: ${bookForm.phone}`,
      bookForm
    );
    
    if (result.success) {
      setSubmitStatus('success');
      setBookForm({ name: '', email: '', phone: '', date: '', type: '' });
      setTimeout(() => {
        setIsBooking(false);
        setSubmitStatus('idle');
      }, 3000);
    } else {
      setSubmitStatus('error');
    }
    setIsSubmitting(false);
  };

  const services = [
    { 
      icon: <Sparkles size={32} />, 
      title: "Full Planning", 
      desc: "Comprehensive management from concept to execution. We handle every detail so you can enjoy your day.",
      image: "https://i.ibb.co/46nwpWJ/Floperia.jpg"
    },
    { 
      icon: <Heart size={32} />, 
      title: "Bridal Styling", 
      desc: "Expert coordination of your bridal look, including accessories, gele styling, and overall aesthetic.",
      image: "https://i.ibb.co/NdYq2f1J/Whats-App-Image-2026-04-08-at-1-18-50-AM-1.jpg"
    },
    { 
      icon: <Calendar size={32} />, 
      title: "Day-of Coordination", 
      desc: "On-site management to ensure your event runs smoothly according to plan.",
      image: "https://i.ibb.co/chgkTyw0/Whats-App-Image-2026-04-08-at-1-18-48-AM.jpg"
    },
  ];

  const gallery = [
    "https://i.ibb.co/4wTfVpGZ/Whats-App-Image-2026-04-08-at-1-18-50-AM.jpg",
    "https://i.ibb.co/FbV6J8jn/Whats-App-Image-2026-04-08-at-1-18-49-AM-1.jpg",
    "https://i.ibb.co/99CQ1bnS/Whats-App-Image-2026-04-08-at-1-18-49-AM.jpg",
    "https://i.ibb.co/mrv1qYCH/Whats-App-Image-2026-04-08-at-1-18-48-AM-1.jpg",
    "https://i.ibb.co/sk7Tx0P/Whats-App-Image-2026-04-08-at-1-18-47-AM.jpg",
    "https://i.ibb.co/PZchV7d4/Whats-App-Image-2026-04-08-at-1-09-03-AM.jpg",
  ];

  return (
    <div className="pb-20 font-sans">
      {/* Booking Modal */}
      <AnimatePresence>
        {isBooking && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-brand-plum/90 backdrop-blur-md"
            onClick={() => setIsBooking(false)}
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-brand-plum p-8 text-white relative">
                <button onClick={() => setIsBooking(false)} className="absolute top-6 right-6 text-white/40 hover:text-white">✕</button>
                <h3 className="text-2xl font-bold uppercase tracking-tight">Book Consultation</h3>
                <p className="text-brand-blush text-sm">Let's plan your dream event</p>
              </div>
              
              <div className="p-8">
                <AnimatePresence mode="wait">
                  {submitStatus === 'success' ? (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-12 text-center space-y-4"
                    >
                      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 size={40} />
                      </div>
                      <h4 className="text-2xl font-bold text-brand-plum uppercase">Request Sent!</h4>
                      <p className="text-brand-gray">We have received your request and will contact you shortly.</p>
                    </motion.div>
                  ) : (
                    <motion.form 
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onSubmit={handleBooking} 
                      className="space-y-4"
                    >
                      {submitStatus === 'error' && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold uppercase tracking-widest text-center">
                          Failed to send. Please try again.
                        </div>
                      )}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-brand-plum/40 uppercase tracking-widest">Full Name</label>
                        <input 
                          required
                          className="w-full p-4 bg-brand-off-white rounded-2xl border-none focus:ring-2 focus:ring-brand-plum"
                          value={bookForm.name}
                          onChange={e => setBookForm({...bookForm, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-brand-plum/40 uppercase tracking-widest">Phone Number</label>
                        <input 
                          required
                          className="w-full p-4 bg-brand-off-white rounded-2xl border-none focus:ring-2 focus:ring-brand-plum"
                          value={bookForm.phone}
                          onChange={e => setBookForm({...bookForm, phone: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-brand-plum/40 uppercase tracking-widest">Event Date</label>
                          <input 
                            required
                            type="date"
                            className="w-full p-4 bg-brand-off-white rounded-2xl border-none focus:ring-2 focus:ring-brand-plum"
                            value={bookForm.date}
                            onChange={e => setBookForm({...bookForm, date: e.target.value})}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-brand-plum/40 uppercase tracking-widest">Event Type</label>
                          <select 
                            required
                            className="w-full p-4 bg-brand-off-white rounded-2xl border-none focus:ring-2 focus:ring-brand-plum"
                            value={bookForm.type}
                            onChange={e => setBookForm({...bookForm, type: e.target.value})}
                          >
                            <option value="">Choose...</option>
                            <option value="Wedding">Wedding</option>
                            <option value="Birthday">Birthday</option>
                            <option value="Corporate">Corporate</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                      <button 
                        disabled={isSubmitting}
                        className="w-full btn-gold py-5 mt-4 uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? <RefreshCw className="animate-spin" size={18} /> : 'Request Call'}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center text-center overflow-hidden">
        <img 
          src="https://i.ibb.co/2Y6Mz6Yg/Untitled-design-1.jpg" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Events Hero"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-brand-charcoal/60 backdrop-blur-[2px]" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-white space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 bg-brand-gold/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto border border-brand-gold/30"
          >
            <Sparkles className="text-brand-gold" size={40} />
          </motion.div>
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-semibold uppercase tracking-tight leading-none"
            >
              Unforgettable <br /> <span className="text-brand-gold">Moments</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/80 text-lg md:text-2xl font-medium max-w-2xl mx-auto"
            >
              We don't just plan events; we create experiences that linger in the heart forever. From intimate weddings to grand celebrations.
            </motion.p>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button 
              onClick={() => setIsBooking(true)}
              className="bg-white text-brand-plum px-12 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-brand-gold transition-colors shadow-2xl"
            >
              Book a Consultation
            </button>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-24 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold text-brand-plum uppercase tracking-tighter">Our Services</h2>
          <div className="w-24 h-1.5 bg-brand-gold mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {services.map((service, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="group bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-brand-gray/5"
            >
              <div className="aspect-[4/5] overflow-hidden relative">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-brand-plum/20 group-hover:bg-brand-plum/40 transition-colors" />
                <div className="absolute top-8 left-8 w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-brand-plum shadow-xl">
                  {service.icon}
                </div>
              </div>
              <div className="p-10 space-y-4">
                <h3 className="text-2xl font-bold text-brand-plum uppercase tracking-tight">{service.title}</h3>
                <p className="text-brand-gray font-medium leading-relaxed">{service.desc}</p>
                <button 
                  onClick={() => setIsBooking(true)}
                  className="flex items-center gap-2 text-brand-gold font-bold uppercase tracking-widest text-xs pt-4 group-hover:gap-4 transition-all"
                >
                  Learn More <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-brand-plum py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-none">The Floperia <br /> <span className="text-brand-gold">Standard</span></h2>
              <p className="text-brand-blush text-lg font-medium">Excellence is not an act, but a habit. We bring PhD-level precision to every celebration.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { title: "Attention to Detail", desc: "Every bead, every flower, every second is accounted for." },
                { title: "Creative Vision", desc: "Unique concepts tailored to your personal story." },
                { title: "Expert Network", desc: "Access to the finest vendors in the industry." },
                { title: "Stress-Free", desc: "You celebrate, we handle the complexities." },
              ].map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-brand-gold rounded-full" />
                    <h4 className="font-bold uppercase tracking-tight text-brand-gold">{item.title}</h4>
                  </div>
                  <p className="text-white/60 text-sm font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-12">
              <img src={gallery[0]} className="rounded-[2rem] shadow-2xl" alt="Gallery 1" referrerPolicy="no-referrer" />
              <img src={gallery[1]} className="rounded-[2rem] shadow-2xl" alt="Gallery 2" referrerPolicy="no-referrer" />
            </div>
            <div className="space-y-4">
              <img src={gallery[2]} className="rounded-[2rem] shadow-2xl" alt="Gallery 3" referrerPolicy="no-referrer" />
              <img src={gallery[3]} className="rounded-[2rem] shadow-2xl" alt="Gallery 4" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-24">
        <div className="bg-brand-gold rounded-[4rem] p-12 md:p-24 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-plum/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
          
          <div className="relative z-10 space-y-4">
            <h2 className="text-4xl md:text-7xl font-bold text-brand-plum uppercase tracking-tighter leading-none">Ready to Start <br /> Planning?</h2>
            <p className="text-brand-plum/70 text-lg md:text-xl font-bold max-w-2xl mx-auto">
              Schedule a free 15-minute discovery call to discuss your upcoming event.
            </p>
          </div>
          
          <div className="relative z-10 pt-4">
            <button 
              onClick={() => setIsBooking(true)}
              className="bg-brand-plum text-white px-12 py-6 rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl"
            >
              Book Your Free Call
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
