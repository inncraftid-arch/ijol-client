import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { createWhatsAppUrl } from '../../config/contact';
import type { Product } from '../../types';
import { SwapRequestDrawer } from '../forms/SwapRequestDrawer';
import { IconLocation, IconProfile } from '../icons/ProductIcons';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

type ProductAction = {
  label: string;
  className: string;
  href?: string;
  onClick?: () => void;
};

const createBuyMessage = (product: Product) =>
  [
    'Halo IJOL!',
    '',
    'Saya ingin membeli item berikut:',
    '',
    `Kode item: ${product.label}`,
    `Nama item: ${product.name}`,
    'Kota saya: [kota]',
    '',
    'Nama: [nama lengkap]',
    'Nomor WA: [nomor ini]',
    '',
    'Mohon info langkah selanjutnya ya. Terima kasih!',
  ].join('\n');

const createRentMessage = (product: Product) =>
  [
    'Halo IJOL!',
    '',
    'Saya ingin menyewa item berikut:',
    '',
    `Kode item: ${product.label}`,
    `Nama item: ${product.name}`,
    'Tanggal mulai sewa: [tanggal]',
    'Tanggal kembali: [tanggal]',
    'Kota saya: [kota]',
    '',
    'Nama: [nama lengkap]',
    'Nomor WA: [nomor ini]',
    '',
    'Mohon info ketersediaan dan biaya sewanya. Terima kasih!',
  ].join('\n');

