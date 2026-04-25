import React from 'react';
import { motion } from 'motion/react';

export default function VideoGallery() {
  const videos = [
    'https://vimeo.com/1186449685',
    'https://vimeo.com/1186449671',
    'https://vimeo.com/1186449655',
    'https://vimeo.com/1186449634',
    'https://vimeo.com/1186449621',
    'https://vimeo.com/1186449604',
    'https://vimeo.com/1186449594',
    'https://vimeo.com/1186449582'
  ];

  // Extract video ID from Vimeo URL
  const getVideoId = (url: string) => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : '';
  };

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
            <span className="text-brand-gold">VIDEO GALLERY</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-brand-off-white/90 text-xl md:text-2xl max-w-xl font-medium"
          >
            Watch our creative journey, bridal collections, and behind-the-scenes moments.
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
          Our Creative Videos
        </h2>
        <p className="text-brand-gray font-medium max-w-2xl mx-auto">
          Explore our video collection showcasing the artistry and passion behind every piece.
        </p>
      </motion.div>

      {/* Video Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid gap-8">
          {videos.map((videoUrl, index) => {
            const videoId = getVideoId(videoUrl);
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="rounded-[2rem] overflow-hidden shadow-2xl group"
              >
                <iframe
                  src={`https://player.vimeo.com/video/${videoId}?background=1`}
                  title={`Floperia Video ${index + 1}`}
                  className="w-full h-[400px] md:h-[500px] lg:h-[600px]"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
                {/* Overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <h3 className="text-white text-xl font-bold">Floperia Classic</h3>
                    <p className="text-white/80">Bridal & Ankara Collection</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
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

      {/* Vimeo Link Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-off-white py-12 md:py-20 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-brand-plum tracking-tight">
          Explore More Videos on Vimeo
        </h2>
        <p className="text-brand-gray text-lg md:text-xl max-w-2xl mx-auto">
          Visit our official Vimeo channel for the complete video collection.
        </p>
        <a href="https://vimeo.com/floperiaworld" className="btn-gold px-8 py-4 text-lg inline-flex items-center gap-3">
          Watch on Vimeo <span aria-hidden="true">→</span>
        </a>
      </motion.div>
    </div>
  );
}