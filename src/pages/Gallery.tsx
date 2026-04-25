import React from 'react';
import { motion } from 'motion/react';

export default function Gallery() {
  const images = [
    'https://i.ibb.co/xb4ddhj/Whats-App-Image-2026-04-19-at-10-47-35-AM-2.jpg',
    'https://i.ibb.co/svXfnqnS/Whats-App-Image-2026-04-19-at-10-47-35-AM-3.jpg',
    'https://i.ibb.co/h1X2y3m4/Whats-App-Image-2026-04-19-at-10-47-36-AM-1.jpg',
    'https://i.ibb.co/Lz2ZBqKv/Whats-App-Image-2026-04-19-at-10-47-36-AM-2.jpg',
    'https://i.ibb.co/G40QpW8Q/Whats-App-Image-2026-04-19-at-10-47-36-AM-3.jpg',
    'https://i.ibb.co/mV1mnnzG/Whats-App-Image-2026-04-19-at-10-47-36-AM-4.jpg',
    'https://i.ibb.co/NdrMdzDw/Whats-App-Image-2026-04-19-at-10-47-36-AM.jpg',
    'https://i.ibb.co/r2HQGzt3/Whats-App-Image-2026-04-19-at-10-47-37-AM-1.jpg',
    'https://i.ibb.co/VWxg5zkr/Whats-App-Image-2026-04-19-at-10-47-37-AM-2.jpg',
    'https://i.ibb.co/C3pJq2Nw/Whats-App-Image-2026-04-19-at-10-47-37-AM-3.jpg',
    'https://i.ibb.co/3LT9VTd/Whats-App-Image-2026-04-19-at-10-47-37-AM.jpg',
    'https://i.ibb.co/RT7w02V7/Whats-App-Image-2026-04-19-at-10-47-38-AM-1.jpg',
    'https://i.ibb.co/nM7FP98w/Whats-App-Image-2026-04-19-at-10-47-38-AM-2.jpg',
    'https://i.ibb.co/dsVyLGJN/Whats-App-Image-2026-04-19-at-10-47-38-AM-3.jpg',
    'https://i.ibb.co/Fq7VpyTB/Whats-App-Image-2026-04-19-at-10-47-38-AM-4.jpg',
    'https://i.ibb.co/0VdrkdMd/Whats-App-Image-2026-04-19-at-10-47-38-AM.jpg',
    'https://i.ibb.co/23CcDnb7/Whats-App-Image-2026-04-19-at-10-47-39-AM-1.jpg',
    'https://i.ibb.co/ZRsMRq7k/Whats-App-Image-2026-04-19-at-10-47-39-AM-2.jpg',
    'https://i.ibb.co/wNZcXwh9/Whats-App-Image-2026-04-19-at-10-47-39-AM-3.jpg',
    'https://i.ibb.co/v4W2bqTh/Whats-App-Image-2026-04-19-at-10-47-39-AM.jpg',
    'https://i.ibb.co/tPC77t1S/Whats-App-Image-2026-04-19-at-10-47-40-AM-1.jpg',
    'https://i.ibb.co/FLzJs1Br/Whats-App-Image-2026-04-19-at-10-47-40-AM.jpg',
    'https://i.ibb.co/spSM8xV4/Whats-App-Image-2026-04-19-at-10-47-29-AM.jpg',
    'https://i.ibb.co/dsY492sN/Whats-App-Image-2026-04-19-at-10-47-30-AM.jpg',
    'https://i.ibb.co/j95QBVRm/Whats-App-Image-2026-04-19-at-10-47-31-AM-1.jpg',
    'https://i.ibb.co/9HV4115z/Whats-App-Image-2026-04-19-at-10-47-31-AM-2.jpg',
    'https://i.ibb.co/jkgg0Kkb/Whats-App-Image-2026-04-19-at-10-47-31-AM.jpg',
    'https://i.ibb.co/v4XCqmKQ/Whats-App-Image-2026-04-19-at-10-47-32-AM-1.jpg',
    'https://i.ibb.co/wZMVY9Mp/Whats-App-Image-2026-04-19-at-10-47-32-AM.jpg',
    'https://i.ibb.co/FLbdcSwM/Whats-App-Image-2026-04-19-at-10-47-33-AM.jpg',
    'https://i.ibb.co/zhBP8FDK/Whats-App-Image-2026-04-19-at-10-47-35-AM-1.jpg',
    'https://i.ibb.co/9BdjYSb/Whats-App-Image-2026-04-19-at-10-47-35-AM.jpg'
  ];

  return (
    <div className="space-y-16 pb-16 font-sans">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
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
            FLOPERIA <br />
            <span className="text-brand-gold">GALLERY</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-brand-off-white/90 text-xl md:text-2xl max-w-xl font-medium"
          >
            A curated collection of our most exquisite bridal creations and Ankara craft masterpieces.
          </motion.p>
        </div>
      </section>

      {/* Gallery Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h2 className="text-3xl md:text-5xl font-bold text-brand-plum tracking-tight uppercase">
          Our Creative Journey
        </h2>
        <p className="text-brand-gray font-medium max-w-2xl mx-auto">
          Explore the artistry, dedication, and passion that goes into every piece we create.
        </p>
      </motion.div>

      {/* Image Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid gap-6 md:gap-8">
          {/* Main featured image (large) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="row-span-2 col-span-2 md:row-span-1 md:col-span-3 rounded-[2.5rem] overflow-hidden shadow-2xl group"
          >
            <img
              src={images[0]}
              alt="Featured Bridal Creation"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
              <h3 className="text-white text-2xl font-bold">Masterpiece Collection</h3>
              <p className="text-white/80">Where tradition meets contemporary elegance</p>
            </div>
          </motion.div>

          {/* Rest of the images in a responsive grid */}
          {images.slice(1).map((img, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="rounded-[2rem] overflow-hidden shadow-2xl group"
            >
              <img
                src={img}
                alt={`Gallery Item ${index + 2}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <h3 className="text-white text-xl font-bold">Floperia Classic</h3>
                  <p className="text-white/80">Bridal & Ankara Collection</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Responsive grid alternatives for different screen sizes */}
        <div className="mt-12 grid gap-4 md:gap-6 hidden md:block">
          {images.map((img, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="rounded-[2rem] overflow-hidden shadow-2xl group"
            >
              <img
                src={img}
                alt={`Gallery Item ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <h3 className="text-white text-lg font-bold">Floperia Classic</h3>
                  <p className="text-white/80">Bridal & Ankara Collection</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call to Action Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-plum py-12 md:py-20 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
          Inspired to Create Your Own Masterpiece?
        </h2>
        <p className="text-brand-off-white/90 text-lg md:text-xl max-w-2xl mx-auto">
          Let us bring your vision to life with our exquisite bridal accessories and Ankara craft.
        </p>
        <div className="mt-8 flex flex-col md:flex-row justify-center gap-4">
          <a href="/shop" className="btn-gold px-8 py-4 text-lg inline-flex items-center gap-3">
            Shop Collection <span aria-hidden="true">→</span>
          </a>
          <a href="/contact" className="btn-white-outline px-8 py-4 text-lg inline-flex items-center gap-3">
            Book Consultation <span aria-hidden="true">→</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
}