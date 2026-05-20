import React from 'react';
import { motion } from 'framer-motion';

export const MissionSection: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-[#FCF8F2] border border-[#EAE1D8] rounded-[2rem] p-5 md:p-8 lg:p-10 items-center text-center w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="w-full flex flex-col items-center"
      >
        <h2 className="text-3xl xl:text-4xl tracking-wide text-[#C99547] font-serif mb-1">
          In our Mission
        </h2>
        <div className="flex flex-wrap items-end justify-center gap-x-2 gap-y-1 mb-8 md:mb-10">
          <span className="text-4xl lg:text-5xl text-brand-dark font-serif">0</span>
          <span className="text-2xl sm:text-3xl xl:text-4xl tracking-wide text-[#C99547] font-serif">Textile to Landfill</span>
        </div>
        
        <div className="w-full flex flex-col gap-6 md:gap-8">
          
          {/* Tukar Pakaian */}
          <div className="relative flex flex-col items-center gap-3 w-full">
            <div className="absolute top-5.5 left-1/2 -translate-x-1/2 w-full h-0.5 bg-linear-to-r from-transparent via-[#A77E50] to-transparent z-0"></div>
            <div className="relative z-10 bg-[#FCF8F2] border border-[#A77E50] text-[#4A3D30] px-5 md:px-6 py-2.5 rounded-full font-bold text-sm md:text-base min-w-44 md:min-w-50">
              Tukar Pakaian
            </div>
            <p className="text-xs text-[#7A6C5D] leading-relaxed max-w-[90%] mx-auto">
              Lemarimu penuh, tapi kamu bosan? Tukar dengan orang di sekitarmu menggunakan Token Swap
            </p>
          </div>

          {/* Donasi Pakaian */}
          <div className="relative flex flex-col items-center gap-3 w-full">
            <div className="absolute top-5.5 left-1/2 -translate-x-1/2 w-full h-0.5 bg-linear-to-r from-transparent via-[#A77E50] to-transparent z-0"></div>
            <div className="relative z-10 bg-[#FCF8F2] border border-[#A77E50] text-[#4A3D30] px-5 md:px-6 py-2.5 rounded-full font-bold text-sm md:text-base min-w-44 md:min-w-50">
              Donasi Pakaian
            </div>
            <p className="text-xs text-[#7A6C5D] leading-relaxed max-w-[90%] mx-auto">
              Pakaianmu sampai ke tangan yang benar-benar membutuhkan, bukan kotak donasi biasa.
            </p>
          </div>

          {/* Daur Ulang Pakaian */}
          <div className="relative flex flex-col items-center gap-3 w-full">
            <div className="absolute top-5.5 left-1/2 -translate-x-1/2 w-full h-0.5 bg-linear-to-r from-transparent via-[#A77E50] to-transparent z-0"></div>
            <div className="relative z-10 bg-[#FCF8F2] border border-[#A77E50] text-[#4A3D30] px-5 md:px-6 py-2.5 rounded-full font-bold text-sm md:text-base min-w-44 md:min-w-50">
              Daur Ulang Pakaian
            </div>
            <p className="text-xs text-[#7A6C5D] leading-relaxed max-w-[90%] mx-auto">
              Pakaian rusak bukan akhir segalanya. Kami ubah jadi material baru dan kamu dapat Token Swap.
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
};
