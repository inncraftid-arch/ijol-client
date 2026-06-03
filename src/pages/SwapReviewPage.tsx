import React, { useEffect, useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, Eye, X, XCircle } from 'lucide-react';
import { useParams } from 'react-router';
import {
  acceptSwapReviewOffer,
  rejectSwapReviewOffer,
  verifySwapReviewOwner,
  type SwapReviewData,
  type SwapReviewItem,
} from '../services/swapReviewService';
import { sanitizePhoneNumberInput } from '../services/usersService';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

const displayCondition = (condition: string) => condition.split('(')[0].trim();

const formatRupiah = (value: number | null | undefined, suffix = '') => {
  if (value === null || value === undefined) {
    return '-';
  }

  return `Rp${new Intl.NumberFormat('id-ID').format(value)}${suffix}`;
};

const ReviewItemCard: React.FC<{
  item: SwapReviewItem;
  selected?: boolean;
  stretch?: boolean;
  disabled?: boolean;
  onPreview?: () => void;
  onSelect?: () => void;
}> = ({ item, selected, stretch = false, disabled = false, onPreview, onSelect }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onSelect || disabled) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect();
    }
  };

  return (
  <div
    role={onSelect ? 'button' : undefined}
    tabIndex={onSelect && !disabled ? 0 : undefined}
    onClick={disabled ? undefined : onSelect}
    onKeyDown={handleKeyDown}
    className={`${stretch ? 'h-full' : ''} overflow-hidden rounded-xl border bg-white transition-colors ${
      selected ? 'border-[#C99547] shadow-sm ring-2 ring-[#C99547]/20' : 'border-brand-dark/10'
    } ${onSelect ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C99547]' : ''} ${
      disabled ? 'cursor-not-allowed opacity-60' : ''
    }`}
  >
    <div className="relative aspect-[3/4] bg-[#F5F0EB]">
      <div className="absolute right-2 top-2 z-10 flex max-w-[calc(100%-4rem)] gap-1">
        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-brand-dark shadow-sm">
          {item.label}
        </span>
        <span className="truncate rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-[#C99547] shadow-sm">
          {item.brandStatus}
        </span>
      </div>
      {onPreview && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onPreview();
          }}
          className="absolute left-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-dark shadow-sm transition-colors hover:bg-[#FCF8F2]"
          aria-label={`Lihat detail ${item.name}`}
        >
          <Eye className="h-4 w-4" />
        </button>
      )}
      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
    </div>
    <div className="space-y-3 p-3">
      <h3 className="line-clamp-2 min-h-10 text-sm font-bold leading-snug text-brand-dark">
        {item.name}
      </h3>
      <div className="flex flex-wrap gap-1.5 text-xs">
        <span className="rounded-sm bg-[#FCF8F2] px-2 py-0.5 font-semibold text-brand-dark">
          Size: {item.size}
        </span>
        <span className="rounded-sm bg-gray-100 px-2 py-0.5 font-medium text-gray-400">
          {displayCondition(item.condition)}
        </span>
      </div>
      {(item.ownerName || item.location) && (
        <p className="truncate text-xs font-medium text-brand-dark/45">
          {[item.ownerName, item.location].filter(Boolean).join(' - ')}
        </p>
      )}
    </div>
  </div>
  );
};

