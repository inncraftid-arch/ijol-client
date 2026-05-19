import React from 'react';
import { motion } from 'framer-motion';

export const ContributionSection: React.FC = () => {
  const renderDonasiCard = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-xl bg-[#F5F0EB] flex items-center justify-center shrink-0">
          <img src="/src/assets/icons/iconoir_donate.svg" alt="Donate" className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#A77E50]">Donasi Pakaian</h3>
          <p className="text-sm text-brand-dark/60">Disalurkan ke mitra NGO terverifikasi</p>
        </div>
      </div>
      
      <div className="flex gap-4 md:gap-8 mb-2 pb-6">
        <div className="flex-1 text-center bg-white border border-brand-dark/5 py-4 rounded-xl">
          <div className="text-sm text-brand-dark/60 font-medium mb-1">Donatur</div>
          <div className="text-3xl font-bold text-[#C99547] font-serif tracking-tight">2</div>
          <div className="text-xs text-brand-dark/60 mt-1">Orang</div>
        </div>
        <div className="flex-1 text-center bg-white border border-brand-dark/5 py-4 rounded-xl">
          <div className="text-sm text-brand-dark/60 font-medium mb-1">Total pcs</div>
          <div className="text-3xl font-bold text-[#C99547] font-serif tracking-tight">40</div>
          <div className="text-xs text-brand-dark/60 mt-1">Pakaian</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between bg-[#F5F0EB]/60 pl-8 px-5 py-2 rounded-full mb-6">
        <div>
          <span className="text-2xl font-bold text-brand-dark">40 </span>
          <span className="text-sm text-brand-dark/60">pcs<br/>Siap disalurkan</span>
        </div>
        <div className="w-12 h-12 bg-[#C99547] rounded-full flex items-center justify-center shrink-0">
          <img src="/src/assets/icons/solar_box-bold.svg" alt="Box" className="w-6 h-6 brightness-0 invert" />
        </div>
      </div>

      <div className="mt-auto">
        <button className="w-full bg-white border border-[#C99547] text-[#C99547] hover:bg-[#F5F0EB]/50 py-3 rounded-full font-bold transition-colors">
          Donasikan Pakaianmu
        </button>
      </div>
    </div>
  );

  const renderDaurUlangCard = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-xl bg-[#F5F0EB] flex items-center justify-center shrink-0">
          <img src="/src/assets/icons/tabler_recycle.svg" alt="Recycle" className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-brand-dark">IJOL Fiber – Daur Ulang</h3>
          <p className="text-sm text-brand-dark/60">Pakaian rusak menjadi material baru</p>
        </div>
      </div>
      
      <div className="flex gap-4 md:gap-8 mb-2 pb-6">
        <div className="flex-1 text-center bg-white border border-brand-dark/5 py-4 rounded-xl">
          <div className="text-sm text-brand-dark/60 font-medium mb-1">Pengirim</div>
          <div className="text-3xl font-bold text-brand-dark font-serif tracking-tight">1</div>
          <div className="text-xs text-brand-dark/60 mt-1">Orang</div>
        </div>
        <div className="flex-1 text-center bg-white border border-brand-dark/5 py-4 rounded-xl">
          <div className="text-sm text-brand-dark/60 font-medium mb-1">Total berat</div>
          <div className="text-3xl font-bold text-brand-dark font-serif tracking-tight">4</div>
          <div className="text-xs text-brand-dark/60 mt-1">kg tekstil</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between bg-[#F5F0EB]/60 pl-8 px-5 py-2 rounded-full mb-6">
        <div>
          <span className="text-2xl font-bold text-brand-dark">4 </span>
          <span className="text-sm text-brand-dark/60">kg tekstil<br/>Siap diproses</span>
        </div>
        <div className="w-12 h-12 bg-brand-dark rounded-full flex items-center justify-center shrink-0">
          <img src="/src/assets/icons/mynaui_copy-solid.svg" alt="Copy" className="w-6 h-6 brightness-0 invert" />
        </div>
      </div>

      <div className="mt-auto">
        <button className="w-full bg-white border border-brand-dark text-brand-dark hover:bg-[#F5F0EB]/50 py-3 rounded-full font-bold transition-colors">
          Daur Ulang Pakaian
        </button>
      </div>
    </div>
  );

  return (
    <section id="donate" className="py-10 bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-[1440px] flex flex-col items-center">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-brand-dark mb-3 font-serif">
            Berkontribusi untuk lingkungan
          </h2>
          <p className="text-brand-dark/60 text-lg">
            Pilih caramu, donasi atau daur ulang
          </p>
        </div>

        {/* Unified Responsive Container */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col border border-brand-dark/10 bg-[#F5F0EB]/50 rounded-3xl w-full max-w-6xl bg-white overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row rounded-4xl">
            <div className="flex-1 px-6 pt-6 pb-3 md:px-8 md:pt-8 md:pb-4 xl:px-10 xl:pt-10 xl:pb-5">
              {renderDonasiCard()}
            </div>
            
            {/* Divider */}
            <div className="h-[1px] lg:h-auto lg:w-[1px] bg-brand-dark/10 mx-6 lg:mx-0"></div>
            
            <div className="flex-1 px-6 pt-6 pb-3 md:px-8 md:pt-8 md:pb-4 xl:px-10 xl:pt-10 xl:pb-5">
              {renderDaurUlangCard()}
            </div>
          </div>
          
          <div className="bg-[#F5F0EB]/50 py-2 text-center border-t border-brand-dark/10">
            <p className="text-sm text-brand-dark/40 font-medium">Terakhir diperbarui: 22 Mei 2026</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
