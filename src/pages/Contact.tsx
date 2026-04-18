import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle2, RefreshCw } from 'lucide-react';
import { createNotification } from '../services/notificationService';

export default function Contact() {
  const [form, setForm] = React.useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const result = await createNotification(
      'contact',
      `Contact Form: ${form.subject}`,
      `Message from ${form.name} (${form.email}): ${form.message.substring(0, 100)}${form.message.length > 100 ? '...' : ''}`,
      form
    );

    if (result.success) {
      setSubmitStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } else {
      setSubmitStatus('error');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-brand-off-white pb-20 font-sans">
      {/* Hero */}
      <section className="bg-brand-plum py-24 text-white text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">Get in <span className="text-brand-gold">Touch</span></h1>
          <p className="text-brand-blush text-lg md:text-xl font-medium">Have a question or want to discuss a custom order? We're here to help.</p>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl space-y-8">
              <h3 className="text-2xl font-bold text-brand-plum uppercase tracking-tight">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-plum/5 rounded-2xl flex items-center justify-center text-brand-plum shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-brand-plum uppercase text-xs tracking-widest mb-1">Our Studio</p>
                    <p className="text-brand-gray text-sm font-medium">1 Victory Estate, by Kilimanjaro Elelenwo, Port Harcourt, Rivers State</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-plum/5 rounded-2xl flex items-center justify-center text-brand-plum shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-brand-plum uppercase text-xs tracking-widest mb-1">Phone</p>
                    <p className="text-brand-gray text-sm font-medium">08067689955</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-plum/5 rounded-2xl flex items-center justify-center text-brand-plum shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-brand-plum uppercase text-xs tracking-widest mb-1">Email</p>
                    <p className="text-brand-gray text-sm font-medium">service.floperia@gmail.com</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-brand-gray/10">
                <p className="text-xs font-bold text-brand-plum/40 uppercase tracking-[0.3em] mb-4">Follow Us</p>
                <div className="flex gap-4">
                  {/* Social icons could go here */}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl">
              <AnimatePresence mode="wait">
                {submitStatus === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-20 text-center space-y-6"
                  >
                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 size={48} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-3xl font-bold text-brand-plum uppercase tracking-tight">Message Sent!</h3>
                      <p className="text-brand-gray text-lg font-medium">Thank you for reaching out. We'll get back to you as soon as possible.</p>
                    </div>
                    <button 
                      onClick={() => setSubmitStatus('idle')}
                      className="btn-gold px-10 py-4 uppercase tracking-widest text-sm"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-brand-plum uppercase tracking-widest ml-2">Your Name</label>
                        <input
                          required
                          className="w-full p-5 bg-brand-off-white rounded-2xl border-none focus:ring-2 focus:ring-brand-plum transition-all"
                          placeholder="John Doe"
                          value={form.name}
                          onChange={e => setForm({...form, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-brand-plum uppercase tracking-widest ml-2">Email Address</label>
                        <input
                          required
                          type="email"
                          className="w-full p-5 bg-brand-off-white rounded-2xl border-none focus:ring-2 focus:ring-brand-plum transition-all"
                          placeholder="john@example.com"
                          value={form.email}
                          onChange={e => setForm({...form, email: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-brand-plum uppercase tracking-widest ml-2">Subject</label>
                      <input
                        required
                        className="w-full p-5 bg-brand-off-white rounded-2xl border-none focus:ring-2 focus:ring-brand-plum transition-all"
                        placeholder="How can we help?"
                        value={form.subject}
                        onChange={e => setForm({...form, subject: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-brand-plum uppercase tracking-widest ml-2">Message</label>
                      <textarea
                        required
                        rows={6}
                        className="w-full p-5 bg-brand-off-white rounded-2xl border-none focus:ring-2 focus:ring-brand-plum transition-all resize-none"
                        placeholder="Tell us more about your request..."
                        value={form.message}
                        onChange={e => setForm({...form, message: e.target.value})}
                      />
                    </div>

                    {submitStatus === 'error' && (
                      <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold uppercase tracking-widest text-center">
                        Failed to send message. Please try again.
                      </div>
                    )}

                    <button
                      disabled={isSubmitting}
                      className="w-full btn-gold py-6 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-[0.2em] font-bold shadow-xl hover:scale-[1.02] transition-transform"
                    >
                      {isSubmitting ? <RefreshCw className="animate-spin" size={20} /> : <><Send size={20} /> Send Message</>}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
