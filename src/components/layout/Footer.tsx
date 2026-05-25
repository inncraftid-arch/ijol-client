import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router';
import { contactEmailUrl } from '../../config/contact';
import { footerPolicies, type FooterPolicyKey } from './footerPolicyContent';

export const Footer: React.FC = () => {
  const [activePolicy, setActivePolicy] = useState<FooterPolicyKey | null>(null);
  const policy = activePolicy ? footerPolicies[activePolicy] : null;

  return (
    <div className="bg-white">
      <footer className="bg-[#4A3D30] text-white py-4 rounded-t-[2.5rem] w-full mx-auto">
        <div className="container mx-auto px-4 md:px-8 max-w-[1440px] flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          {/* Left: Logo */}
          <div className="shrink-0 w-full md:w-auto flex justify-center md:justify-start">
            <Link to="/">
              <img src="/assets/images/logo.dark.full.svg" alt="IJOL" className="h-8" />
            </Link>
          </div>

          {/* Center: Social Links */}
          <div className="flex items-center justify-center gap-6">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/ijol.in?igsh=MWVoMW5remN5ZWh2Zw=="
              target="_blank"
              rel="noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <img src="/assets/icons/ri_instagram-fill.svg" alt="Instagram" className="w-7 h-7" />
            </a>
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/company/ijol/"
              target="_blank"
              rel="noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <img src="/assets/icons/mdi_linkedin.svg" alt="LinkedIn" className="w-7 h-7" />
            </a>
            {/* Email */}
            <a href={contactEmailUrl} className="hover:opacity-80 transition-opacity">
              <img src="/assets/icons/ic_round-email.svg" alt="Email" className="w-7 h-7" />
            </a>
          </div>

          {/* Right: Policy Links */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-4 gap-y-2 text-sm font-semibold w-full md:w-auto">
            <button
              type="button"
              onClick={() => setActivePolicy('refund')}
              className="cursor-pointer hover:text-brand-gold transition-colors"
            >
              Kebijakan Refund
            </button>
            <span className="text-white">|</span>
            <button
              type="button"
              onClick={() => setActivePolicy('terms')}
              className="cursor-pointer hover:text-brand-gold transition-colors"
            >
              Syarat dan Ketentuan
            </button>
          </div>
        </div>
      </footer>

      {policy && (
        <div
          className="fixed inset-0 z-[160] flex justify-end bg-black/45 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="footer-policy-title"
        >
          <aside className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-white text-brand-dark shadow-2xl md:max-w-[720px] md:border-l md:border-brand-dark/10">
            <button
              type="button"
              onClick={() => setActivePolicy(null)}
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-brand-dark/10 bg-white text-brand-dark transition-colors hover:bg-[#FCF8F2]"
              aria-label="Tutup kebijakan"
            >
              <X size={18} />
            </button>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-28 pt-9 md:px-10 md:pb-32 md:pt-10">
              <h2
                id="footer-policy-title"
                className="font-serif text-2xl font-bold leading-tight tracking-wide text-brand-dark md:text-3xl"
              >
                {policy.title}
              </h2>
              <p className="mt-1 text-sm italic text-brand-dark/35">
                Terakhir diperbarui: {policy.updatedAt}
              </p>

              <div className="mt-8 space-y-7 text-sm leading-relaxed text-brand-dark/75 md:text-[15px]">
                <div className="[&>p]:mb-4 last:[&>p]:mb-0">{policy.intro}</div>

                {policy.sections.map((section, index) => (
                  <section key={section.title} className="space-y-3">
                    <h3 className="text-base font-bold leading-snug text-brand-dark">
                      {index + 1}. {section.title}
                    </h3>
                    <div className="space-y-4 pl-4 text-justify [&_li]:mb-2 [&_li]:pl-1 [&_p]:m-0 [&_strong]:font-bold [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
                      {section.content}
                    </div>
                  </section>
                ))}
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white to-white/0 px-6 pb-6 pt-12 md:px-10">
              <button
                type="button"
                onClick={() => setActivePolicy(null)}
                className="pointer-events-auto ml-auto flex min-h-12 min-w-32 items-center justify-center rounded-full border border-brand-gold bg-white px-8 text-sm font-bold text-brand-gold shadow-sm transition-colors hover:bg-[#FCF8F2] md:min-w-36 md:text-base"
              >
                Mengerti
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};
