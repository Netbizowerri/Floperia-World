import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Facebook, MessageCircle, Award, Users, Heart, Globe, ArrowLeft } from 'lucide-react';

export default function About() {
  const stats = [
    { icon: Users, value: "1,000+", label: "People Trained" },
    { icon: Heart, value: "100+", label: "Happy Clients" },
    { icon: Award, value: "PH Fashion Week", label: "2023 Runway" },
    { icon: Globe, value: "Nationwide", label: "Delivery" }
  ];

  return (
    <div className="pb-12 space-y-12">
      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden">
        <button 
          onClick={() => window.history.back()}
          className="absolute top-4 left-4 z-20 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm text-brand-plum"
        >
          <ArrowLeft size={24} />
        </button>
        <img
          src="https://i.ibb.co/46nwpWJ/Floperia.jpg"
          alt="About Us Mobile"
          className="w-full h-full object-cover object-top md:hidden"
          referrerPolicy="no-referrer"
        />
        <img
          src="https://i.ibb.co/2Y6Mz6Yg/Untitled-design-1.jpg"
          alt="About Us Desktop"
          className="hidden md:block w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-plum via-brand-plum/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-center space-y-2">
          <h1 className="text-white text-4xl font-bold drop-shadow-lg">Iniobong Donatus</h1>
          <p className="font-accent italic text-brand-gold text-xl drop-shadow-md">A World of Unlimited Creativity</p>
        </div>
      </section>

      {/* Story */}
      <section className="px-6 space-y-6">
        <h2 className="text-3xl font-bold text-brand-plum">The Floperia Story</h2>
        <div className="space-y-4 text-brand-charcoal/80 leading-relaxed">
          <p>
            Born from a childhood love of transforming everyday materials into beautiful craft — selling handmade bags, shoes, fascinators, and fans to classmates and teachers in high school.
          </p>
          <p>
            In 2011, the first brand Abiayai Design was founded. In 2017, guided by customer feedback on pronunciation and brand clarity, it was reborn as <span className="font-bold text-brand-plum">Floperia Classic World</span>.
          </p>
          <blockquote className="border-l-4 border-brand-gold pl-4 py-2 font-accent italic text-2xl text-brand-plum">
            "I believe Floperia Classic World is a world of unlimited creativity."
          </blockquote>
          <p>
            Today, Floperia stands at the intersection of Ankara luxury and bridal excellence — showcased at Port Harcourt Fashion Week 2023 and trusted by clients within and beyond Nigeria.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand-plum py-12 px-6">
        <div className="grid grid-cols-2 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center space-y-2">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto text-brand-gold">
                <stat.icon size={24} />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-white/60 uppercase tracking-widest font-bold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Socials */}
      <section className="px-6 text-center space-y-6">
        <h2 className="text-2xl font-bold text-brand-plum">Follow Our Journey</h2>
        <div className="flex justify-center gap-6">
          <a href="https://instagram.com/floperia_classic_world" className="w-14 h-14 bg-white rounded-full shadow-card-rest flex items-center justify-center text-brand-plum">
            <Instagram size={28} />
          </a>
          <a href="https://facebook.com/floperia" className="w-14 h-14 bg-white rounded-full shadow-card-rest flex items-center justify-center text-brand-plum">
            <Facebook size={28} />
          </a>
          <a href="https://wa.me/2348067689955" className="w-14 h-14 bg-white rounded-full shadow-card-rest flex items-center justify-center text-[#25D366]">
            <MessageCircle size={28} />
          </a>
        </div>
      </section>

      {/* Contact Info */}
      <section className="px-6 py-8 bg-brand-off-white border-y border-brand-gray/10 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-brand-plum/5 rounded-full flex items-center justify-center text-brand-plum">
            <Globe size={20} />
          </div>
          <p className="text-sm font-bold text-brand-plum">1 Victory Estate, by Kilimanjaro Elelenwo, Port Harcourt</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-brand-plum/5 rounded-full flex items-center justify-center text-brand-plum">
            <MessageCircle size={20} />
          </div>
          <p className="text-sm font-bold text-brand-plum">08067689955</p>
        </div>
      </section>
    </div>
  );
}
