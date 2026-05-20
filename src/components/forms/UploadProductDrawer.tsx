import React, { useCallback, useEffect, useState } from 'react';
import { ImageIcon, Trash2, X } from 'lucide-react';
import { submitUploadProduct } from '../../services/uploadProductService';
import type { UploadProductFile, UploadProductFormData } from '../../services/uploadProductService';

type ProofKind = 'Label' | 'Tag' | 'Nota';

type UploadPreview = {
  id: string;
  name: string;
  url: string;
  file: File;
  proofKind?: ProofKind;
};

type UploadProductDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

type FormValues = {
  fullName: string;
  whatsapp: string;
  city: string;
  itemName: string;
  category: string;
  brandStatus: '' | 'branded' | 'non-branded';
  brand: string;
  size: string;
  condition: string;
  description: string;
  buyPrice: string;
  rentPrice: string;
};

const initialFormValues: FormValues = {
  fullName: '',
  whatsapp: '',
  city: '',
  itemName: '',
  category: '',
  brandStatus: '',
  brand: '',
  size: '',
  condition: '',
  description: '',
  buyPrice: '',
  rentPrice: '',
};

const createUploadPreviews = (files: FileList | null): UploadPreview[] => {
  if (!files) {
    return [];
  }

  return Array.from(files).map((file) => ({
    id: `${file.name}-${file.lastModified}-${Math.random().toString(16).slice(2)}`,
    name: file.name,
    url: URL.createObjectURL(file),
    file,
  }));
};

const appendUploadPreviews = (
  currentPreviews: UploadPreview[],
  nextPreviews: UploadPreview[],
  maxFiles = 7
) => {
  const mergedPreviews = [...currentPreviews, ...nextPreviews];
  const keptPreviews = mergedPreviews.slice(0, maxFiles);
  const droppedPreviews = mergedPreviews.slice(maxFiles);

  droppedPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));

  return keptPreviews;
};

const formatThousands = (value: string) => {
  const numericValue = value.replace(/\D/g, '');

  if (!numericValue) {
    return '';
  }

  return new Intl.NumberFormat('id-ID').format(Number(numericValue));
};

const FieldLabel: React.FC<{ label: string; helper?: string; children: React.ReactNode }> = ({
  label,
  helper,
  children,
}) => (
  <label className="block">
    <span className="block text-sm font-medium text-brand-dark mb-1">{label}</span>
    {children}
    {helper && <span className="block mt-1.5 text-xs text-brand-dark/35">{helper}</span>}
  </label>
);

const inputClass =
  'w-full rounded-full border border-brand-dark/15 bg-white px-5 py-3 text-sm text-brand-dark outline-none transition-colors placeholder:text-brand-dark/30 focus:border-brand-gold';

const selectClass =
  'w-full rounded-full border border-brand-dark/15 bg-white px-5 py-3 text-sm text-brand-dark outline-none transition-colors focus:border-brand-gold';

