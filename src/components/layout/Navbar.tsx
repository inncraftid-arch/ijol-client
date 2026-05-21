import React, { useState } from 'react';
import { Mail, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { UploadProductDrawerWithUserLookup as UploadProductDrawer } from '../forms/UploadProductDrawerWithUserLookup';
import { contactEmailUrl } from '../../config/contact';

const donationFormUrl = 'https://forms.gle/SUqFHTXzJGmDLxXb7';
const recycleFormUrl = 'https://forms.gle/XcAZsha65NmZg1bx7';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUploadDrawerOpen, setIsUploadDrawerOpen] = useState(false);
  const [isUploadSuccessOpen, setIsUploadSuccessOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Koleksi Outfit', to: '/collections' },
    { label: 'Donasi', to: donationFormUrl, external: true },
    { label: 'Daur Ulang', to: recycleFormUrl, external: true },
  ];

  const preventSameRouteReload = (
    event: React.MouseEvent<HTMLAnchorElement>,
    to: string
  ) => {
    const target = new URL(to, window.location.origin);
    const isSameDestination =
      location.pathname === target.pathname &&
      location.search === target.search &&
      location.hash === target.hash;

    if (isSameDestination) {
      event.preventDefault();
    }
  };

  return (
    <>
      <header className="fixed z-50 transition-all duration-300 left-4 right-4 md:left-8 md:right-8 max-w-[1440px] mx-auto top-6 bg-white/95 backdrop-blur-md border border-[#EAE1D8] shadow-sm rounded-full py-2 md:py-4 px-4 md:px-4">
      <div className="flex items-center justify-between w-full">
        {/* Left Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-4 flex-1 text-sm font-semibold">
          {navLinks.map((link, index) => (
            <React.Fragment key={link.label}>
              {link.external ? (
                <a
                  href={link.to}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#A77E50] hover:text-brand-dark transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  to={link.to}
                  onClick={(event) => preventSameRouteReload(event, link.to)}
                  className="text-[#A77E50] hover:text-brand-dark transition-colors"
                >
                  {link.label}
                </Link>
              )}
              {index < navLinks.length - 1 && <span className="w-[1px] h-4 bg-[#EAE1D8]"></span>}
            </React.Fragment>
          ))}
        </nav>

        {/* Logo (Center) */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <Link to="/" onClick={(event) => preventSameRouteReload(event, '/')}>
            <img src="/assets/images/logo.light.svg" alt="IJOL" className="h-4 md:h-8" />
          </Link>
        </div>

        {/* Right Buttons (Desktop) */}
        <div className="hidden lg:flex items-center justify-end gap-3 flex-1">
          <a
            href={contactEmailUrl}
            className="flex items-center gap-2 rounded-full bg-[#C99547] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#B38036]"
          >
            <Mail className="h-[18px] w-[18px]" />
            Hubungi Kami
          </a>
          <button
            type="button"
            onClick={() => setIsUploadDrawerOpen(true)}
            className="flex items-center gap-2 bg-brand-dark hover:bg-black/90 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
          >
            <img src="/assets/icons/stash_plus-solid.svg" alt="Plus" className="w-[18px] h-[18px]" />
            Upload Baju
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden bg-brand-dark text-white p-1 rounded-full flex items-center justify-center hover:bg-black transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={20} strokeWidth={3} /> : <Menu size={20} strokeWidth={3} />}
        </button>
      </div>
    </header>

      {/* Mobile Menu Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed top-0 left-0 right-0 z-[60] bg-white flex flex-col px-8 pt-8 pb-10 shadow-2xl rounded-b-3xl border-b border-[#EAE1D8]">
          {/* Top: Logo and Close Button */}
          <div className="flex items-center justify-between mb-10">
            <Link
              to="/"
              onClick={(event) => {
                preventSameRouteReload(event, '/');
                setIsMobileMenuOpen(false);
              }}
            >
              <img src="/assets/images/logo.light.svg" alt="IJOL" className="h-4" />
            </Link>
            <button
              className="text-brand-dark p-1.5 border-[1.5px] border-brand-dark rounded-full flex items-center justify-center hover:bg-brand-dark hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={20} strokeWidth={3} />
            </button>
          </div>

          {/* Center: Navigation Links */}
          <nav className="flex flex-col items-center gap-4 mb-6 w-full max-w-[240px] mx-auto">
            {navLinks.map((link, index) => (
              <React.Fragment key={link.label}>
                {link.external ? (
                  <a
                    href={link.to}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#967142] font-bold text-sm hover:text-brand-dark transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    to={link.to}
                    className="text-[#967142] font-bold text-sm hover:text-brand-dark transition-colors"
                    onClick={(event) => {
                      preventSameRouteReload(event, link.to);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {link.label}
                  </Link>
                )}
                {index < navLinks.length - 1 && (
                  <div className="w-full h-px bg-[#EAE1D8]"></div>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Bottom: Action Buttons */}
          <div className="flex items-center gap-3">
            <a
              href={contactEmailUrl}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#C99547] px-1 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#b08139]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Mail className="h-4 w-4" />
              Hubungi Kami
            </a>
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsUploadDrawerOpen(true);
              }}
              className="flex-1 flex justify-center items-center gap-1.5 bg-brand-dark hover:bg-black/90 transition-colors text-white text-xs font-semibold px-1 py-2 rounded-full"
            >
              <img src="/assets/icons/stash_plus-solid.svg" alt="Plus" className="w-4 h-4" />
              Upload Baju
            </button>
          </div>
        </div>
      )}
      <UploadProductDrawer
        isOpen={isUploadDrawerOpen}
        onClose={() => setIsUploadDrawerOpen(false)}
        onSuccess={() => setIsUploadSuccessOpen(true)}
      />
      {isUploadSuccessOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/45 px-5 backdrop-blur-[1px]">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Upload pakaian berhasil"
            className="w-full max-w-[620px] rounded-sm bg-white px-7 py-9 text-center shadow-2xl md:px-16 md:py-10"
          >
            <h2 className="font-serif text-2xl font-bold tracking-wide text-brand-dark md:text-3xl">
              Upload Pakaian Berhasil!
            </h2>
            <p className="mx-auto mt-4 max-w-[510px] text-sm leading-relaxed text-brand-dark/70 md:text-base">
              Terima kasih sudah menambah katalog. Tim kami akan melakukan QC dalam 1-2 hari kerja,
              hasilnya akan kami kabari via WhatsApp.
            </p>
            <button
              type="button"
              onClick={() => setIsUploadSuccessOpen(false)}
              className="mt-8 inline-flex min-h-12 min-w-32 items-center justify-center rounded-full border border-[#C99547] px-8 font-bold text-[#C99547] transition-colors hover:bg-[#FCF8F2]"
            >
              Selesai
            </button>
          </div>
        </div>
      )}
    </>
  );
};