const getActionsLayout = (product: Product) => {
  if (product.canRent && product.canBuy) {
    return 'grid-cols-[0.7fr_1.2fr_1.6fr]';
  }

  if (product.canRent) {
    return 'grid-cols-[0.8fr_2fr]';
  }

  if (product.canBuy) {
    return 'grid-cols-2';
  }

  return 'grid-cols-1';
};

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSwapDrawerOpen, setIsSwapDrawerOpen] = useState(false);
  const [isSwapSuccessOpen, setIsSwapSuccessOpen] = useState(false);

  const images = useMemo(() => {
    if (!product) {
      return [];
    }

    return product.images?.length ? product.images : [product.image];
  }, [product]);

  const actions: ProductAction[] = useMemo(() => {
    if (!product) {
      return [];
    }

    const productActions: ProductAction[] = [];

    if (product.canRent) {
      productActions.push({
        label: 'Sewa',
        className: 'border border-[#C99547] text-[#C99547] bg-white hover:bg-[#FCF8F2]',
        href: createWhatsAppUrl(createRentMessage(product)),
      });
    }

    if (product.canBuy) {
      productActions.push({
        label: 'Beli Baju',
        className: 'bg-[#C99547] text-white hover:bg-[#B38036]',
        href: createWhatsAppUrl(createBuyMessage(product)),
      });
    }

    if (product.canSwap !== false) {
      productActions.push({
        label: 'Tukar Baju',
        className: 'bg-brand-dark text-white hover:bg-black/90',
        onClick: () => setIsSwapDrawerOpen(true),
      });
    }

    return productActions;
  }, [product]);

  useEffect(() => {
    if (!product) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, product]);

  useEffect(() => {
    if (!product) {
      return;
    }

    const scrollY = window.scrollY;
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPosition = document.body.style.position;
    const originalBodyTop = document.body.style.top;
    const originalBodyWidth = document.body.style.width;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.position = originalBodyPosition;
      document.body.style.top = originalBodyTop;
      document.body.style.width = originalBodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [product]);

  if (!product) {
    return null;
  }

  const showPrices = product.canBuy || product.canRent;
  const canSlide = images.length > 1;
  const activeImage = images[activeImageIndex] || product.image;
  const displayCondition = product.condition.split('(')[0].trim();

  const goToPrevImage = () => {
    setActiveImageIndex((currentIndex) =>
      currentIndex === 0 ? images.length - 1 : currentIndex - 1
    );
  };

  const goToNextImage = () => {
    setActiveImageIndex((currentIndex) =>
      currentIndex === images.length - 1 ? 0 : currentIndex + 1
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center overscroll-contain md:items-center md:p-8">
      <button
        type="button"
        className="absolute inset-0 bg-black/35"
        aria-label="Tutup detail produk"
        onClick={onClose}
      />

      <div
        data-product-detail-modal
        role="dialog"
        aria-modal="true"
        aria-label={`Detail produk ${product.name}`}
        className="relative z-10 h-[100dvh] w-full overflow-y-auto overscroll-contain bg-white shadow-2xl md:h-auto md:max-h-[92vh] md:max-w-[1360px] md:overflow-hidden md:rounded-[2rem]"
      >
        <div className="sticky top-0 z-20 md:hidden flex justify-center bg-white pt-2 pb-1">
          <div className="h-1 w-20 rounded-full bg-brand-dark/10" />
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail produk"
          className="absolute right-4 top-4 z-30 flex w-10 h-10 items-center justify-center rounded-full bg-white/90 text-brand-dark shadow-sm hover:bg-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.08fr)_minmax(430px,0.92fr)] gap-6 md:gap-12 p-5 md:p-10">
          <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-[#F5F0EB] aspect-[1/1] md:aspect-[1/0.98]">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />

            {canSlide && (
              <>
                <button
                  type="button"
                  onClick={goToPrevImage}
                  aria-label="Gambar sebelumnya"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#C99547]/80 text-white flex items-center justify-center hover:bg-[#C99547]"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={goToNextImage}
                  aria-label="Gambar berikutnya"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#C99547] text-white flex items-center justify-center hover:bg-[#B38036]"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-brand-dark text-white px-3 py-1 text-xs font-bold">
              {activeImageIndex + 1}/{images.length}
            </div>
          </div>

          <div className="flex flex-col md:py-2">
            <h2 className="text-2xl md:text-[1.75rem] leading-tight font-bold text-brand-dark mb-5">
              {product.name}
            </h2>

            <p className="text-sm md:text-lg text-brand-dark/65 leading-relaxed mb-5">
              {product.description || 'Kondisi masih bagus dan sudah lama tidak dipakai.'}
            </p>

            <div className="flex items-center gap-3 mb-5">
              <span className="bg-[#FCF8F2] text-[#4A3D30] text-sm md:text-base font-bold px-4 py-2 rounded-lg">
                Size: {product.sizes[0]}
              </span>
              <span className="bg-gray-100 text-gray-400 text-sm md:text-base font-medium px-4 py-2 rounded-lg">
                {displayCondition}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm md:text-base text-brand-dark/45 mb-4">
              <div className="flex items-center gap-2">
                <IconProfile className="w-5 h-5" />
                <span>{product.owner.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <IconLocation className="w-5 h-5" />
                <span>{product.location}</span>
              </div>
            </div>

            {showPrices && (
              <div className={`flex items-center gap-4 rounded-full border border-brand-dark/10 bg-[#FCF8F2] px-5 py-3 text-sm md:text-base mb-8 ${
                product.canBuy && product.canRent ? 'justify-between' : 'justify-start'
              }`}>
                {product.canBuy && (
                  <div>
                    <span className="text-brand-dark">Beli: </span>
                    <span className="font-bold text-[#C99547]">{product.buyPrice}</span>
                  </div>
                )}
                {product.canRent && (
                  <div className="text-right">
                    <span className="text-brand-dark">Sewa: </span>
                    <span className="font-bold text-[#C99547]">{product.rentPrice}</span>
                  </div>
                )}
              </div>
            )}

            <div
              className={`grid gap-3 mb-8 ${getActionsLayout(product)}`}
            >
              {actions.map((action) =>
                action.href ? (
                  <a
                    key={action.label}
                    href={action.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex min-h-12 items-center justify-center rounded-full font-bold text-sm transition-colors md:text-base ${action.className}`}
                  >
                    {action.label}
                  </a>
                ) : (
                  <button
                    key={action.label}
                    type="button"
                    onClick={action.onClick}
                    className={`min-h-12 rounded-full font-bold text-sm md:text-base transition-colors ${action.className}`}
                  >
                    {action.label}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
      {product && (
        <SwapRequestDrawer
          isOpen={isSwapDrawerOpen}
          targetProduct={product}
          onClose={() => setIsSwapDrawerOpen(false)}
          onSuccess={() => setIsSwapSuccessOpen(true)}
        />
      )}
      {isSwapSuccessOpen && (
        <div className="fixed inset-0 z-[180] flex items-center justify-center bg-black/45 px-5 backdrop-blur-[1px]">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Request tukar berhasil"
            className="w-full max-w-[620px] rounded-sm bg-white px-7 py-9 text-center shadow-2xl md:px-16 md:py-10"
          >
            <h2 className="font-serif text-2xl font-bold tracking-wide text-brand-dark md:text-3xl">
              Request Tukar Berhasil!
            </h2>
            <p className="mx-auto mt-4 max-w-[510px] text-sm leading-relaxed text-brand-dark/70 md:text-base">
              Terima kasih sudah mengajukan swap. Tim kami akan menghubungi pemilik item dan mengabari perkembangan request kamu via WhatsApp.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsSwapSuccessOpen(false);
                onClose();
              }}
              className="mt-8 inline-flex min-h-12 min-w-32 items-center justify-center rounded-full border border-[#C99547] px-8 font-bold text-[#C99547] transition-colors hover:bg-[#FCF8F2]"
            >
              Selesai
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