const Toggle: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; label: string; helper: string }> = ({
  checked,
  onChange,
  label,
  helper,
}) => (
  <div className="flex items-start justify-between gap-4">
    <div>
      <h3 className="text-base font-bold text-brand-dark">{label}</h3>
      <p className="text-xs text-brand-dark/40 leading-relaxed">{helper}</p>
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${checked ? 'bg-[#C99547]' : 'bg-brand-dark/15'}`}
      aria-pressed={checked}
    >
      <span
        className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

export const UploadProductDrawer: React.FC<UploadProductDrawerProps> = ({ isOpen, onClose }) => {
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
  const [isPreLoved, setIsPreLoved] = useState(false);
  const [isRental, setIsRental] = useState(false);
  const [selectedProofKind, setSelectedProofKind] = useState<ProofKind>('Label');
  const [itemPhotos, setItemPhotos] = useState<UploadPreview[]>([]);
  const [brandProofs, setBrandProofs] = useState<UploadPreview[]>([]);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const isBranded = formValues.brandStatus === 'branded';
  const personalComplete = Boolean(
    formValues.fullName.trim() && formValues.whatsapp.trim() && formValues.city
  );
  const clothingComplete = Boolean(
    formValues.itemName.trim() &&
      formValues.category &&
      formValues.brandStatus &&
      (!isBranded || formValues.brand.trim()) &&
      formValues.size.trim() &&
      formValues.condition &&
      formValues.description.trim()
  );
  const mediaComplete = itemPhotos.length >= 3;
  const listingComplete = Boolean(
    (!isPreLoved || formValues.buyPrice.trim()) && (!isRental || formValues.rentPrice.trim())
  );
  const formComplete = personalComplete && clothingComplete && mediaComplete && listingComplete;
  const isSubmitting = submitStatus === 'submitting';

  const closeDrawer = useCallback(() => {
    itemPhotos.forEach((photo) => URL.revokeObjectURL(photo.url));
    brandProofs.forEach((proof) => URL.revokeObjectURL(proof.url));
    setFormValues(initialFormValues);
    setIsPreLoved(false);
    setIsRental(false);
    setSelectedProofKind('Label');
    setItemPhotos([]);
    setBrandProofs([]);
    setSubmitStatus('idle');
    setSubmitMessage('');
    onClose();
  }, [brandProofs, itemPhotos, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDrawer();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeDrawer, isOpen]);

  if (!isOpen) {
    return null;
  }

  const updateField = (field: keyof FormValues, value: string) => {
    setSubmitStatus('idle');
    setSubmitMessage('');
    setFormValues((currentValues) => ({ ...currentValues, [field]: value }));
  };

  const addItemPhotos = (files: FileList | null) => {
    const nextPreviews = createUploadPreviews(files);
    setSubmitStatus('idle');
    setSubmitMessage('');
    setItemPhotos((currentPhotos) => appendUploadPreviews(currentPhotos, nextPreviews));
  };

  const addBrandProofs = (files: FileList | null) => {
    const nextPreviews = createUploadPreviews(files).map((preview) => ({
      ...preview,
      proofKind: selectedProofKind,
    }));
    setSubmitStatus('idle');
    setSubmitMessage('');
    setBrandProofs((currentProofs) => appendUploadPreviews(currentProofs, nextPreviews));
  };

  const removeItemPhoto = (id: string) => {
    setItemPhotos((currentPhotos) => {
      const removedPhoto = currentPhotos.find((photo) => photo.id === id);
      if (removedPhoto) {
        URL.revokeObjectURL(removedPhoto.url);
      }

      return currentPhotos.filter((photo) => photo.id !== id);
    });
  };

  const removeBrandProof = (id: string) => {
    setBrandProofs((currentProofs) => {
      const removedProof = currentProofs.find((proof) => proof.id === id);
      if (removedProof) {
        URL.revokeObjectURL(removedProof.url);
      }

      return currentProofs.filter((proof) => proof.id !== id);
    });
  };

  const updateProofKind = (id: string, proofKind: ProofKind) => {
    setSubmitStatus('idle');
    setSubmitMessage('');
    setBrandProofs((currentProofs) =>
      currentProofs.map((proof) => (proof.id === id ? { ...proof, proofKind } : proof))
    );
  };

  const buildUploadFiles = (previews: UploadPreview[]): UploadProductFile[] =>
    previews.map((preview) => ({
      file: preview.file,
      proofKind: preview.proofKind,
    }));

  const buildSubmissionPayload = (): UploadProductFormData => ({
    fullName: formValues.fullName.trim(),
    whatsapp: formValues.whatsapp.trim(),
    city: formValues.city,
    itemName: formValues.itemName.trim(),
    categoryGender: 'unisex',
    category: formValues.category,
    isBranded,
    brand: isBranded ? formValues.brand.trim() : undefined,
    size: formValues.size.trim(),
    condition: formValues.condition,
    description: formValues.description.trim(),
    isPreLoved,
    buyPrice: isPreLoved ? formValues.buyPrice : undefined,
    isRental,
    rentPrice: isRental ? formValues.rentPrice : undefined,
    itemPhotos: buildUploadFiles(itemPhotos),
    brandProofs: isBranded ? buildUploadFiles(brandProofs) : [],
  });

  const handleSubmit = async () => {
    if (!formComplete || isSubmitting) {
      return;
    }

    setSubmitStatus('submitting');
    setSubmitMessage('Mengupload gambar ke AWS dan menyimpan data ke Supabase...');

    try {
      await submitUploadProduct(buildSubmissionPayload());
      setSubmitStatus('success');
      setSubmitMessage('Pakaian berhasil dikirim untuk review QC.');
      window.setTimeout(closeDrawer, 900);
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage(error instanceof Error ? error.message : 'Upload gagal. Coba lagi sebentar.');
    }
  };

  const renderPersonalSection = () => (
    <section className="space-y-5">
      <h2 className="text-lg font-bold text-brand-dark">Informasi Pribadi</h2>
      <FieldLabel label="Nama Lengkap*" helper="Nama kamu akan tampil di info pakaian sebagai pemilik.">
        <input
          className={inputClass}
          value={formValues.fullName}
          onChange={(event) => updateField('fullName', event.target.value)}
        />
      </FieldLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FieldLabel label="Nomor WhatsApp aktif*" helper="Kami akan hubungi via WA untuk konfirmasi QC dan permintaan swap/beli.">
          <input
            className={inputClass}
            value={formValues.whatsapp}
            inputMode="tel"
            onChange={(event) => updateField('whatsapp', event.target.value)}
          />
        </FieldLabel>
        <FieldLabel label="Kota Domisili*" helper="Domisili membantu pakaianmu ditemukan pengguna terdekat.">
          <select
            className={selectClass}
            value={formValues.city}
            onChange={(event) => updateField('city', event.target.value)}
          >
            <option value="" disabled>Pilih kota domisili</option>
            <option>Kebon Jeruk</option>
            <option>Serpong</option>
            <option>Bekasi</option>
            <option>Jakarta Selatan</option>
          </select>
        </FieldLabel>
      </div>
    </section>
  );

  const renderClothingSection = () => (
    <section className="space-y-5">
      <h2 className="text-lg font-bold text-brand-dark">Informasi Pakaian</h2>
      <FieldLabel label="Nama item*" helper="Contoh: Kemeja flannel kotak-kotak, Kaos Oversize, Celana jeans slim fit hitam">
        <input
          className={inputClass}
          value={formValues.itemName}
          onChange={(event) => updateField('itemName', event.target.value)}
        />
      </FieldLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FieldLabel label="Kategori*">
          <select
            className={selectClass}
            value={formValues.category}
            onChange={(event) => updateField('category', event.target.value)}
          >
            <option value="" disabled>Pilih kategori</option>
            <option>Outer (jaket, blazer, cardigan, dll)</option>
            <option>Atasan</option>
            <option>Bawahan</option>
            <option>Dress</option>
          </select>
        </FieldLabel>
        <FieldLabel label="Apakah ini item branded?*">
          <select
            className={selectClass}
            value={formValues.brandStatus}
            onChange={(event) => {
              updateField('brandStatus', event.target.value);
              if (event.target.value === 'non-branded') {
                updateField('brand', '');
                setBrandProofs((currentProofs) => {
                  currentProofs.forEach((proof) => URL.revokeObjectURL(proof.url));
                  return [];
                });
              }
            }}
          >
            <option value="" disabled>Pilih status brand</option>
            <option value="branded">Ya - branded</option>
            <option value="non-branded">Tidak - non branded</option>
          </select>
        </FieldLabel>
      </div>
      {isBranded && (
        <FieldLabel label="Brand*">
          <input
            className={inputClass}
            value={formValues.brand}
            onChange={(event) => updateField('brand', event.target.value)}
          />
        </FieldLabel>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FieldLabel label="Ukuran*" helper="Contoh: S, M, L, XL, 30, 32, 38, Free Size">
          <input
            className={inputClass}
            value={formValues.size}
            onChange={(event) => updateField('size', event.target.value)}
          />
        </FieldLabel>
        <FieldLabel label="Kondisi item*">
          <select
            className={selectClass}
            value={formValues.condition}
            onChange={(event) => updateField('condition', event.target.value)}
          >
            <option value="" disabled>Pilih kondisi item</option>
            <option>Baik - beberapa kali pakai, tidak ada cacat besar</option>
            <option>Sangat baik - jarang dipakai</option>
            <option>Cukup - ada detail pemakaian</option>
          </select>
        </FieldLabel>
      </div>
      <FieldLabel label="Deskripsi*" helper="Ceritakan detail item: warna, bahan, kondisi detail, alasan tidak dipakai, dll.">
        <textarea
          className="min-h-28 w-full rounded-3xl border border-brand-dark/15 bg-white px-5 py-3 text-sm text-brand-dark outline-none transition-colors placeholder:text-brand-dark/30 focus:border-brand-gold"
          value={formValues.description}
          onChange={(event) => updateField('description', event.target.value)}
        />
      </FieldLabel>
    </section>
  );

  const renderUploader = (
    previews: UploadPreview[],
    onAdd: (files: FileList | null) => void,
    onRemove: (id: string) => void,
    options?: { proof?: boolean }
  ) => (
    <div className="flex flex-wrap gap-3">
      <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-brand-dark/20 bg-white text-brand-dark/70 hover:border-brand-gold">
        <ImageIcon className="mb-2 h-5 w-5" />
        <span className="text-sm font-medium">Browse</span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => {
            onAdd(event.target.files);
            event.currentTarget.value = '';
          }}
        />
      </label>
      {previews.map((preview) => (
        <div key={preview.id} className="relative w-24">
          <div className="h-24 w-24 overflow-hidden rounded-xl bg-[#F5F0EB]">
            <img src={preview.url} alt={preview.name} className="h-full w-full object-cover" />
          </div>
          <button
            type="button"
            onClick={() => onRemove(preview.id)}
            className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-red-600 shadow-md"
            aria-label="Hapus file"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          {options?.proof && (
            <select
              className="mt-2 w-full rounded-lg border border-brand-dark/15 bg-white px-2 py-1 text-xs text-brand-dark"
              value={preview.proofKind}
              onChange={(event) => updateProofKind(preview.id, event.target.value as ProofKind)}
            >
              <option>Label</option>
              <option>Tag</option>
              <option>Nota</option>
            </select>
          )}
        </div>
      ))}
    </div>
  );

  const renderMediaSection = () => (
    <section className="space-y-7">
      <div>
        <h2 className="text-lg font-bold text-brand-dark">Foto Item*</h2>
        <p className="mb-3 text-xs text-brand-dark/40">
          Upload minimal 3 foto: tampak depan, tampak belakang, dan detail kondisi. Maksimal 7 foto, max 5MB per foto.
        </p>
        {renderUploader(itemPhotos, addItemPhotos, removeItemPhoto)}
      </div>
      {isBranded && (
        <div>
          <h2 className="text-lg font-bold text-brand-dark">Upload Bukti Keaslian</h2>
          <p className="mb-3 text-xs text-brand-dark/40">
            Opsional. Pilih tipe bukti terlebih dahulu, lalu upload label, tag, nota, atau bukti pembelian.
          </p>
          <div className="mb-3 flex flex-wrap gap-2">
            {(['Label', 'Tag', 'Nota'] as ProofKind[]).map((proofKind) => (
              <button
                key={proofKind}
                type="button"
                onClick={() => setSelectedProofKind(proofKind)}
                className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                  selectedProofKind === proofKind
                    ? 'border-[#C99547] bg-[#C99547] text-white'
                    : 'border-brand-dark/15 text-brand-dark hover:bg-[#FCF8F2]'
                }`}
              >
                {proofKind}
              </button>
            ))}
          </div>
          {renderUploader(brandProofs, addBrandProofs, removeBrandProof, { proof: true })}
        </div>
      )}
    </section>
  );

  const renderListingSection = () => (
    <section className="space-y-8">
      <div className="space-y-3">
        <Toggle
          checked={isPreLoved}
          onChange={setIsPreLoved}
          label="Pre-Loved Item"
          helper="Aktifkan kalau item boleh dibeli. Pembeli perlu mengirim minimal 1 pakaian tidak terpakai ke IJOL Fiber."
        />
        {isPreLoved && (
          <FieldLabel label="Harga Item (Rp)*">
            <input
              className={inputClass}
              value={formValues.buyPrice}
              inputMode="numeric"
              onChange={(event) => updateField('buyPrice', formatThousands(event.target.value))}
            />
          </FieldLabel>
        )}
      </div>
      <div className="space-y-3">
        <Toggle
          checked={isRental}
          onChange={setIsRental}
          label="Sewa Item"
          helper="Aktifkan apabila kamu ingin menyewakan pakaian ini."
        />
        {isRental && (
          <FieldLabel label="Harga Sewa/hari (Rp)*">
            <input
              className={inputClass}
              value={formValues.rentPrice}
              inputMode="numeric"
              onChange={(event) => updateField('rentPrice', formatThousands(event.target.value))}
            />
          </FieldLabel>
        )}
      </div>
    </section>
  );

  return (
    <div className="fixed inset-0 z-[120] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 hidden bg-black/35 md:block"
        aria-label="Tutup form upload"
        onClick={closeDrawer}
      />

      <aside className="relative z-10 flex h-[100dvh] w-full flex-col bg-white shadow-2xl md:max-w-[760px] md:border-l md:border-brand-dark/10">
        <div className="flex items-start justify-between gap-4 border-b border-brand-dark/10 px-6 py-5 md:px-10 md:py-8">
          <div>
            <h1 className="text-3xl font-serif tracking-wide text-brand-dark md:text-4xl">
              Daftarkan Pakaianmu
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-dark/70 md:text-base">
              Upload baju yang tidak terpakai ke katalog IJOL. Tim kami akan review dan menghubungimu jika lolos QC.
            </p>
            <p className="mt-2 text-xs italic text-brand-dark/40">
              Kami melindungi datamu. Informasi pribadi tidak akan kami salahgunakan.
            </p>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-dark/15 text-brand-dark hover:bg-[#FCF8F2]"
            aria-label="Tutup form upload"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit();
          }}
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 md:px-10 md:py-8">
            <div className="hidden space-y-10 md:block">
              {renderPersonalSection()}
              {personalComplete && (
                <>
                  <div className="h-px bg-brand-dark/10" />
                  {renderClothingSection()}
                </>
              )}
              {personalComplete && clothingComplete && (
                <>
                  <div className="h-px bg-brand-dark/10" />
                  {renderMediaSection()}
                </>
              )}
              {personalComplete && clothingComplete && mediaComplete && (
                <>
                  <div className="h-px bg-brand-dark/10" />
                  {renderListingSection()}
                </>
              )}
            </div>

            <div className="space-y-8 md:hidden">
              {renderPersonalSection()}
              {personalComplete && (
                <>
                  <div className="h-px bg-brand-dark/10" />
                  {renderClothingSection()}
                </>
              )}
              {personalComplete && clothingComplete && (
                <>
                  <div className="h-px bg-brand-dark/10" />
                  {renderMediaSection()}
                </>
              )}
              {personalComplete && clothingComplete && mediaComplete && (
                <>
                  <div className="h-px bg-brand-dark/10" />
                  {renderListingSection()}
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-brand-dark/10 bg-white px-6 py-4 md:px-10 md:py-6">
            <button
              type="button"
              onClick={closeDrawer}
              disabled={isSubmitting}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#C99547] px-7 font-bold text-[#C99547] hover:bg-[#FCF8F2]"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={!formComplete || isSubmitting}
              className="hidden min-h-12 items-center justify-center rounded-full bg-brand-dark px-9 font-bold text-white hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-40 md:inline-flex"
            >
              {isSubmitting ? 'Mengupload...' : 'Upload Pakaian'}
            </button>

            <button
              type="submit"
              disabled={!formComplete || isSubmitting}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-brand-dark px-7 font-bold text-white hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-40 md:hidden"
            >
              {isSubmitting ? 'Mengupload...' : 'Upload Pakaian'}
            </button>
          </div>
          {submitMessage && (
            <div
              className={`border-t px-6 py-3 text-sm md:px-10 ${
                submitStatus === 'error'
                  ? 'border-red-100 bg-red-50 text-red-700'
                  : 'border-brand-dark/10 bg-[#FCF8F2] text-brand-dark/70'
              }`}
            >
              {submitMessage}
            </div>
          )}
        </form>
      </aside>
    </div>
  );
};
