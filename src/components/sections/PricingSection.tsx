import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { contactEmailUrl } from '../../config/contact';

type Feature = {
  text: React.ReactNode;
  included: boolean;
};

type PricingPlan = {
  id: string;
  badge: string;
  discountBadge?: string;
  originalPrice: string;
  currentPrice: string;
  priceColor?: string;
  features: Feature[];
  buttonText: string;
  buttonVariant: 'outline' | 'solid';
  buttonTextColor?: string;
  buttonBorderColor?: string;
  buttonHref?: string;
};

const plans: PricingPlan[] = [
  {
    id: 'mini',
    badge: 'Mini SWAP',
    originalPrice: 'Rp15.000',
    currentPrice: 'Rp10.000',
    features: [
      { text: '1 swap', included: true },
      { text: 'Radius Bebas', included: true },
      { text: 'Ongkir Ditanggung Pengguna', included: false },
    ],
    buttonText: 'Tukar Sekarang',
    buttonVariant: 'outline',
    buttonTextColor: 'text-[#453421]',
    buttonBorderColor: 'border-[#453421]/20',
    buttonHref: '/collections',
  },
  {
    id: 'single',
    badge: 'SINGLE SWAP',
    originalPrice: 'Rp30.000',
    currentPrice: 'Rp25.000',
    features: [
      { text: '1 swap', included: true },
      { text: 'Termasuk Ongkir', included: true },
      { text: <><span className="text-brand-dark">Radius ≤5km</span> <span className="text-brand-dark/50">(Lokasi antar Swapper)</span></>, included: true },
    ],
    buttonText: 'Tukar Sekarang',
    buttonVariant: 'outline',
    buttonTextColor: 'text-[#453421]',
    buttonBorderColor: 'border-[#453421]/20',
    buttonHref: '/collections',
  },
  {
    id: 'quad',
    badge: 'QUAD SWAP',
    discountBadge: 'Hemat 30%',
    originalPrice: 'Rp120.000',
    currentPrice: 'Rp84.000',
    priceColor: 'text-[#C99547]',
    features: [
      { text: '4 swap', included: true },
      { text: 'Termasuk Ongkir', included: true },
      { text: <><span className="text-brand-dark">Radius ≤5km</span> <span className="text-brand-dark/50">(Lokasi antar Swapper)</span></>, included: true },
      { text: 'Prioritas Listing', included: true },
    ],
    buttonText: 'Contact Now',
    buttonVariant: 'outline',
    buttonTextColor: 'text-[#C99547]',
    buttonBorderColor: 'border-[#C99547]',
    buttonHref: contactEmailUrl,
  },
  {
    id: 'octa',
    badge: 'OCTA SWAP',
    discountBadge: 'Hemat 30%',
    originalPrice: 'Rp240.000',
    currentPrice: 'Rp168.000',
    features: [
      { text: '8 swap', included: true },
      { text: 'Termasuk Ongkir', included: true },
      { text: <><span className="text-brand-dark">Radius ≤5km</span> <span className="text-brand-dark/50">(Lokasi antar Swapper)</span></>, included: true },
      { text: 'Prioritas Listing', included: true },
      { text: 'Koleksi premium', included: true },
    ],
    buttonText: 'Contact Now',
    buttonVariant: 'solid',
    buttonHref: contactEmailUrl,
  },
];

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-1">
    <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="#453421" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CrossIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-1">
    <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="#453421" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const getPlanButtonClassName = (plan: PricingPlan) =>
  `block w-full rounded-full py-3 text-center text-sm font-bold transition-colors md:py-4 md:text-base ${
    plan.buttonVariant === 'solid'
      ? 'bg-[#453421] text-white hover:bg-black/90'
      : `bg-transparent border ${plan.buttonBorderColor} ${plan.buttonTextColor} hover:bg-black/5`
  }`;

export const PricingSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={containerRef} className="py-12 md:py-16 overflow-hidden bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-[1440px]">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 w-full">
          <div>
            <h2 className="text-4xl md:text-5xl text-brand-dark font-serif mb-2 tracking-wide">
              Pricing Plans
            </h2>
            <p className="text-brand-dark/50 text-base md:text-xl font-medium">
              Bayar jika orang lain juga tertarik dengan Swap pakaianmu
            </p>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-2">
            <span className="text-brand-dark/60 font-medium">Promo Berakhir Pada:</span>
            <div className="px-5 py-2 border border-brand-dark/20 rounded-full text-brand-dark font-bold">
              22 July 2026
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="mt-8 md:mt-12 w-full overflow-x-auto pb-8 hide-scrollbar">
        <div className="flex items-stretch gap-4 md:gap-6 px-4 md:px-8 max-w-[1440px] mx-auto min-w-max">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex w-[270px] flex-shrink-0 flex-col overflow-hidden rounded-[2rem] border border-brand-dark/10 bg-white sm:w-[300px] md:w-[320px]"
            >
              {/* Card Header (Colored Background) */}
              <div className="bg-[#F5F0EB]/60 p-6 pt-8 pb-10 m-2 rounded-[1.5rem] relative flex flex-col items-center justify-center min-h-[160px]">
                <div className="absolute top-4 left-4 flex gap-2 w-full pr-8 justify-between items-start">
                  <div className="bg-white px-3 py-1 rounded-full text-xs font-bold text-brand-dark uppercase tracking-wider shadow-sm">
                    {plan.badge}
                  </div>
                  {plan.discountBadge && (
                    <div className="text-[#D92D20] text-sm font-bold bg-white/80 px-2 py-0.5 rounded-md">
                      {plan.discountBadge}
                    </div>
                  )}
                </div>
                
                <div className="mt-8 w-full flex flex-col items-end justify-end text-right">
                  <div className="text-brand-dark/40 line-through font-serif tracking-wide text-xl md:text-2xl mb-1">
                    {plan.originalPrice}
                  </div>
                  <div className={`font-serif tracking-tight text-4xl md:text-[2.75rem] ${plan.priceColor || 'text-brand-dark'}`}>
                    {plan.currentPrice}
                  </div>
                </div>
              </div>

              {/* Card Body (Features and Button) */}
              <div className="flex grow flex-col bg-white p-6">
                <ul className="mb-8 flex flex-col gap-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm md:text-base text-medium">
                      {feature.included ? <CheckIcon /> : <CrossIcon />}
                      <span className={feature.included ? 'text-brand-dark' : 'text-brand-dark/50'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {plan.buttonHref?.startsWith('/') ? (
                  <Link to={plan.buttonHref} className={`mt-auto ${getPlanButtonClassName(plan)}`}>
                    {plan.buttonText}
                  </Link>
                ) : plan.buttonHref ? (
                  <a href={plan.buttonHref} className={`mt-auto ${getPlanButtonClassName(plan)}`}>
                    {plan.buttonText}
                  </a>
                ) : (
                  <button type="button" className={`mt-auto ${getPlanButtonClassName(plan)}`}>
                    {plan.buttonText}
                  </button>
                )}
              </div>
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
