import React from 'react';
import { motion } from 'framer-motion';

export const SafetySection: React.FC = () => {
  return (
    <section className="pt-8 md:pt-16 pb-20 md:pb-28 xl:pb-40 bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-[1440px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 xl:gap-12 items-stretch">
          
          {/* Keamanan */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-[2rem] bg-[#DAC8B5] flex flex-col items-center p-5 md:p-8 gap-3 overflow-hidden"
          >
            {/* "Keamanan" title label */}
            <span className="text-3xl md:text-5xl mt-5 mb-10 text-brand-dark font-serif tracking-wide">Keamanan</span>

            {/* Image - fully visible, no crop */}
            <img
              src="/assets/images/safety.png"
              alt="Keamanan IJOL"
              className="w-full h-auto object-contain mt-3 md:mt-4"
            />
          </motion.div>

          {/* Collaboration */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-[2rem] overflow-hidden border border-brand-dark/10 bg-white flex flex-col p-2.5 md:p-3 gap-2.5 md:gap-3"
          >
            {/* Image area with text overlay */}
            <div className="flex-1 min-h-[260px] sm:min-h-[320px] lg:min-h-[420px] rounded-[1.5rem] overflow-hidden relative">
              <img
                src="/assets/images/colaboration.png"
                alt="Collaboration & Partnership IJOL"
                className="w-full h-full object-cover object-center"
              />
              {/* Text overlay - right side */}
              <div className="absolute inset-0 flex flex-col items-end justify-center text-right pr-5 md:pr-8 max-w-full">
                <p className="text-white text-sm md:text-lg lg:text-xl font-medium mb-1 drop-shadow-sm">We're open for</p>
                <h3 className="text-2xl sm:text-3xl lg:text-[2.75rem] text-brand-dark font-serif leading-[1.1]">
                  Collaboration<br/>& Partnership
                </h3>
              </div>
            </div>

            {/* Button */}
            <button className="w-full bg-[#453421] hover:bg-black/90 text-white py-3.5 md:py-4 rounded-[1.25rem] font-bold text-sm md:text-base transition-colors">
              Contact Now
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
