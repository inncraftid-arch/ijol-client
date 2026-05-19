import React from 'react';
import { motion } from 'framer-motion';

export const HeroSection: React.FC = () => {
  return (
    <section
      className="relative min-h-[80vh] flex flex-col pt-36 md:pt-44 lg:pt-52 pb-12 overflow-hidden bg-surface-light bg-[length:100%_100%] bg-center bg-no-repeat rounded-b-[3rem] md:rounded-b-[4rem]"
      style={{ backgroundImage: `url('/src/assets/images/bg-hero.png')` }}
    >
      {/* Star Right image positioned on Top Right, showing more than 1/4 */}
      <img
        src="/src/assets/images/star-right.png"
        alt=""
        className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 w-80 md:w-2xl lg:w-300 pointer-events-none z-0"
      />

      {/* Star Left image positioned on Bottom Left, showing more than 1/4 */}
      <img
        src="/src/assets/images/star-left.png"
        alt=""
        className="absolute bottom-0 left-0 -translate-x-1/3 translate-y-1/3 w-80 md:w-xl lg:w-200 pointer-events-none z-0"
      />

      {/* Background Decorative Circle */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-full max-w-200 pointer-events-none">
        <img
          src="/src/assets/images/main.circle.svg"
          alt=""
          className="w-full h-auto opacity-70 animate-spin-slow"
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-360 relative z-10 flex flex-col items-center text-center">
        {/* Top Tagline Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border border-brand-dark/20 bg-[#EAE1D8] text-brand-dark px-3 md:px-5 py-1 rounded-full text-xs lg:text-base font-medium mb-12 md:mb-16 lg:mb-20 flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-dark"></span>a platform that allows
          locals to swap clothes
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-sans font-semibold text-brand-dark max-w-5xl leading-[1.1] mb-16 md:mb-20 lg:mb-24 tracking-tight"
        >
          <span className="text-[#C99547]">Swapping</span> unused outfits, because reducing textile waste is the{' '}
          <span className="italic text-[#C99547]">real fit</span>.
        </motion.h1>

        {/* Main Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full max-w-3xl relative z-20"
        >
          <img
            src="/src/assets/images/main.ilustraton.svg"
            alt="Swapping clothes illustration"
            className="w-full h-auto drop-shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
};
