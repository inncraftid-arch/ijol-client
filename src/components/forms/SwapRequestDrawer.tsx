import React, { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Search, X } from 'lucide-react';
import type { Product } from '../../types';
import { ProductCard } from '../ui/ProductCard';
import {
  findExistingUploadUserByPhone,
  sanitizePhoneNumberInput,
  type ExistingUploadUser,
} from '../../services/usersService';
import {
  createSwapRequest,
  fetchUserSwapCatalog,
  type UserSwapCatalogResult,
} from '../../services/swapRequestService';

type SwapRequestDrawerProps = {
  isOpen: boolean;
  targetProduct: Product;
  onClose: () => void;
  onSuccess?: () => void;
};

type UserMode = 'existing' | 'new';
type LookupStatus = 'idle' | 'checking' | 'found' | 'not-found' | 'error';
type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const openUploadDrawer = () => {
  window.dispatchEvent(new CustomEvent('ijol:open-upload-drawer'));
};

export const SwapRequestDrawer: React.FC<SwapRequestDrawerProps> = ({
  isOpen,
  targetProduct,
  onClose,
  onSuccess,
}) => {
  const [userMode, setUserMode] = useState<UserMode>('existing');
  const [phoneLookup, setPhoneLookup] = useState('');
  const [lookupStatus, setLookupStatus] = useState<LookupStatus>('idle');
  const [lookupMessage, setLookupMessage] = useState('');
  const [foundUser, setFoundUser] = useState<ExistingUploadUser | null>(null);
  const [catalogResult, setCatalogResult] = useState<UserSwapCatalogResult>({
    approvedItems: [],
    pendingQcCount: 0,
  });
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const resetLookup = () => {
    setPhoneLookup('');
    setLookupStatus('idle');
    setLookupMessage('');
    setFoundUser(null);
    setCatalogResult({ approvedItems: [], pendingQcCount: 0 });
    setSelectedItemIds([]);
    setSubmitStatus('idle');
    setSubmitMessage('');
    setIsConfirmOpen(false);
  };

  const closeDrawer = useCallback(() => {
    resetLookup();
    setUserMode('existing');
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDrawer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeDrawer, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleLookup = async () => {
    const sanitizedPhone = sanitizePhoneNumberInput(phoneLookup);

    setLookupStatus('checking');
    setLookupMessage('Mengecek nomor...');
    setFoundUser(null);
    setCatalogResult({ approvedItems: [], pendingQcCount: 0 });
    setSelectedItemIds([]);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      const user = await findExistingUploadUserByPhone(sanitizedPhone);

      if (!user) {
        setLookupStatus('not-found');
        setLookupMessage('Nomor belum terdaftar. Upload pakaian terlebih dahulu untuk bisa request swap.');
        return;
      }

      if (targetProduct.userId && user.id === targetProduct.userId) {
        setLookupStatus('error');
        setLookupMessage('Kamu tidak bisa mengajukan tukar untuk item milikmu sendiri.');
        return;
      }

      setLookupStatus('found');
      setLookupMessage('Nomor ditemukan. Informasi katalog milikmu sedang dimuat.');
      setFoundUser(user);
      setIsLoadingItems(true);

      const result = await fetchUserSwapCatalog(user.id, targetProduct.id);
      setCatalogResult(result);
      setLookupMessage('Nomor ditemukan. Pilih pakaian approved yang ingin kamu tawarkan.');
    } catch (error) {
      setLookupStatus('error');
      setLookupMessage(error instanceof Error ? error.message : 'Gagal mengecek nomor.');
    } finally {
      setIsLoadingItems(false);
    }
  };

  const toggleSelectedItem = (itemId: string) => {
    setSubmitStatus('idle');
    setSubmitMessage('');
    setSelectedItemIds((currentIds) =>
      currentIds.includes(itemId)
        ? currentIds.filter((currentId) => currentId !== itemId)
        : [...currentIds, itemId]
    );
  };

  const handleSubmit = async () => {
    if (!foundUser || !selectedItemIds.length || submitStatus === 'submitting') {
      return;
    }

    setIsConfirmOpen(false);
    setSubmitStatus('submitting');
    setSubmitMessage('Mengirim request swap...');

    try {
      await createSwapRequest({
        targetItemId: targetProduct.id,
        targetOwnerUserId: targetProduct.userId || '',
        requesterUserId: foundUser.id,
        offeredItemIds: selectedItemIds,
      });
      closeDrawer();
      onSuccess?.();
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage(error instanceof Error ? error.message : 'Gagal mengirim request swap.');
    }
  };

  const hasApprovedItems = catalogResult.approvedItems.length > 0;

  return (
    <div className="fixed inset-0 z-[170] flex justify-end overscroll-contain bg-black/35">
      <button
        type="button"
        className="absolute inset-0 hidden md:block"
        aria-label="Tutup request tukar"
        onClick={closeDrawer}
      />

      <aside className="relative z-10 flex h-[100dvh] w-full flex-col overflow-hidden overscroll-contain bg-white text-brand-dark shadow-2xl md:max-w-[760px] md:border-l md:border-brand-dark/10">
        <div className="flex items-start justify-between gap-4 border-b border-brand-dark/10 px-6 py-5 md:px-10 md:py-8">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-wide text-brand-dark md:text-4xl">
              Request Tukar Pakaianmu
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-brand-dark/70 md:text-base">
              Kamu tertarik dengan item ini? Isi form ini untuk mengajukan swap.
            </p>
            <p className="mt-2 text-xs italic leading-relaxed text-brand-dark/35 md:text-sm">
              Kamu tidak perlu bayar dulu, proses pembayaran admin fee hanya dilakukan jika pemilik item menyetujui requestmu.
            </p>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-dark/15 text-brand-dark hover:bg-[#FCF8F2]"
            aria-label="Tutup request tukar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-6 md:px-10 md:py-8">
          <section className="space-y-4">
            <h2 className="text-base font-bold text-brand-dark">Item yang kamu inginkan</h2>
            <div className="w-44">
              <ProductCard product={targetProduct} variant="compact" />
            </div>
          </section>

          <div className="my-8 h-px bg-brand-dark/10" />

          <section className="space-y-5">
            <h2 className="text-base font-bold text-brand-dark">Pilih Pakaian untuk ditukar</h2>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {[
                {
                  value: 'existing' as const,
                  label: 'Sudah pernah upload',
                  helper: 'Cek nomor WhatsApp, lalu IJOL akan menampilkan katalog milikmu sebelumnya.',
                },
                {
                  value: 'new' as const,
                  label: 'Pengguna Baru',
                  helper: 'Isi data pribadi seperti biasa untuk membuat data pengguna baru.',
                },
              ].map((option) => {
                const isSelected = userMode === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setUserMode(option.value);
                      resetLookup();
                    }}
                    className={`min-h-20 rounded-2xl border px-5 py-4 text-left transition-colors ${
                      isSelected
                        ? 'border-[#C99547] bg-[#FCF8F2]'
                        : 'border-brand-dark/10 bg-white hover:border-brand-gold'
                    }`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-sm font-bold">{option.label}</span>
                      {isSelected && <CheckCircle2 className="h-5 w-5 text-[#C99547]" />}
                    </span>
                    <span className="mt-2 block text-xs leading-relaxed text-brand-dark/40">
                      {option.helper}
                    </span>
                  </button>
                );
              })}
            </div>

            {userMode === 'new' ? (
              <div className="rounded-2xl border border-[#C99547]/30 bg-[#FCF8F2] p-5">
                <h3 className="text-sm font-bold text-brand-dark">Upload pakaian dulu ya</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-dark/60">
                  Untuk request swap, kamu perlu punya minimal satu item yang sudah approved di katalog IJOL.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    closeDrawer();
                    openUploadDrawer();
                  }}
                  className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-brand-dark px-6 text-sm font-bold text-white hover:bg-black/90"
                >
                  Upload Pakaian Dulu
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3 rounded-2xl border border-brand-dark/10 bg-white p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                    <div className="min-w-0 flex-1">
                      <div className="relative pt-2">
                        <span className="absolute left-5 top-2 z-10 -translate-y-1/2 bg-white px-2 text-sm font-medium text-brand-dark">
                          Cek Nomor WhatsApp*
                        </span>
                        <input
                          className="w-full rounded-full border border-brand-dark/15 bg-white px-5 py-3 text-sm text-brand-dark outline-none transition-colors placeholder:text-brand-dark/30 focus:border-brand-gold"
                          value={phoneLookup}
                          inputMode="tel"
                          maxLength={14}
                          placeholder="Contoh: 081234567890"
                          onChange={(event) => {
                            setPhoneLookup(sanitizePhoneNumberInput(event.target.value));
                            setLookupStatus('idle');
                            setLookupMessage('');
                            setFoundUser(null);
                            setCatalogResult({ approvedItems: [], pendingQcCount: 0 });
                            setSelectedItemIds([]);
                            setSubmitStatus('idle');
                            setSubmitMessage('');
                          }}
                        />
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-brand-dark/35">
                        Masukkan nomor yang sama dengan upload sebelumnya.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void handleLookup()}
                      disabled={lookupStatus === 'checking'}
                      className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-brand-dark px-6 text-sm font-bold text-white hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-40 sm:mt-2"
                    >
                      <Search className="h-4 w-4" />
                      {lookupStatus === 'checking' ? 'Mengecek...' : 'Cek nomor'}
                    </button>
                  </div>
                  {lookupMessage && (
                    <p
                      className={`text-xs leading-relaxed ${
                        lookupStatus === 'found' ? 'text-green-700' : 'text-red-600'
                      }`}
                    >
                      {lookupMessage}
                    </p>
                  )}
                </div>

                {isLoadingItems && (
                  <p className="text-sm font-semibold text-brand-dark/50">Mengambil item milikmu...</p>
                )}

                {lookupStatus === 'found' && !isLoadingItems && (
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-brand-dark">
                      Item milikmu <span className="font-normal text-brand-dark/40">(Pilih salah satu atau beberapa)</span>
                    </h3>

                    {hasApprovedItems ? (
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                        {catalogResult.approvedItems.map((item) => {
                          const isSelected = selectedItemIds.includes(item.id);

                          return (
                            <div
                              key={item.id}
                              role="button"
                              tabIndex={0}
                              onClick={() => toggleSelectedItem(item.id)}
                              onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                  event.preventDefault();
                                  toggleSelectedItem(item.id);
                                }
                              }}
                              className={`rounded-xl border-2 bg-white text-left transition-colors ${
                                isSelected
                                  ? 'border-[#C99547] shadow-sm'
                                  : 'border-transparent hover:border-brand-dark/10'
                              }`}
                            >
                              <ProductCard product={item} variant="compact" />
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-brand-dark/10 bg-[#FCF8F2] p-5 text-sm leading-relaxed text-brand-dark/65">
                        <p className="font-bold text-brand-dark">Belum ada item approved yang bisa ditukar.</p>
                        <p className="mt-2">
                          Item kamu yang masih dalam proses QC: <strong>{catalogResult.pendingQcCount}</strong>.
                        </p>
                        <p className="mt-2">
                          Setelah item approved, kamu bisa menggunakannya untuk mengajukan swap.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {submitMessage && (
              <div
                className={`rounded-2xl border p-4 text-sm font-semibold ${
                  submitStatus === 'error'
                      ? 'border-red-100 bg-red-50 text-red-800'
                      : 'border-brand-dark/10 bg-[#FCF8F2] text-brand-dark/60'
                }`}
              >
                {submitMessage}
              </div>
            )}
          </section>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-brand-dark/10 bg-white px-6 py-4 md:px-10 md:py-6">
          <button
            type="button"
            onClick={closeDrawer}
            disabled={submitStatus === 'submitting'}
            className="inline-flex min-h-12 min-w-28 items-center justify-center rounded-full border border-[#C99547] px-7 font-bold text-[#C99547] hover:bg-[#FCF8F2] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => setIsConfirmOpen(true)}
            disabled={!foundUser || !selectedItemIds.length || submitStatus === 'submitting' || submitStatus === 'success'}
            className="inline-flex min-h-12 min-w-36 items-center justify-center rounded-full bg-brand-dark px-7 font-bold text-white hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitStatus === 'submitting' ? 'Mengirim...' : 'Ajukan Tukar'}
          </button>
        </div>

        {isConfirmOpen && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/35 px-5">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#FCF8F2] text-[#C99547]">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-brand-dark">Konfirmasi request tukar</h2>
              <p className="mt-2 text-sm leading-relaxed text-brand-dark/60">
                Pastikan item yang kamu inginkan dan pakaian yang kamu tawarkan sudah benar. Tim IJOL akan menghubungi pemilik item lewat WhatsApp setelah request dikirim.
              </p>
              <div className="mt-5 rounded-xl bg-[#FCF8F2] px-4 py-3 text-sm text-brand-dark/70">
                <p>
                  Item ditawarkan: <strong>{selectedItemIds.length}</strong>
                </p>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsConfirmOpen(false)}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#C99547] px-5 text-sm font-bold text-[#C99547] hover:bg-[#FCF8F2]"
                >
                  Cek lagi
                </button>
                <button
                  type="button"
                  onClick={() => void handleSubmit()}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-dark px-5 text-sm font-bold text-white hover:bg-black/90"
                >
                  Kirim request
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
