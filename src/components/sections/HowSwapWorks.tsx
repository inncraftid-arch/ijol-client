import React from 'react';
import { motion } from 'framer-motion';
import { IconShirt, IconPeopleSwap, IconTime, IconOrderApprove, IconCardPay, IconScooterDelivery, IconBadgeCheck, IconBadgeClose } from '../icons/HowSwapWorksIcons';

export const HowSwapWorks: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Title */}
      <h3 className="text-3xl md:text-4xl tracking-wide text-brand-dark font-serif text-center lg:text-right lg:pr-4">
        How Swap Works?
      </h3>

      {/* Main Container */}
      <div className="border border-[rgb(234,225,216)] rounded-[2rem] md:rounded-4xl p-5 md:p-8 xl:p-10 bg-white shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 xl:gap-x-8 gap-y-8 xl:gap-y-10">
          
          {/* Step 1 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-[rgb(234,225,216)] flex items-center justify-center text-[#4A3D30]">
              <IconShirt />
            </div>
            <h4 className="text-base font-bold text-[rgb(201,149,71)]">1. Cari Pakaian Favorit</h4>
            <p className="text-xs text-[#7A6C5D] leading-relaxed">
              Jelajahi list pakaian di bawah, Catat kode pakaian.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }} className="flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-[rgb(234,225,216)] flex items-center justify-center text-[#4A3D30]">
              <IconPeopleSwap />
            </div>
            <h4 className="text-base font-bold text-[rgb(201,149,71)]">2. Ajukan pertukaran</h4>
            <p className="text-xs text-[#7A6C5D] leading-relaxed">
              Isi form swap, masukkan kode item yang kamu minati, lalu pilih pakaian dari koleksi pribadimu yang ingin kamu tukar.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }} className="flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-[rgb(234,225,216)] flex items-center justify-center text-[#4A3D30]">
              <IconTime />
            </div>
            <h4 className="text-base font-bold text-[rgb(201,149,71)]">3. Tunggu konfirmasi</h4>
            <p className="text-xs text-[#7A6C5D] leading-relaxed">
              Pengajuan akan dikirim ke pemilik pakaian. Admin akan menghubungi kedua belah pihak via WhatsApp.
            </p>
          </motion.div>

          {/* Step 4 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.3 }} className="flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-[rgb(234,225,216)] flex items-center justify-center text-[#4A3D30]">
              <IconOrderApprove />
            </div>
            <h4 className="text-base font-bold text-[rgb(201,149,71)]">4. Pemilik menyetujui?</h4>
            <p className="text-xs text-[#7A6C5D] leading-relaxed">
              Jika pemilik setuju untuk swap/sewa/preloved, proses dilanjutkan.
            </p>
          </motion.div>

          {/* Step 5 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.4 }} className="flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-[rgb(234,225,216)] flex items-center justify-center text-[#4A3D30]">
              <IconCardPay />
            </div>
            <h4 className="text-base font-bold text-[rgb(201,149,71)]">5. Konfirmasi & pembayaran</h4>
            <p className="text-xs text-[#7A6C5D] leading-relaxed">
              Kamu akan dihubungi admin untuk konfirmasi pembayaran. Isi bukti pembayaran melalui form yang dikirim.
            </p>
          </motion.div>

          {/* Step 6 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.5 }} className="flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-[rgb(234,225,216)] flex items-center justify-center text-[#4A3D30]">
              <IconScooterDelivery />
            </div>
            <h4 className="text-base font-bold text-[rgb(201,149,71)]">6. Pakaian diantar</h4>
            <p className="text-xs text-[#7A6C5D] leading-relaxed">
              Driver akan mengambil pakaian dari alamatmu dan mengantarkannya ke pemilik baru, Selesai.
            </p>
          </motion.div>

        </div>
      </div>

      {/* Badges Row */}
      <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2 w-full">
        <div className="flex items-center gap-2 bg-[#FCF8F2] text-[#A77E50] px-3 py-2.5 rounded-full text-xs font-semibold">
          <IconBadgeCheck className="w-4 h-4" />
          Cuci sebelum di Tukar
        </div>
        <div className="flex items-center gap-2 bg-[#FCF8F2] text-[#A77E50] px-3 py-2.5 rounded-full text-xs font-semibold">
          <IconBadgeCheck className="w-4 h-4" />
          Bersih & layak pakai
        </div>
        <div className="flex items-center gap-2 bg-[#FCF8F2] text-[#A77E50] px-3 py-2.5 rounded-full text-xs font-semibold">
          <IconBadgeCheck className="w-4 h-4" />
          Semua kategori
        </div>
        <div className="flex items-center gap-2 bg-[#FCF8F2] text-[#A77E50] px-3 py-2.5 rounded-full text-xs font-semibold">
          <IconBadgeCheck className="w-4 h-4" />
          Branded & non-branded
        </div>
        <div className="flex items-center gap-2 bg-[#FCF8F2] text-[#A77E50] px-3 py-2.5 rounded-full text-xs font-semibold">
          <IconBadgeClose className="w-4 h-4" />
          Pakaian dalam
        </div>
      </div>

    </div>
  );
};
