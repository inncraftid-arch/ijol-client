import React from 'react';
import { Link } from 'react-router';
import { contactEmailUrl } from '../../config/contact';

export const Footer: React.FC = () => {
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
            <a href="#" className="hover:text-brand-gold transition-colors">
              Kebijakan Refund
            </a>
            <span className="text-white">|</span>
            <a href="#" className="hover:text-brand-gold transition-colors">
              Syarat dan Ketentuan
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
