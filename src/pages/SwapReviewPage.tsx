import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { Link, useParams } from 'react-router';
import {
  acceptSwapReviewOffer,
  rejectSwapReviewOffer,
  verifySwapReviewOwner,
  type SwapReviewData,
  type SwapReviewItem,
} from '../services/swapReviewService';
import { sanitizePhoneNumberInput } from '../services/usersService';

const displayCondition = (condition: string) => condition.split('(')[0].trim();

const ReviewItemCard: React.FC<{ item: SwapReviewItem; selected?: boolean }> = ({ item, selected }) => (
  <div
    className={`h-full overflow-hidden rounded-xl border bg-white ${
      selected ? 'border-[#C99547] shadow-sm' : 'border-brand-dark/10'
    }`}
  >
    <div className="relative aspect-[3/4] bg-[#F5F0EB]">
      <div className="absolute right-2 top-2 z-10 flex gap-1">
        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-brand-dark shadow-sm">
          {item.label}
        </span>
        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-[#C99547] shadow-sm">
          {item.brandStatus}
        </span>
      </div>
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

export const SwapReviewPage: React.FC = () => {
  const { token = '' } = useParams();
  const [phone, setPhone] = useState('');
  const [reviewData, setReviewData] = useState<SwapReviewData | null>(null);
  const [selectedByRequest, setSelectedByRequest] = useState<Record<string, string>>({});
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
    <main className="min-h-screen bg-[#F5F0EB] px-4 py-8 text-brand-dark md:px-8 md:py-12">
      <div className="mx-auto max-w-[1120px]">
        <Link
          to="/collections"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-brand-dark/60 transition-colors hover:text-brand-dark"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke koleksi
        </Link>

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
            <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
              <div>
                <h2 className="mb-4 text-base font-bold text-brand-dark">Item kamu</h2>
                <ReviewItemCard item={reviewData.targetItem} />
              </div>

              <div>
                <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
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
                      const isClosed = offer.status !== 'pending_admin_review' && offer.status !== 'owner_contacted';

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
                              <p className="text-sm text-brand-dark/45">{offer.requesterCity}</p>
                            </div>
                            <span className="w-fit rounded-full bg-[#FCF8F2] px-3 py-1 text-xs font-bold text-[#C99547]">
                              {offer.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            {offer.offeredItems.map((item) => {
                              const isSelected = selectedByRequest[offer.requestId] === item.id;

                              return (
                                <button
                                  key={item.id}
                                  type="button"
                                  disabled={isClosed}
                                  onClick={() =>
                                    setSelectedByRequest((currentSelected) => ({
                                      ...currentSelected,
                                      [offer.requestId]: item.id,
                                    }))
                                  }
                                  className="text-left disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  <ReviewItemCard item={item} selected={isSelected} />
                                </button>
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
                              {actionLoadingKey === `reject:${offer.requestId}` ? 'Menolak...' : 'Tolak Offer'}
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
                              {actionLoadingKey === `accept:${offer.requestId}` ? 'Memilih...' : 'Pilih Offer Ini'}
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
  );
};
