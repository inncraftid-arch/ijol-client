import React, { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, ImageIcon, Search, Trash2, X } from 'lucide-react';
import { submitUploadProduct } from '../../services/uploadProductService';
import type { UploadProductFile, UploadProductFormData } from '../../services/uploadProductService';
import {
  findExistingUploadUserByPhone,
  sanitizePhoneNumberInput,
  validatePhoneNumberInput,
} from '../../services/usersService';
import { uploadProductFormCopy as copy } from './uploadProductFormCopy';

type ProofKind = 'Label' | 'Tag' | 'Nota';

type UploadPreview = {
  id: string;
  name: string;
  url: string;
  file: File;
  proofKind?: ProofKind;
};

type UploadProductDrawerWithUserLookupProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

type FormValues = {
  fullName: string;
  whatsapp: string;
  city: string;
  cityOther: string;
  itemName: string;
  categoryGender: '' | 'male' | 'female' | 'unisex';
  category: string;
  categoryOther: string;
  brandStatus: '' | 'true' | 'false';
  brand: string;
  size: string;
  condition: string;
  description: string;
  buyPrice: string;
  rentPrice: string;
};

type UserMode = '' | 'existing' | 'new';
type LookupStatus = 'idle' | 'checking' | 'found' | 'not-found' | 'error';
type ConfirmationKind = 'upload' | 'existing-user' | null;
type ValidationField = keyof FormValues | 'userMode' | 'phoneLookup' | 'itemPhotos';

const maxUploadFileSizeMb = 10;
const maxUploadFileSize = maxUploadFileSizeMb * 1024 * 1024;
const minItemPhotoCount = 3;
const allowedUploadContentTypes = ['image/jpeg', 'image/png'];

const cityOptions = [
  'Jakarta',
  'Bogor',
  'Depok',
  'Tangerang',
  'Bekasi',
  'Bandung',
  'Surabaya',
  'Yogyakarta',
  'Bali',
  'Lainnya',
] as const;

const genderCategoryOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'unisex', label: 'Unisex' },
] as const;

const categoryOptions = [
  'Atasan (kemeja, kaos, blouse, dll)',
  'Bawahan (celana, rok, dll)',
  'Outer (jaket, blazer, cardigan, dll)',
  'Dress / Jumpsuit',
  'Aksesori / Tas',
  'Sepatu',
  'Yang lain',
] as const;

const conditionOptions = [
  'Baru / belum pernah dipakai (tag masih ada)',
  'Seperti baru (1–2× pakai)',
  'Baik (beberapa kali pakai, tidak ada cacat)',
  'Cukup baik (ada sedikit tanda pemakaian)',
  'Perlu diketahui (ada cacat/kekurangan, saya akan jelaskan)',
] as const;

