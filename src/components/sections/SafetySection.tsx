import React from 'react';
import { motion } from 'framer-motion';

export const SafetySection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-[1440px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Keamanan */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6 font-serif text-center md:text-left">
              Keamanan
            </h2>
            <div className="group relative rounded-[2rem] overflow-hidden bg-[#CBA478] flex-1 min-h-[300px]">
              <img 
                src="/assets/images/safety-left.png" 
                alt="Keamanan IJOL" 
                className="absolute right-0 bottom-0 w-[80%] h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Badges/Text Overlays */}
              <div className="absolute top-1/2 left-8 -translate-y-1/2 flex items-center gap-3 bg-brand-dark text-white p-3 pr-5 rounded-full shadow-lg">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <span className="font-semibold text-sm leading-tight">QC sebelum<br/>listed</span>
              </div>

              <div className="absolute bottom-8 right-8 flex items-center gap-3 bg-brand-dark text-white p-3 pl-5 rounded-full shadow-lg">
                <span className="font-semibold text-sm leading-tight text-right">Refund jika tidak<br/>sesuai</span>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Collaboration */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col mt-16 md:mt-0"
          >
            {/* Empty space to align with the left title */}
            <div className="hidden md:block h-[3.25rem] mb-6"></div>
            
            <div className="group relative rounded-[2rem] overflow-hidden bg-[#EAE1D8] flex-1 min-h-[300px] flex flex-col justify-end p-8">
              <img 
                src="/assets/images/safety-right.png" 
                alt="Partnership IJOL" 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-[300px] h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              <div className="relative z-10 text-center flex flex-col items-center mt-32">
                <p className="text-white font-medium mb-1 drop-shadow-md">We're open for</p>
                <h3 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6 font-serif leading-tight">
                  Collaboration<br/>& Partnership
                </h3>
                <button className="w-full max-w-[280px] bg-brand-dark hover:bg-black/90 text-white py-3 rounded-full font-bold transition-colors">
                  Contact Now
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
