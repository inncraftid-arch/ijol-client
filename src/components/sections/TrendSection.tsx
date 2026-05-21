import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import type { TrendItem } from '../../types';

const trends: TrendItem[] = [
  { id: '1', title: '', image: '/assets/images/trend.pestapora.png' },
  { id: '2', title: '', image: '/assets/images/trend.syahrini.png' },
  { id: '3', title: '', image: '/assets/images/trend.agustusan.png' },
  { id: '4', title: '', image: '/assets/images/trend.halloween.png' },
  { id: '5', title: '', image: '/assets/images/trend.christmas.png' },
  { id: '6', title: '', image: '/assets/images/trend.new-year.png' },
];

export const TrendSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={containerRef} className="py-12 md:py-16 xl:py-20 overflow-hidden bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-[1440px] mb-10 md:mb-16 flex flex-col items-center">
        {/* Decorative Heading */}
        <div className="relative w-full flex flex-col md:flex-row items-center justify-center pt-28 sm:pt-32 md:pt-0">
          {/* Left decoration */}
          <img
            src="/assets/images/trend.left.svg"
            alt=""
            className="absolute left-0 top-0 md:top-1/2 md:-translate-y-1/2 w-32 sm:w-40 lg:w-64 xl:w-88 h-auto pointer-events-none translate-x-0 sm:-translate-x-36 md:-translate-x-32 lg:-translate-x-24 xl:-translate-x-12"
          />
          
          <div className="flex flex-col items-center text-center px-2 z-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-brand-dark font-serif leading-snug max-w-[22rem] sm:max-w-none">
              Rekomendasi Berdasarkan Trend
            </h2>
            <p className="text-brand-dark/60 mt-2 text-sm lg:text-lg">
              Kamu cari pakaian unik untuk acara tertentu?
              <br className="block text-sm lg:text-lg" />
              Lihat pilihan yang bisa kamu tukar di bawah ini.
              <br />
              <span className="opacity-50 mt-1 block">- Segera Hadir -</span>
            </p>
          </div>

          {/* Right decoration */}
          <img
            src="/assets/images/trend.right.svg"
            alt=""
            className="absolute right-0 top-0 md:top-1/2 md:-translate-y-1/2 w-32 sm:w-40 lg:w-64 xl:w-88 h-auto pointer-events-none translate-x-0 sm:translate-x-36 md:translate-x-32 lg:translate-x-24 xl:translate-x-12"
          />
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="w-full overflow-x-auto pb-8 hide-scrollbar">
        <div className="flex gap-4 px-4 md:px-8 max-w-[1440px] mx-auto min-w-max">
          {trends.map((trend, index) => (
            <motion.div
              key={trend.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="w-44 h-60 sm:w-48 sm:h-64 md:w-56 md:h-72 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden flex-shrink-0 relative group shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={trend.image}
                alt="Trend"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hide scrollbar styling inline for convenience */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};
