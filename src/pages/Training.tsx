import React from 'react';
import { Video, MapPin, BookOpen, Star, Award, Users, ArrowRight, CheckCircle2, PlayCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { createNotification } from '../services/notificationService';

export default function Training() {
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [regForm, setRegForm] = React.useState({ name: '', email: '', phone: '', course: '' });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'success' | 'error'>('idle');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    const result = await createNotification(
      'training',
      `New Registration: ${regForm.name}`,
      `${regForm.name} registered for ${regForm.course}. Contact: ${regForm.phone}, ${regForm.email}`,
      regForm
    );
    
    if (result.success) {
      setSubmitStatus('success');
      setRegForm({ name: '', email: '', phone: '', course: '' });
      setTimeout(() => {
        setIsRegistering(false);
        setSubmitStatus('idle');
      }, 3000);
    } else {
      setSubmitStatus('error');
    }
    setIsSubmitting(false);
  };

  const courses = [
    { 
      title: "Headpiece Making", 
      duration: "2 days", 
      mode: "Both", 
      image: "https://i.ibb.co/NdYq2f1J/Whats-App-Image-2026-04-08-at-1-18-50-AM-1.jpg",
      price: "₦15,000",
      students: 450,
      videoUrl: "https://vimeo.com/1183705396"
    },
    { 
      title: "Ankara Bag Craft", 
      duration: "3 days", 
      mode: "Both", 
      image: "https://i.ibb.co/Pvdm8JYC/Ankara-tote-bag-and-hat26.jpg",
      price: "₦20,000",
      students: 320,
      videoUrl: "https://vimeo.com/1183705681"
    },
    { 
      title: "Bouquet Design", 
      duration: "1 day", 
      mode: "Online", 
      image: "https://i.ibb.co/FbV6J8jn/Whats-App-Image-2026-04-08-at-1-18-49-AM-1.jpg",
      price: "₦10,000",
      students: 280,
      videoUrl: "https://vimeo.com/1183705849"
    },
    { 
      title: "Fascinator Masterclass", 
      duration: "2 days", 
      mode: "Both", 
      image: "https://i.ibb.co/MywjmvQY/Hat-fascinator30.jpg",
      price: "₦18,000",
      students: 190,
      videoUrl: "https://vimeo.com/1183706338"
    },
  ];

  const benefits = [
    { icon: <Video size={24} />, title: "Live Sessions", desc: "Interactive Zoom classes with real-time feedback." },
    { icon: <Award size={24} />, title: "Certification", desc: "Get a recognized certificate upon completion." },
    { icon: <Users size={24} />, title: "Community", desc: "Access to our private alumni support group." },
    { icon: <BookOpen size={24} />, title: "Resources", desc: "Lifetime access to recorded videos and PDFs." },
  ];

  const [selectedVideo, setSelectedVideo] = React.useState<string | null>(null);

  return (
    <div className="pb-20 font-sans">
      {/* Registration Modal */}
      <AnimatePresence>
        {isRegistering && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-brand-plum/90 backdrop-blur-md"
            onClick={() => setIsRegistering(false)}
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-brand-plum p-8 text-white relative">
                <button onClick={() => setIsRegistering(false)} className="absolute top-6 right-6 text-white/40 hover:text-white">✕</button>
                <h3 className="text-2xl font-bold uppercase tracking-tight">Enroll Now</h3>
                <p className="text-brand-blush text-sm">Join the Floperia Academy</p>
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
                      <h4 className="text-2xl font-bold text-brand-plum uppercase">Registration Sent!</h4>
                      <p className="text-brand-gray">We have received your application and will contact you shortly.</p>
                    </motion.div>
                  ) : (
                    <motion.form 
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onSubmit={handleRegister} 
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
                          value={regForm.name}
                          onChange={e => setRegForm({...regForm, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-brand-plum/40 uppercase tracking-widest">Email Address</label>
                        <input 
                          required
                          type="email"
                          className="w-full p-4 bg-brand-off-white rounded-2xl border-none focus:ring-2 focus:ring-brand-plum"
                          value={regForm.email}
                          onChange={e => setRegForm({...regForm, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-brand-plum/40 uppercase tracking-widest">Phone Number</label>
                        <input 
                          required
                          className="w-full p-4 bg-brand-off-white rounded-2xl border-none focus:ring-2 focus:ring-brand-plum"
                          value={regForm.phone}
                          onChange={e => setRegForm({...regForm, phone: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-brand-plum/40 uppercase tracking-widest">Select Course</label>
                        <select 
                          required
                          className="w-full p-4 bg-brand-off-white rounded-2xl border-none focus:ring-2 focus:ring-brand-plum"
                          value={regForm.course}
                          onChange={e => setRegForm({...regForm, course: e.target.value})}
                        >
                          <option value="">Choose a course...</option>
                          {courses.map(c => <option key={c.title} value={c.title}>{c.title}</option>)}
                        </select>
                      </div>
                      <button 
                        disabled={isSubmitting}
                        className="w-full btn-gold py-5 mt-4 uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? <RefreshCw className="animate-spin" size={18} /> : 'Submit Registration'}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-plum/95 backdrop-blur-xl"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
              >
                ✕
              </button>
              <iframe
                src={`https://player.vimeo.com/video/${selectedVideo.split('/').pop()}?autoplay=1`}
                className="w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <img 
          src="https://i.ibb.co/chgkTyw0/Whats-App-Image-2026-04-08-at-1-18-48-AM.jpg" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Training Hero"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-brand-plum/80 backdrop-blur-[2px]" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 text-white pt-32 pb-40 space-y-10">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-brand-gold text-brand-plum text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest"
          >
            Floperia Academy
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-semibold uppercase tracking-tight leading-none mt-6"
          >
            Master the Art <br /> of <span className="text-brand-gold">Creativity</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-lg md:text-xl max-w-2xl font-medium"
          >
            Join 1,000+ people trained by Iniobong Donatus in Ankara craft and bridal accessories. Turn your passion into a profitable business.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <button 
              onClick={() => setIsRegistering(true)}
              className="btn-gold px-10 py-5 text-lg uppercase tracking-widest"
            >
              Enroll Now
            </button>
            <button className="flex items-center gap-3 font-bold uppercase tracking-widest text-sm hover:text-brand-gold transition-colors">
              <PlayCircle size={32} /> Watch Preview
            </button>
          </motion.div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 -mt-24 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {benefits.map((benefit, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-brand-gray/5 space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-plum/5 flex items-center justify-center text-brand-plum">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-brand-plum uppercase tracking-tight">{benefit.title}</h3>
              <p className="text-brand-gray text-sm font-medium leading-relaxed">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Training Modes */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-plum uppercase tracking-tighter leading-none">Choose Your <br />Learning Path</h2>
            <p className="text-brand-gray text-lg font-medium">We offer flexible training options to suit your schedule and location.</p>
          </div>
          
          <div className="space-y-6">
            <div className="flex gap-6 p-8 rounded-[2.5rem] bg-brand-blush/10 border border-brand-blush/20 group hover:bg-brand-blush/20 transition-colors">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-brand-plum flex items-center justify-center text-white">
                <Video size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-brand-plum uppercase tracking-tight">Online Training</h3>
                <p className="text-brand-gray font-medium">Learn from anywhere via live Zoom sessions and high-definition recorded classes.</p>
              </div>
            </div>
            
            <div className="flex gap-6 p-8 rounded-[2.5rem] bg-brand-gold/10 border border-brand-gold/20 group hover:bg-brand-gold/20 transition-colors">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-brand-gold flex items-center justify-center text-brand-plum">
                <MapPin size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-brand-plum uppercase tracking-tight">Physical Studio</h3>
                <p className="text-brand-gray font-medium">Hands-on intensive training at our Port Harcourt studio with all materials provided.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
            <img 
              src="https://i.ibb.co/mrv1qYCH/Whats-App-Image-2026-04-08-at-1-18-48-AM-1.jpg" 
              className="w-full h-full object-cover"
              alt="Training Session"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2.5rem] shadow-2xl space-y-2 hidden md:block">
            <div className="flex items-center gap-2 text-brand-gold">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <p className="font-bold text-brand-plum text-2xl">1,000+</p>
            <p className="text-brand-gray text-xs font-bold uppercase tracking-widest">Certified Students</p>
          </div>
        </div>
      </section>

      {/* Course Catalog */}
      <section className="bg-brand-plum py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter">Watch Our Videos</h2>
            <p className="text-brand-blush text-lg font-medium">Expert-led courses designed to make you a pro.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {courses.map((course, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl group"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <button 
                      onClick={() => setSelectedVideo(course.videoUrl)}
                      className="w-16 h-16 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all scale-90 group-hover:scale-100"
                    >
                      <PlayCircle size={40} />
                    </button>
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-brand-plum text-xl uppercase tracking-tight leading-tight">{course.title}</h4>
                    <div className="flex justify-between items-center text-[10px] font-bold text-brand-gray uppercase tracking-widest">
                      <span>{course.duration}</span>
                      <span className="text-brand-gold">{course.mode}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-brand-gray text-xs font-bold">
                    <Users size={14} /> {course.students} Students enrolled
                  </div>
                  <button 
                    onClick={() => setIsRegistering(true)}
                    className="w-full btn-primary py-4 text-[10px] uppercase tracking-widest"
                  >
                    Register Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