const initialFormValues: FormValues = {
  fullName: '',
  whatsapp: '',
  city: '',
  cityOther: '',
  itemName: '',
  categoryGender: '',
  category: '',
  categoryOther: '',
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

const validateUploadFiles = (files: FileList | null) => {
  const selectedFiles = Array.from(files || []);
  const invalidFile = selectedFiles.find((file) => {
    const contentType = file.type.toLowerCase();

    return file.size > maxUploadFileSize || !allowedUploadContentTypes.includes(contentType);
  });

  if (!invalidFile) {
    return '';
  }

  if (invalidFile.size > maxUploadFileSize) {
    return `${invalidFile.name} melebihi ${maxUploadFileSizeMb}MB. Pilih foto yang lebih kecil.`;
  }

  return `${invalidFile.name} bukan format JPG/PNG. Ubah format foto terlebih dahulu lalu upload lagi.`;
};

const formatThousands = (value: string) => {
  const numericValue = value.replace(/\D/g, '');

  if (!numericValue) {
    return '';
  }

  return new Intl.NumberFormat('id-ID').format(Number(numericValue));
};

const formatTitleCase = (value: string) =>
  value
    .replace(/[^a-zA-Z\s]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\b[a-zA-Z]/g, (character) => character.toUpperCase())
    .replace(/\B[A-Z]/g, (character) => character.toLowerCase())
    .trimStart();

const sanitizeItemName = (value: string) => value.replace(/[^a-zA-Z\s-]/g, '').replace(/\s+/g, ' ');

const sanitizeSize = (value: string) => value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

const getUserFacingErrorMessage = (error: unknown) => {
  if (!(error instanceof Error)) {
    return 'Sistem error. Silakan coba lagi atau hubungi admin.';
  }

  if (error.message.includes('Gagal menyimpan user')) {
    return 'Gagal menyimpan data pengguna. Pastikan nomor WA diawali 08, berisi 10-14 digit, dan data pribadi sudah lengkap.';
  }

  if (error.message.includes('Gagal upload gambar')) {
    const detail = error.message.split('Detail:')[1]?.trim();

    return detail
      ? `Gagal upload gambar. Detail: ${detail} Coba koneksi yang lebih stabil atau pilih foto yang lebih kecil.`
      : `Gagal upload gambar. Cek koneksi internet, ukuran foto maksimal ${maxUploadFileSizeMb}MB, format JPG/PNG, atau konfigurasi CORS bucket S3.`;
  }

  if (error.message.includes('Gagal menyimpan item')) {
    return 'Gagal menyimpan data item. Cek nama item, kategori, size, kondisi, harga, dan pastikan policy Supabase untuk table items sudah aktif.';
  }

  if (error.message.includes('Gagal menyimpan metadata gambar')) {
    return 'Gambar berhasil diupload, tetapi data foto gagal disimpan. Cek policy Supabase untuk table item_photos dan item_brand_proofs.';
  }

  const technicalPatterns = [
    'row-level security',
    'violates',
    'JWT',
    'Failed to fetch',
    '42501',
    'new row',
    'policy',
    'column',
    'constraint',
    'duplicate key',
    'foreign key',
    'permission denied',
    'invalid input',
    'Request gagal',
  ];

  if (
    error.message.includes('Ukuran file maksimal 5MB') ||
    error.message.includes(`Ukuran file maksimal ${maxUploadFileSizeMb}MB`)
  ) {
    return `Ukuran file maksimal ${maxUploadFileSizeMb}MB per foto. Pilih foto yang lebih kecil.`;
  }

  if (error.message.includes('File harus berupa gambar')) {
    return 'File harus berupa gambar JPG/PNG.';
  }

  if (
    error.message.includes('Gagal upload') ||
    error.message.includes('CORS bucket S3')
  ) {
    return 'Gagal upload gambar. Cek koneksi internet, ukuran foto, format JPG/PNG, atau konfigurasi CORS bucket S3.';
  }

  if (error.message.includes('Failed to fetch')) {
    return 'Gagal menghubungi server. Cek koneksi internet, domain Netlify diizinkan oleh Supabase/S3, dan coba lagi.';
  }

  const isTechnicalError = technicalPatterns.some((pattern) =>
    error.message.toLowerCase().includes(pattern.toLowerCase())
  );

  return isTechnicalError ? 'Sistem error. Silakan coba lagi atau hubungi admin.' : error.message;
};

const FieldLabel: React.FC<{
  label: string;
  helper?: string;
  error?: string;
  children: React.ReactNode;
}> = ({
  label,
  helper,
  error,
  children,
}) => (
  <label className="block">
    <div className="relative pt-2">
      <span
        className={`absolute left-5 top-2 z-10 -translate-y-1/2 bg-white px-2 text-sm font-medium ${
          error ? 'text-red-700' : 'text-brand-dark'
        }`}
      >
        {label}
      </span>
      {children}
    </div>
    {helper && <span className="block mt-1.5 text-xs text-brand-dark/35">{helper}</span>}
    {error && <span className="block mt-1 text-xs font-semibold text-red-600">{error}</span>}
  </label>
);

const inputClass =
  'w-full rounded-full border border-brand-dark/15 bg-white px-5 py-3 text-sm text-brand-dark outline-none transition-colors placeholder:text-brand-dark/30 focus:border-brand-gold';

const selectClass =
  'w-full truncate rounded-full border border-brand-dark/15 bg-white px-5 py-3 pr-10 text-sm text-brand-dark outline-none transition-colors focus:border-brand-gold';

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

export const UploadProductDrawerWithUserLookup: React.FC<UploadProductDrawerWithUserLookupProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
  const [userMode, setUserMode] = useState<UserMode>('');
  const [phoneLookup, setPhoneLookup] = useState('');
  const [lookupStatus, setLookupStatus] = useState<LookupStatus>('idle');
  const [lookupMessage, setLookupMessage] = useState('');
  const [isPreLoved, setIsPreLoved] = useState(false);
  const [isRental, setIsRental] = useState(false);
  const [selectedProofKind, setSelectedProofKind] = useState<ProofKind>('Label');
  const [itemPhotos, setItemPhotos] = useState<UploadPreview[]>([]);
  const [brandProofs, setBrandProofs] = useState<UploadPreview[]>([]);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [confirmationKind, setConfirmationKind] = useState<ConfirmationKind>(null);
  const [hasConfirmedExistingUserConflict, setHasConfirmedExistingUserConflict] = useState(false);
  const [hasSubmitAttempted, setHasSubmitAttempted] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Partial<Record<ValidationField, boolean>>>({});

  const selectedCity = formValues.city === 'Lainnya' ? formValues.cityOther.trim() : formValues.city;
  const selectedCategory =
    formValues.category === 'Yang lain' ? formValues.categoryOther.trim() : formValues.category;
  const isBranded = formValues.brandStatus === 'true';
  const shouldShowPersonalFields = userMode === 'new' || lookupStatus === 'found';
  const personalComplete = Boolean(
    shouldShowPersonalFields && formValues.fullName.trim() && formValues.whatsapp.trim() && selectedCity
  );
  const clothingComplete = Boolean(
    formValues.itemName.trim() &&
      formValues.categoryGender &&
      selectedCategory &&
      formValues.brandStatus &&
      (!isBranded || formValues.brand.trim()) &&
      formValues.size.trim() &&
      formValues.condition &&
      formValues.description.trim()
  );
  const mediaComplete = itemPhotos.length >= minItemPhotoCount;
  const listingComplete = Boolean(
    (!isPreLoved || formValues.buyPrice.trim()) && (!isRental || formValues.rentPrice.trim())
  );
  const shouldShowClothingSection = personalComplete;
  const shouldShowMediaSection = shouldShowClothingSection && clothingComplete;
  const shouldShowListingSection = shouldShowMediaSection && mediaComplete;
  const formComplete = personalComplete && clothingComplete && mediaComplete && listingComplete;
  const isSubmitting = submitStatus === 'submitting';
  const validationErrors: Partial<Record<ValidationField, string>> = {
    userMode: !userMode ? 'Pilih salah satu opsi terlebih dahulu.' : '',
    phoneLookup:
      userMode === 'existing' && lookupStatus !== 'found'
        ? phoneLookup
          ? ''
          : 'Masukkan nomor WhatsApp terlebih dahulu.'
        : '',
    fullName: shouldShowPersonalFields && !formValues.fullName.trim() ? 'Nama lengkap wajib diisi.' : '',
    whatsapp: shouldShowPersonalFields && !formValues.whatsapp.trim() ? 'Nomor WhatsApp wajib diisi.' : '',
    city: shouldShowPersonalFields && !formValues.city ? 'Pilih kota domisili.' : '',
    cityOther:
      shouldShowPersonalFields && formValues.city === 'Lainnya' && !formValues.cityOther.trim()
        ? 'Domisili lainnya wajib diisi.'
        : '',
    itemName: shouldShowClothingSection && !formValues.itemName.trim() ? 'Nama item wajib diisi.' : '',
    categoryGender:
      shouldShowClothingSection && !formValues.categoryGender ? 'Pilih kategori gender.' : '',
    category: shouldShowClothingSection && !formValues.category ? 'Pilih kategori.' : '',
    categoryOther:
      shouldShowClothingSection && formValues.category === 'Yang lain' && !formValues.categoryOther.trim()
        ? 'Kategori lainnya wajib diisi.'
        : '',
    brandStatus: shouldShowClothingSection && !formValues.brandStatus ? 'Pilih status brand.' : '',
    brand:
      shouldShowClothingSection && isBranded && !formValues.brand.trim() ? 'Brand wajib diisi.' : '',
    size: shouldShowClothingSection && !formValues.size.trim() ? 'Ukuran wajib diisi.' : '',
    condition: shouldShowClothingSection && !formValues.condition ? 'Pilih kondisi item.' : '',
    description:
      shouldShowClothingSection && !formValues.description.trim() ? 'Deskripsi wajib diisi.' : '',
    itemPhotos:
      shouldShowMediaSection && itemPhotos.length < minItemPhotoCount
        ? `Tambahkan minimal ${minItemPhotoCount} foto item.`
        : '',
    buyPrice: shouldShowListingSection && isPreLoved && !formValues.buyPrice.trim() ? 'Harga wajib diisi.' : '',
    rentPrice: shouldShowListingSection && isRental && !formValues.rentPrice.trim() ? 'Harga sewa wajib diisi.' : '',
  };

  const markFieldTouched = (field: ValidationField) => {
    setTouchedFields((currentFields) => ({ ...currentFields, [field]: true }));
  };

  const getVisibleError = (field: ValidationField) =>
    (hasSubmitAttempted || touchedFields[field]) && validationErrors[field]
      ? validationErrors[field]
      : '';

  const getControlClass = (baseClass: string, field: ValidationField) =>
    `${baseClass} ${
      getVisibleError(field)
        ? '!border-red-400 !bg-red-50/30 focus:!border-red-500'
        : ''
    }`;

  const getIncompleteFormMessage = () => {
    if (!userMode) {
      return 'Pilih apakah kamu sudah pernah upload atau user baru terlebih dahulu.';
    }

    if (userMode === 'existing' && lookupStatus !== 'found') {
      return 'Cek nomor WhatsApp sampai data ditemukan, atau pilih user baru.';
    }

    if (!personalComplete) {
      return 'Lengkapi informasi pribadi terlebih dahulu.';
    }

    if (!clothingComplete) {
      return 'Lengkapi informasi pakaian terlebih dahulu.';
    }

    if (!mediaComplete) {
      return `Tambahkan minimal ${minItemPhotoCount} foto item.`;
    }

    return 'Lengkapi informasi harga yang aktif terlebih dahulu.';
  };

  const resetLookup = () => {
    setPhoneLookup('');
    setLookupStatus('idle');
    setLookupMessage('');
  };

  const clearPersonalFields = () => {
    setFormValues((currentValues) => ({
      ...currentValues,
      fullName: '',
      whatsapp: '',
      city: '',
      cityOther: '',
    }));
  };

  const getCityFields = (city: string) => {
    if (cityOptions.includes(city as (typeof cityOptions)[number])) {
      return { city, cityOther: '' };
    }

    return { city: 'Lainnya', cityOther: formatTitleCase(city) };
  };

  const closeDrawer = useCallback(() => {
    itemPhotos.forEach((photo) => URL.revokeObjectURL(photo.url));
    brandProofs.forEach((proof) => URL.revokeObjectURL(proof.url));
    setFormValues(initialFormValues);
    setUserMode('');
    setPhoneLookup('');
    setLookupStatus('idle');
    setLookupMessage('');
    setIsPreLoved(false);
    setIsRental(false);
    setSelectedProofKind('Label');
    setItemPhotos([]);
    setBrandProofs([]);
    setSubmitStatus('idle');
    setSubmitMessage('');
    setConfirmationKind(null);
    setHasConfirmedExistingUserConflict(false);
    setHasSubmitAttempted(false);
    setTouchedFields({});
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

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeDrawer, isOpen]);

  useEffect(() => {
    if (!isOpen) {
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
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const updateField = (field: keyof FormValues, value: string) => {
    setSubmitStatus('idle');
    setSubmitMessage('');
    setHasConfirmedExistingUserConflict((currentValue) =>
      field === 'whatsapp' ? false : currentValue
    );
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]:
        field === 'whatsapp'
          ? sanitizePhoneNumberInput(value)
          : field === 'cityOther' || field === 'categoryOther'
            ? formatTitleCase(value)
            : field === 'itemName'
              ? sanitizeItemName(value)
              : field === 'size'
                ? sanitizeSize(value)
                : value,
    }));
  };

  const updateUserMode = (nextUserMode: UserMode) => {
    setUserMode(nextUserMode);
    resetLookup();
    clearPersonalFields();
    setSubmitStatus('idle');
    setSubmitMessage('');
    setConfirmationKind(null);
    setHasConfirmedExistingUserConflict(false);
  };

  const updatePhoneLookup = (value: string) => {
    setPhoneLookup(sanitizePhoneNumberInput(value));
    setLookupStatus('idle');
    setLookupMessage('');
    clearPersonalFields();
    setHasConfirmedExistingUserConflict(false);
  };

  const handleLookupExistingUser = async () => {
    const sanitizedPhone = sanitizePhoneNumberInput(phoneLookup);
    const validationMessage = validatePhoneNumberInput(sanitizedPhone);

    if (validationMessage) {
      setLookupStatus('error');
      setLookupMessage(validationMessage);
      return;
    }

    setLookupStatus('checking');
    setLookupMessage(copy.userMode.checking);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      const existingUser = await findExistingUploadUserByPhone(sanitizedPhone);

      if (!existingUser) {
        setLookupStatus('not-found');
        setLookupMessage(copy.userMode.notFound);
        clearPersonalFields();
        return;
      }

      setFormValues((currentValues) => ({
        ...currentValues,
        fullName: existingUser.fullName,
        whatsapp: existingUser.phone,
        ...getCityFields(existingUser.city),
      }));
      setLookupStatus('found');
      setLookupMessage(copy.userMode.found);
    } catch (error) {
      setLookupStatus('error');
      setLookupMessage(error instanceof Error ? error.message : copy.status.error);
    }
  };

  const addItemPhotos = (files: FileList | null) => {
    markFieldTouched('itemPhotos');
    const validationMessage = validateUploadFiles(files);

    if (validationMessage) {
      setSubmitStatus('error');
      setSubmitMessage(validationMessage);
      return;
    }

    const nextPreviews = createUploadPreviews(files);
    setSubmitStatus('idle');
    setSubmitMessage('');
    setItemPhotos((currentPhotos) => appendUploadPreviews(currentPhotos, nextPreviews));
  };

  const addBrandProofs = (files: FileList | null) => {
    const validationMessage = validateUploadFiles(files);

    if (validationMessage) {
      setSubmitStatus('error');
      setSubmitMessage(validationMessage);
      return;
    }

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
    city: selectedCity,
    itemName: formValues.itemName.trim(),
    categoryGender: formValues.categoryGender as 'male' | 'female' | 'unisex',
    category: selectedCategory,
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

  const performUpload = async () => {
    if (!formComplete || isSubmitting) {
      setHasSubmitAttempted(true);
      setSubmitStatus('error');
      setSubmitMessage(getIncompleteFormMessage());
      return;
    }

    setConfirmationKind(null);
    setSubmitStatus('submitting');
    setSubmitMessage(copy.status.submitting);

    try {
      await submitUploadProduct(buildSubmissionPayload());
      setSubmitStatus('success');
      setSubmitMessage(copy.status.success);
      closeDrawer();
      onSuccess?.();
    } catch (error) {
      console.error('Upload product failed', error);
      setSubmitStatus('error');
      setSubmitMessage(getUserFacingErrorMessage(error));
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    setHasSubmitAttempted(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    if (!formComplete) {
      setSubmitStatus('error');
      setSubmitMessage(getIncompleteFormMessage());
      return;
    }

    if (userMode === 'new' && !hasConfirmedExistingUserConflict) {
      try {
        const existingUser = await findExistingUploadUserByPhone(formValues.whatsapp);

        if (existingUser) {
          setConfirmationKind('existing-user');
          return;
        }
      } catch (error) {
        setSubmitStatus('error');
        setSubmitMessage(getUserFacingErrorMessage(error));
        return;
      }
    }

    setConfirmationKind('upload');
  };

  const renderPersonalSection = () => {
    const userModeError = getVisibleError('userMode');
    const phoneLookupError = getVisibleError('phoneLookup');

    return (
    <section className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-brand-dark">{copy.sections.personal}</h2>
        <p className="mt-1 text-xs leading-relaxed text-brand-dark/40">{copy.userMode.description}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {[
          { value: 'existing' as const, ...copy.userMode.existing },
          { value: 'new' as const, ...copy.userMode.new },
        ].map((option) => {
          const isSelected = userMode === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => updateUserMode(option.value)}
              aria-pressed={isSelected}
              className={`min-h-24 rounded-2xl border px-5 py-4 text-left transition-colors ${
                isSelected
                  ? 'border-[#C99547] bg-[#FCF8F2] text-brand-dark'
                  : userModeError
                    ? 'border-red-400 bg-red-50/40 text-brand-dark'
                    : 'border-brand-dark/10 bg-white text-brand-dark hover:border-brand-gold'
              }`}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="text-sm font-bold">{option.label}</span>
                {isSelected && <CheckCircle2 className="h-5 w-5 text-[#C99547]" />}
              </span>
              <span className="mt-2 block text-xs leading-relaxed text-brand-dark/45">{option.helper}</span>
            </button>
          );
        })}
      </div>
      {userModeError && <p className="text-xs font-semibold text-red-600">{userModeError}</p>}

      {userMode === 'existing' && (
        <div
          className={`space-y-3 rounded-2xl border bg-white p-4 ${
            phoneLookupError ? 'border-red-400' : 'border-brand-dark/10'
          }`}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="min-w-0 flex-1">
              <div className="relative pt-2">
                <span className="absolute left-5 top-2 -translate-y-1/2 bg-white px-2 text-sm font-medium text-brand-dark">
                  {copy.userMode.lookupLabel}
                </span>
                <input
                  className={getControlClass(inputClass, 'phoneLookup')}
                  value={phoneLookup}
                  inputMode="tel"
                  maxLength={14}
                  placeholder={copy.userMode.lookupPlaceholder}
                  onBlur={() => markFieldTouched('phoneLookup')}
                  onChange={(event) => updatePhoneLookup(event.target.value)}
                />
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-brand-dark/35">{copy.userMode.lookupHelper}</p>
            </div>
            <button
              type="button"
              onClick={() => void handleLookupExistingUser()}
              disabled={lookupStatus === 'checking'}
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-brand-dark px-6 text-sm font-bold text-white hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-40 sm:mt-2"
            >
              <Search className="h-4 w-4" />
              {lookupStatus === 'checking' ? copy.userMode.checking : copy.userMode.lookupButton}
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
          {phoneLookupError && <p className="text-xs font-semibold text-red-600">{phoneLookupError}</p>}
        </div>
      )}

      {shouldShowPersonalFields && (
        <>
            <FieldLabel
              label={copy.fields.fullName.label}
              helper={copy.fields.fullName.helper}
              error={getVisibleError('fullName')}
            >
              <input
                className={getControlClass(inputClass, 'fullName')}
                placeholder={copy.fields.fullName.placeholder}
                value={formValues.fullName}
                disabled={userMode === 'existing'}
                onBlur={() => markFieldTouched('fullName')}
                onChange={(event) => updateField('fullName', event.target.value)}
            />
          </FieldLabel>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FieldLabel
              label={copy.fields.whatsapp.label}
              helper={copy.fields.whatsapp.helper}
              error={getVisibleError('whatsapp')}
            >
              <input
                className={getControlClass(inputClass, 'whatsapp')}
                placeholder={copy.fields.whatsapp.placeholder}
                value={formValues.whatsapp}
                disabled={userMode === 'existing'}
                inputMode="tel"
                onBlur={() => markFieldTouched('whatsapp')}
                onChange={(event) => updateField('whatsapp', event.target.value)}
              />
            </FieldLabel>
            <FieldLabel
              label={copy.fields.city.label}
              helper={copy.fields.city.helper}
              error={getVisibleError('city')}
            >
              <select
                className={getControlClass(selectClass, 'city')}
                value={formValues.city}
                disabled={userMode === 'existing'}
                onBlur={() => markFieldTouched('city')}
                onChange={(event) => {
                  updateField('city', event.target.value);
                  if (event.target.value !== 'Lainnya') {
                    updateField('cityOther', '');
                  }
                }}
              >
                <option value="" disabled>{copy.fields.city.placeholder}</option>
                {cityOptions.map((cityOption) => (
                  <option key={cityOption}>{cityOption}</option>
                ))}
              </select>
            </FieldLabel>
          </div>
          {formValues.city === 'Lainnya' && (
            <FieldLabel label="Domisili lainnya*" error={getVisibleError('cityOther')}>
              <input
                className={getControlClass(inputClass, 'cityOther')}
                placeholder="Masukkan kota domisili"
                value={formValues.cityOther}
                disabled={userMode === 'existing'}
                onBlur={() => markFieldTouched('cityOther')}
                onChange={(event) => updateField('cityOther', event.target.value)}
              />
            </FieldLabel>
          )}
        </>
      )}
    </section>
  );
  };

  const renderClothingSection = () => (
    <section className="space-y-5">
      <h2 className="text-lg font-bold text-brand-dark">{copy.sections.clothing}</h2>
      <FieldLabel
        label={copy.fields.itemName.label}
        helper={copy.fields.itemName.helper}
        error={getVisibleError('itemName')}
      >
        <input
          className={getControlClass(inputClass, 'itemName')}
          placeholder={copy.fields.itemName.placeholder}
          value={formValues.itemName}
          onBlur={() => markFieldTouched('itemName')}
          onChange={(event) => updateField('itemName', event.target.value)}
        />
      </FieldLabel>
      <FieldLabel label="Kategori gender*" error={getVisibleError('categoryGender')}>
        <select
          className={getControlClass(selectClass, 'categoryGender')}
          value={formValues.categoryGender}
          onBlur={() => markFieldTouched('categoryGender')}
          onChange={(event) => updateField('categoryGender', event.target.value)}
        >
          <option value="" disabled>Pilih kategori gender</option>
          {genderCategoryOptions.map((genderOption) => (
            <option key={genderOption.value} value={genderOption.value}>
              {genderOption.label}
            </option>
          ))}
        </select>
      </FieldLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FieldLabel label={copy.fields.category.label} error={getVisibleError('category')}>
          <select
            className={getControlClass(selectClass, 'category')}
            value={formValues.category}
            onBlur={() => markFieldTouched('category')}
            onChange={(event) => {
              updateField('category', event.target.value);
              if (event.target.value !== 'Yang lain') {
                updateField('categoryOther', '');
              }
            }}
          >
            <option value="" disabled>{copy.fields.category.placeholder}</option>
            {categoryOptions.map((categoryOption) => (
              <option key={categoryOption}>{categoryOption}</option>
            ))}
          </select>
        </FieldLabel>
        <FieldLabel label={copy.fields.brandStatus.label} error={getVisibleError('brandStatus')}>
          <select
            className={getControlClass(selectClass, 'brandStatus')}
            value={formValues.brandStatus}
            onBlur={() => markFieldTouched('brandStatus')}
            onChange={(event) => {
              updateField('brandStatus', event.target.value);
              if (event.target.value === 'false') {
                updateField('brand', '');
                setBrandProofs((currentProofs) => {
                  currentProofs.forEach((proof) => URL.revokeObjectURL(proof.url));
                  return [];
                });
              }
            }}
          >
            <option value="" disabled>{copy.fields.brandStatus.placeholder}</option>
            <option value="true">Ya — branded (Zara, H&M, Uniqlo, lokal branded, dll)</option>
            <option value="false">Tidak - Non Branded/General</option>
          </select>
        </FieldLabel>
      </div>
      {formValues.category === 'Yang lain' && (
        <FieldLabel label="Kategori lainnya*" error={getVisibleError('categoryOther')}>
          <input
            className={getControlClass(inputClass, 'categoryOther')}
            placeholder="Masukkan kategori lainnya"
            value={formValues.categoryOther}
            onBlur={() => markFieldTouched('categoryOther')}
            onChange={(event) => updateField('categoryOther', event.target.value)}
          />
        </FieldLabel>
      )}
      {isBranded && (
        <FieldLabel label={copy.fields.brand.label} error={getVisibleError('brand')}>
          <input
            className={getControlClass(inputClass, 'brand')}
            placeholder={copy.fields.brand.placeholder}
            value={formValues.brand}
            onBlur={() => markFieldTouched('brand')}
            onChange={(event) => updateField('brand', event.target.value)}
          />
        </FieldLabel>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FieldLabel
          label={copy.fields.size.label}
          helper={copy.fields.size.helper}
          error={getVisibleError('size')}
        >
          <input
            className={getControlClass(inputClass, 'size')}
            placeholder={copy.fields.size.placeholder}
            value={formValues.size}
            onBlur={() => markFieldTouched('size')}
            onChange={(event) => updateField('size', event.target.value)}
          />
        </FieldLabel>
        <FieldLabel label={copy.fields.condition.label} error={getVisibleError('condition')}>
          <select
            className={getControlClass(selectClass, 'condition')}
            value={formValues.condition}
            onBlur={() => markFieldTouched('condition')}
            onChange={(event) => updateField('condition', event.target.value)}
          >
            <option value="" disabled>{copy.fields.condition.placeholder}</option>
            {conditionOptions.map((conditionOption) => (
              <option key={conditionOption} value={conditionOption}>{conditionOption}</option>
            ))}
          </select>
        </FieldLabel>
      </div>
      <FieldLabel
        label={copy.fields.description.label}
        helper={copy.fields.description.helper}
        error={getVisibleError('description')}
      >
        <textarea
          className={getControlClass(
            'min-h-28 w-full rounded-3xl border border-brand-dark/15 bg-white px-5 py-3 text-sm text-brand-dark outline-none transition-colors placeholder:text-brand-dark/30 focus:border-brand-gold',
            'description'
          )}
          placeholder={copy.fields.description.placeholder}
          value={formValues.description}
          onBlur={() => markFieldTouched('description')}
          onChange={(event) => updateField('description', event.target.value)}
        />
      </FieldLabel>
    </section>
  );

  const renderUploader = (
    previews: UploadPreview[],
    onAdd: (files: FileList | null) => void,
    onRemove: (id: string) => void,
    options?: { proof?: boolean; hasError?: boolean }
  ) => (
    <div className="flex flex-wrap gap-3">
      <label
        className={`flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-white text-brand-dark/70 hover:border-brand-gold ${
          options?.hasError ? 'border-red-400' : 'border-brand-dark/20'
        }`}
      >
        <ImageIcon className="mb-2 h-5 w-5" />
        <span className="text-sm font-medium">{copy.media.browse}</span>
        <input
          type="file"
          accept="image/jpeg,image/png"
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
            aria-label={copy.media.removeFile}
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

  const renderMediaSection = () => {
    const missingItemPhotoCount = Math.max(0, minItemPhotoCount - itemPhotos.length);
    const itemPhotoProgressText =
      missingItemPhotoCount > 0
        ? `${itemPhotos.length} dari ${minItemPhotoCount} gambar sudah ditambahkan. Tambahkan ${missingItemPhotoCount} foto lagi.`
        : `${itemPhotos.length} dari ${minItemPhotoCount} gambar sudah ditambahkan. Foto item sudah cukup.`;
    const itemPhotoError = getVisibleError('itemPhotos');

    return (
    <section className="space-y-7">
      <div>
        <h2 className="text-lg font-bold text-brand-dark">{copy.sections.itemPhotos}</h2>
        <p className="mb-2 text-xs text-brand-dark/40">
          {copy.media.itemPhotoHelper}
        </p>
        <p
          className={`mb-3 text-xs font-semibold ${
            missingItemPhotoCount > 0 ? 'text-red-600' : 'text-green-700'
          }`}
        >
          {itemPhotoProgressText}
        </p>
        {itemPhotoError && <p className="mb-3 text-xs font-semibold text-red-600">{itemPhotoError}</p>}
        {renderUploader(itemPhotos, addItemPhotos, removeItemPhoto, {
          hasError: Boolean(itemPhotoError || missingItemPhotoCount > 0),
        })}
      </div>
      {isBranded && (
        <div>
          <h2 className="text-lg font-bold text-brand-dark">{copy.sections.authenticityProof}</h2>
          <p className="mb-3 text-xs text-brand-dark/40">
            {copy.media.proofHelper}
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
  };

  const renderListingSection = () => (
    <section className="space-y-8">
      <div className="space-y-3">
        <Toggle
          checked={isPreLoved}
          onChange={setIsPreLoved}
          label={copy.listing.preLoved.label}
          helper={copy.listing.preLoved.helper}
        />
        {isPreLoved && (
          <FieldLabel label={copy.fields.buyPrice.label} error={getVisibleError('buyPrice')}>
            <input
              className={getControlClass(inputClass, 'buyPrice')}
              placeholder={copy.fields.buyPrice.placeholder}
              value={formValues.buyPrice}
              inputMode="numeric"
              onBlur={() => markFieldTouched('buyPrice')}
              onChange={(event) => updateField('buyPrice', formatThousands(event.target.value))}
            />
          </FieldLabel>
        )}
      </div>
      <div className="space-y-3">
        <Toggle
          checked={isRental}
          onChange={setIsRental}
          label={copy.listing.rental.label}
          helper={copy.listing.rental.helper}
        />
        {isRental && (
          <FieldLabel label={copy.fields.rentPrice.label} error={getVisibleError('rentPrice')}>
            <input
              className={getControlClass(inputClass, 'rentPrice')}
              placeholder={copy.fields.rentPrice.placeholder}
              value={formValues.rentPrice}
              inputMode="numeric"
              onBlur={() => markFieldTouched('rentPrice')}
              onChange={(event) => updateField('rentPrice', formatThousands(event.target.value))}
            />
          </FieldLabel>
        )}
      </div>
    </section>
  );

  const renderConfirmationCard = () => {
    if (!confirmationKind) {
      return null;
    }

    const isExistingUserConfirmation = confirmationKind === 'existing-user';

    return (
      <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/35 px-5">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#FCF8F2] text-[#C99547]">
            {isExistingUserConfirmation ? (
              <AlertTriangle className="h-5 w-5" />
            ) : (
              <CheckCircle2 className="h-5 w-5" />
            )}
          </div>
          <h2 className="text-xl font-bold text-brand-dark">
            {isExistingUserConfirmation ? 'Nomor sudah terdaftar' : 'Konfirmasi upload'}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-brand-dark/60">
            {isExistingUserConfirmation
              ? 'Nomor WhatsApp ini sudah pernah upload. Kalau dilanjutkan dari pilihan user baru, data nama dan domisili untuk nomor ini akan mengikuti input yang kamu isi sekarang.'
              : 'Pastikan informasi pribadi, detail item, harga, dan foto sudah benar sebelum dikirim untuk review QC.'}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setConfirmationKind(null)}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#C99547] px-5 text-sm font-bold text-[#C99547] hover:bg-[#FCF8F2]"
            >
              Cek lagi
            </button>
            <button
              type="button"
              onClick={() => {
                if (isExistingUserConfirmation) {
                  setHasConfirmedExistingUserConflict(true);
                  setConfirmationKind('upload');
                  return;
                }

                void performUpload();
              }}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-dark px-5 text-sm font-bold text-white hover:bg-black/90"
            >
              {isExistingUserConfirmation ? 'Lanjutkan' : 'Kirim upload'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderStatusCard = () => {
    if (!submitMessage || submitStatus === 'idle' || submitStatus === 'submitting') {
      return null;
    }

    const isSuccess = submitStatus === 'success';

    return (
      <div
        className={`mx-6 mb-4 rounded-2xl border p-4 text-sm shadow-sm md:mx-10 ${
          isSuccess
            ? 'border-green-100 bg-green-50 text-green-800'
            : 'border-red-100 bg-red-50 text-red-800'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
              isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {isSuccess ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          </div>
          <div>
            <h3 className="font-bold">{isSuccess ? 'Upload berhasil' : 'Upload belum berhasil'}</h3>
            <p className="mt-1 leading-relaxed">{submitMessage}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[120] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 hidden bg-black/35 md:block"
        aria-label={copy.buttons.close}
        onClick={closeDrawer}
      />

      <aside className="relative z-10 flex h-[100dvh] w-full flex-col bg-white shadow-2xl md:max-w-[760px] md:border-l md:border-brand-dark/10">
        <div className="flex items-start justify-between gap-4 border-b border-brand-dark/10 px-6 py-5 md:px-10 md:py-8">
          <div>
            <h1 className="text-3xl font-serif tracking-wide text-brand-dark md:text-4xl">
              {copy.header.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-brand-dark md:text-base">
              {copy.header.description}
            </p>
            <p className="mt-2 text-xs italic text-brand-dark/40">
              {copy.header.privacy}
            </p>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-dark/15 text-brand-dark hover:bg-[#FCF8F2]"
            aria-label={copy.buttons.close}
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
              {shouldShowClothingSection && (
                <>
                  <div className="h-px bg-brand-dark/10" />
                  {renderClothingSection()}
                </>
              )}
              {shouldShowMediaSection && (
                <>
                  <div className="h-px bg-brand-dark/10" />
                  {renderMediaSection()}
                </>
              )}
              {shouldShowListingSection && (
                <>
                  <div className="h-px bg-brand-dark/10" />
                  {renderListingSection()}
                </>
              )}
            </div>

            <div className="space-y-8 md:hidden">
              {renderPersonalSection()}
              {shouldShowClothingSection && (
                <>
                  <div className="h-px bg-brand-dark/10" />
                  {renderClothingSection()}
                </>
              )}
              {shouldShowMediaSection && (
                <>
                  <div className="h-px bg-brand-dark/10" />
                  {renderMediaSection()}
                </>
              )}
              {shouldShowListingSection && (
                <>
                  <div className="h-px bg-brand-dark/10" />
                  {renderListingSection()}
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-brand-dark/10 bg-white px-6 py-4 md:px-10 md:py-6">
            <button
              type="button"
              onClick={closeDrawer}
              disabled={isSubmitting}
              className="inline-flex min-h-12 min-w-28 items-center justify-center gap-2 rounded-full border border-[#C99547] px-7 font-bold text-[#C99547] hover:bg-[#FCF8F2]"
            >
              {copy.buttons.cancel}
            </button>

            <button
              type="submit"
              disabled={!formComplete || isSubmitting || submitStatus === 'success'}
              className="hidden min-h-12 items-center justify-center rounded-full bg-brand-dark px-9 font-bold text-white hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-40 md:inline-flex"
            >
              {isSubmitting ? copy.buttons.submitting : copy.buttons.submit}
            </button>

            <button
              type="submit"
              disabled={!formComplete || isSubmitting || submitStatus === 'success'}
              className="inline-flex min-h-12 min-w-36 items-center justify-center gap-2 rounded-full bg-brand-dark px-7 font-bold text-white hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-40 md:hidden"
            >
              {isSubmitting ? copy.buttons.submitting : copy.buttons.submit}
            </button>
          </div>
          {submitStatus === 'submitting' && submitMessage && (
            <div className="border-t border-brand-dark/10 bg-[#FCF8F2] px-6 py-3 text-sm text-brand-dark/70 md:px-10">
              {submitMessage}
            </div>
          )}
          {renderStatusCard()}
        </form>
        {renderConfirmationCard()}
      </aside>
    </div>
  );
};