const ReviewItemPreviewModal: React.FC<{
  item: SwapReviewItem | null;
  onClose: () => void;
}> = ({ item, onClose }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (!item) {
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

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.position = originalBodyPosition;
      document.body.style.top = originalBodyTop;
      document.body.style.width = originalBodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [item, onClose]);

  if (!item) {
    return null;
  }

  const images = item.images.length ? item.images : [item.image];
  const activeImage = images[activeImageIndex] || item.image;
  const canSlide = images.length > 1;

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
    <div className="fixed inset-0 z-[150] flex items-end justify-center overscroll-contain md:items-center md:p-8">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Tutup detail item"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Detail ${item.name}`}
        className="relative z-10 h-[100dvh] w-full overflow-y-auto overscroll-contain bg-white shadow-2xl md:h-auto md:max-h-[90vh] md:max-w-[980px] md:overflow-hidden md:rounded-[1.5rem]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail item"
          className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-brand-dark shadow-sm transition-colors hover:bg-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 gap-6 p-5 md:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)] md:gap-8 md:p-8">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#F5F0EB]">
              <img src={activeImage} alt={item.name} className="h-full w-full object-cover" />

              {canSlide && (
                <>
                  <button
                    type="button"
                    onClick={goToPrevImage}
                    aria-label="Gambar sebelumnya"
                    className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#C99547]/90 text-white transition-colors hover:bg-[#C99547]"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={goToNextImage}
                    aria-label="Gambar berikutnya"
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#C99547]/90 text-white transition-colors hover:bg-[#C99547]"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-dark px-3 py-1 text-xs font-bold text-white">
                {activeImageIndex + 1}/{images.length}
              </div>
            </div>

            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border ${
                      activeImageIndex === index ? 'border-[#C99547]' : 'border-brand-dark/10'
                    }`}
                    aria-label={`Lihat gambar ${index + 1}`}
                  >
                    <img src={image} alt={`${item.name} ${index + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col md:py-2">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#FCF8F2] px-3 py-1 text-xs font-bold text-[#C99547]">
                {item.label}
              </span>
              <span className="rounded-full bg-[#FCF8F2] px-3 py-1 text-xs font-bold text-brand-dark/60">
                {item.brandStatus}
              </span>
            </div>

            <h2 className="font-serif text-2xl font-bold leading-tight tracking-wide text-brand-dark md:text-3xl">
              {item.name}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-brand-dark/65">
              {item.description || 'Belum ada deskripsi tambahan untuk item ini.'}
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-[#FCF8F2] p-3">
                <dt className="text-xs font-semibold text-brand-dark/40">Size</dt>
                <dd className="mt-1 font-bold text-brand-dark">{item.size}</dd>
              </div>
              <div className="rounded-xl bg-[#FCF8F2] p-3">
                <dt className="text-xs font-semibold text-brand-dark/40">Kondisi</dt>
                <dd className="mt-1 font-bold text-brand-dark">{displayCondition(item.condition)}</dd>
              </div>
              <div className="rounded-xl bg-[#FCF8F2] p-3">
                <dt className="text-xs font-semibold text-brand-dark/40">Kategori</dt>
                <dd className="mt-1 font-bold text-brand-dark">{item.itemCategory || '-'}</dd>
              </div>
              <div className="rounded-xl bg-[#FCF8F2] p-3">
                <dt className="text-xs font-semibold text-brand-dark/40">Gender</dt>
                <dd className="mt-1 font-bold capitalize text-brand-dark">{item.categoryGender || '-'}</dd>
              </div>
              <div className="rounded-xl bg-[#FCF8F2] p-3">
                <dt className="text-xs font-semibold text-brand-dark/40">Brand</dt>
                <dd className="mt-1 font-bold text-brand-dark">{item.brand || item.brandStatus}</dd>
              </div>
              <div className="rounded-xl bg-[#FCF8F2] p-3">
                <dt className="text-xs font-semibold text-brand-dark/40">Domisili</dt>
                <dd className="mt-1 font-bold text-brand-dark">{item.location || '-'}</dd>
              </div>
            </dl>

            {(item.canBuy || item.canRent) && (
              <div className="mt-5 rounded-2xl border border-brand-dark/10 bg-white p-4 text-sm">
                <h3 className="font-bold text-brand-dark">Opsi item</h3>
                <div className="mt-3 flex flex-wrap gap-3">
                  {item.canBuy && (
                    <span className="rounded-full bg-[#FCF8F2] px-4 py-2 font-semibold text-brand-dark">
                      Beli: <strong className="text-[#C99547]">{formatRupiah(item.buyPrice)}</strong>
                    </span>
                  )}
                  {item.canRent && (
                    <span className="rounded-full bg-[#FCF8F2] px-4 py-2 font-semibold text-brand-dark">
                      Sewa: <strong className="text-[#C99547]">{formatRupiah(item.rentPrice, '/hari')}</strong>
                    </span>
                  )}
                </div>
              </div>
            )}

            {(item.ownerName || item.location) && (
              <p className="mt-auto pt-6 text-xs font-semibold text-brand-dark/40">
                {[item.ownerName, item.location].filter(Boolean).join(' - ')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const SwapReviewPage: React.FC = () => {
  const { token = '' } = useParams();
  const [phone, setPhone] = useState('');
  const [reviewData, setReviewData] = useState<SwapReviewData | null>(null);
  const [selectedByRequest, setSelectedByRequest] = useState<Record<string, string>>({});
  const [previewItem, setPreviewItem] = useState<SwapReviewItem | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [actionLoadingKey, setActionLoadingKey] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleVerify = async () => {
    setIsVerifying(true);
    setError('');
    setMessage('');

    try {
      const data = await verifySwapReviewOwner(token, phone);
      setReviewData(data);
      setMessage(data.message || 'Nomor terverifikasi. Silakan review offer yang masuk.');
    } catch (verifyError) {
      setReviewData(null);
      setError(verifyError instanceof Error ? verifyError.message : 'Gagal memverifikasi nomor.');
    } finally {
      setIsVerifying(false);
    }
  };

  const refreshReview = async () => {
    const data = await verifySwapReviewOwner(token, phone);
    setReviewData(data);
    return data;
  };

  const handleAccept = async (requestId: string) => {
    const selectedOfferedItemId = selectedByRequest[requestId];

    if (!selectedOfferedItemId) {
      setError('Pilih salah satu item yang ingin kamu terima dari offer ini.');
      return;
    }

    setActionLoadingKey(`accept:${requestId}`);
    setError('');
    setMessage('');

    try {
      await acceptSwapReviewOffer({
        token,
        phone,
        requestId,
        selectedOfferedItemId,
      });
      await refreshReview();
      setMessage('Offer berhasil dipilih. Tim IJOL akan menghubungi kamu via WhatsApp.');
    } catch (acceptError) {
      setError(acceptError instanceof Error ? acceptError.message : 'Gagal memilih offer.');
    } finally {
      setActionLoadingKey('');
    }
  };

  const handleReject = async (requestId: string) => {
    setActionLoadingKey(`reject:${requestId}`);
    setError('');
    setMessage('');

    try {
      await rejectSwapReviewOffer({ token, phone, requestId });
      await refreshReview();
      setMessage('Offer berhasil ditolak.');
    } catch (rejectError) {
      setError(rejectError instanceof Error ? rejectError.message : 'Gagal menolak offer.');
    } finally {
      setActionLoadingKey('');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F0EB] font-sans text-brand-dark">
      <Navbar />

      <main className="grow px-4 pb-12 pt-32 md:px-8 md:pb-16 md:pt-36">
        <div className="mx-auto max-w-[1120px]">
          <section className="rounded-2xl border border-brand-dark/10 bg-white p-6 shadow-sm md:p-10">
            <div className="max-w-2xl">
              <h1 className="font-serif text-3xl font-bold tracking-wide text-brand-dark md:text-4xl">
                Review Offer Swap
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-brand-dark/60 md:text-base">
                Masukkan nomor WhatsApp yang kamu gunakan saat upload item. Offer hanya akan tampil
                jika nomor sesuai dengan pemilik item.
              </p>
            </div>

            <div className="mt-7 flex max-w-2xl flex-col gap-3 sm:flex-row sm:items-start">
              <div className="min-w-0 flex-1">
                <div className="relative pt-2">
                  <span className="absolute left-5 top-2 z-10 -translate-y-1/2 bg-white px-2 text-sm font-medium text-brand-dark">
                    Nomor WhatsApp*
                  </span>
                  <input
                    value={phone}
                    inputMode="tel"
                    maxLength={14}
                    onChange={(event) => setPhone(sanitizePhoneNumberInput(event.target.value))}
                    placeholder="Contoh: 081234567890"
                    className="w-full rounded-full border border-brand-dark/15 bg-white px-5 py-3 text-sm text-brand-dark outline-none transition-colors placeholder:text-brand-dark/30 focus:border-brand-gold"
                  />
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-brand-dark/35">
                  Gunakan nomor yang sama dengan nomor saat upload item.
                </p>
              </div>
              <button
                type="button"
                onClick={() => void handleVerify()}
                disabled={isVerifying}
                className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-brand-dark px-7 text-sm font-bold text-white transition-colors hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-50 sm:mt-2"
              >
                {isVerifying ? 'Memeriksa...' : 'Lihat Offer'}
              </button>
            </div>

            {(message || error) && (
              <div
                className={`mt-5 rounded-2xl border p-4 text-sm font-semibold ${
                  error
                    ? 'border-red-100 bg-red-50 text-red-800'
                    : 'border-green-100 bg-green-50 text-green-800'
                }`}
              >
                {error || message}
              </div>
            )}
          </section>

          {reviewData && (
            <section className="mt-8 rounded-2xl border border-brand-dark/10 bg-white p-6 shadow-sm md:p-10">
              <div className="grid items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]">
                <aside className="self-start lg:sticky lg:top-32">
                  <div className="mb-5 min-h-[68px]">
                    <h2 className="text-xl font-bold text-brand-dark">Item kamu</h2>
                  </div>
                  <ReviewItemCard
                    item={reviewData.targetItem}
                    onPreview={() => setPreviewItem(reviewData.targetItem)}
                  />
                </aside>

                <div>
                  <div className="mb-5 flex min-h-[68px] flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-brand-dark">Offer masuk</h2>
                      <p className="mt-1 text-sm text-brand-dark/45">
                        Pilih salah satu item dari offer yang kamu sukai, atau tolak offer-nya.
                      </p>
                    </div>
                    <span className="text-sm font-bold text-[#C99547]">
                      {reviewData.offers.length} offer
                    </span>
                  </div>

                  {reviewData.offers.length === 0 ? (
                    <div className="rounded-2xl border border-brand-dark/10 bg-[#FCF8F2] p-5 text-sm text-brand-dark/60">
                      Belum ada offer aktif untuk item ini.
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {reviewData.offers.map((offer) => {
                        const isClosed =
                          offer.status !== 'pending_admin_review' &&
                          offer.status !== 'owner_contacted';

                        return (
                          <article
                            key={offer.requestId}
                            className="rounded-2xl border border-brand-dark/10 p-4 md:p-5"
                          >
                            <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                              <div>
                                <h3 className="font-bold text-brand-dark">
                                  Offer dari {offer.requesterName}
                                </h3>
                                <p className="text-sm text-brand-dark/45">
                                  {offer.requesterCity}
                                </p>
                              </div>
                              <span className="w-fit rounded-full bg-[#FCF8F2] px-3 py-1 text-xs font-bold text-[#C99547]">
                                {offer.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                              {offer.offeredItems.map((item) => {
                                const isSelected = selectedByRequest[offer.requestId] === item.id;

                                return (
                                  <ReviewItemCard
                                    key={item.id}
                                    item={item}
                                    selected={isSelected}
                                    disabled={isClosed}
                                    stretch
                                    onSelect={() =>
                                      setSelectedByRequest((currentSelected) => ({
                                        ...currentSelected,
                                        [offer.requestId]: item.id,
                                      }))
                                    }
                                    onPreview={() => setPreviewItem(item)}
                                  />
                                );
                              })}
                            </div>

                            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
                              <button
                                type="button"
                                disabled={isClosed || Boolean(actionLoadingKey)}
                                onClick={() => void handleReject(offer.requestId)}
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-red-200 px-5 text-sm font-bold text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <XCircle className="h-4 w-4" />
                                {actionLoadingKey === `reject:${offer.requestId}`
                                  ? 'Menolak...'
                                  : 'Tolak Offer'}
                              </button>
                              <button
                                type="button"
                                disabled={
                                  isClosed ||
                                  Boolean(actionLoadingKey) ||
                                  !selectedByRequest[offer.requestId]
                                }
                                onClick={() => void handleAccept(offer.requestId)}
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-dark px-5 text-sm font-bold text-white transition-colors hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                {actionLoadingKey === `accept:${offer.requestId}`
                                  ? 'Memilih...'
                                  : 'Pilih Offer Ini'}
                              </button>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
      <ReviewItemPreviewModal
        key={previewItem?.id || 'empty-preview'}
        item={previewItem}
        onClose={() => setPreviewItem(null)}
      />
    </div>
  );
};
