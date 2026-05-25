import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Image,
  LogOut,
  RefreshCw,
  Shirt,
  X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import {
  getValidAdminSession,
  signOutAdmin,
  type AdminSession,
} from '../services/adminAuthService';
import {
  fetchAdminItems,
  updateAdminItemStatus,
  type AdminItem,
  type AdminItemStatus,
} from '../services/adminItemsService';

type StatusFilter = 'all' | AdminItemStatus;
type PreviewMedia = {
  url: string;
  label: string;
};
type PreviewState = {
  title: string;
  media: PreviewMedia[];
  index: number;
} | null;

const pageSize = 15;

const statusLabels: Record<AdminItemStatus, string> = {
  pending_qc: 'Pending QC',
  approved: 'Approved',
  rejected: 'Rejected',
};

const statusStyles: Record<AdminItemStatus, string> = {
  pending_qc: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
};

const conditionPreview = (condition: string) => condition.split('(')[0].trim();

const genderLabels: Record<AdminItem['categoryGender'], string> = {
  female: 'Wanita',
  male: 'Pria',
  unisex: 'Unisex',
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));

const formatPrice = (value: number | null) => {
  if (value === null) {
    return '-';
  }

  return `Rp${new Intl.NumberFormat('id-ID').format(value)}`;
};

export const AdminItemsPage: React.FC = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [items, setItems] = useState<AdminItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending_qc');
  const [page, setPage] = useState(1);
  const [preview, setPreview] = useState<PreviewState>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const loadItems = async (activeSession: AdminSession, isSilent = false) => {
    if (isSilent) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError('');

    try {
      const adminItems = await fetchAdminItems(activeSession.accessToken);
      setItems(adminItems);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Gagal mengambil data item admin.'
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    let isActive = true;

    getValidAdminSession().then((validSession) => {
      if (!isActive) {
        return;
      }

      if (!validSession) {
        navigate('/admin/login', { replace: true });
        return;
      }

      setSession(validSession);
      loadItems(validSession);
    });

    return () => {
      isActive = false;
    };
  }, [navigate]);

  const counts = useMemo(() => {
    return items.reduce(
      (result, item) => ({
        ...result,
        [item.status]: result[item.status] + 1,
        all: result.all + 1,
      }),
      {
        all: 0,
        pending_qc: 0,
        approved: 0,
        rejected: 0,
      }
    );
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => statusFilter === 'all' || item.status === statusFilter);
  }, [items, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const visiblePages = useMemo(() => {
    const pages = new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages]);

    return Array.from(pages)
      .filter((pageNumber) => pageNumber >= 1 && pageNumber <= totalPages)
      .sort((firstPage, secondPage) => firstPage - secondPage);
  }, [currentPage, totalPages]);

  const handleLogout = async () => {
    await signOutAdmin(session);
    navigate('/admin/login', { replace: true });
  };

  const handleUpdateStatus = async (item: AdminItem, status: AdminItemStatus) => {
    if (!session || item.status === status) {
      return;
    }

    setUpdatingItemId(item.id);
    setError('');

    try {
      await updateAdminItemStatus(session.accessToken, item.id, status);
      setItems((currentItems) =>
        currentItems.map((currentItem) =>
          currentItem.id === item.id ? { ...currentItem, status } : currentItem
        )
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : 'Gagal mengubah status item.'
      );
    } finally {
      setUpdatingItemId(null);
    }
  };

  const openPhotoPreview = (item: AdminItem) => {
    if (!item.photos.length) {
      return;
    }

    setPreview({
      title: item.name,
      media: item.photos.map((photo, index) => ({
        url: photo,
        label: `Foto item ${index + 1}`,
      })),
      index: 0,
    });
  };

  const openProofPreview = (item: AdminItem) => {
    if (!item.brandProofs.length) {
      return;
    }

    setPreview({
      title: `${item.name} - Proof brand`,
      media: item.brandProofs.map((proof, index) => ({
        url: proof.url,
        label: proof.proofKind || `Proof brand ${index + 1}`,
      })),
      index: 0,
    });
  };

  const movePreview = (direction: 1 | -1) => {
    setPreview((currentPreview) => {
      if (!currentPreview) {
        return currentPreview;
      }

      const nextIndex =
        (currentPreview.index + direction + currentPreview.media.length) %
        currentPreview.media.length;

      return {
        ...currentPreview,
        index: nextIndex,
      };
    });
  };

  if (isLoading && !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5F0EB] px-5 text-brand-dark">
        <p className="text-sm font-semibold text-brand-dark/60">Memuat admin...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F0EB] text-brand-dark">
      <header className="border-b border-brand-dark/10 bg-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-4 py-5 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="inline-flex">
              <img src="/assets/images/logo.light.svg" alt="IJOL" className="h-7" />
            </Link>
            <div className="h-8 w-px bg-brand-dark/10" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-brand-dark/45">Admin</p>
              <h1 className="font-serif text-2xl font-bold tracking-wide">QC Items</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#FCF8F2] px-4 py-2 text-xs font-semibold text-brand-dark/70">
              {session?.user.email}
            </span>
            <button
              type="button"
              onClick={() => session && loadItems(session, true)}
              disabled={isRefreshing}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-brand-dark/15 bg-white px-4 text-sm font-bold transition-colors hover:bg-[#FCF8F2] disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-dark px-4 text-sm font-bold text-white transition-colors hover:bg-black"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1440px] px-4 py-6 md:px-8">
        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: 'Semua', value: 'all' as StatusFilter, count: counts.all },
            { label: 'Pending QC', value: 'pending_qc' as StatusFilter, count: counts.pending_qc },
            { label: 'Approved', value: 'approved' as StatusFilter, count: counts.approved },
            { label: 'Rejected', value: 'rejected' as StatusFilter, count: counts.rejected },
          ].map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => {
                setStatusFilter(filter.value);
                setPage(1);
              }}
              className={`rounded-md border px-4 py-3 text-left transition-colors ${
                statusFilter === filter.value
                  ? 'border-brand-dark bg-brand-dark text-white'
                  : 'border-brand-dark/10 bg-white text-brand-dark hover:bg-[#FCF8F2]'
              }`}
            >
              <span className="block text-xs font-bold uppercase tracking-wide opacity-60">
                {filter.label}
              </span>
              <span className="mt-1 block text-2xl font-bold">{filter.count}</span>
            </button>
          ))}
        </div>

        <div className="mb-5 flex flex-col gap-3 rounded-lg border border-brand-dark/10 bg-white p-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm font-semibold text-brand-dark/55">
            Menampilkan {paginatedItems.length} dari {filteredItems.length} item
          </p>
          <p className="text-sm font-semibold text-brand-dark/55">
            Halaman {currentPage} dari {totalPages}
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-lg border border-brand-dark/10 bg-white py-16 text-center">
            <p className="text-sm font-semibold text-brand-dark/60">Mengambil data item...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-lg border border-brand-dark/10 bg-white py-16 text-center">
            <Shirt className="mx-auto h-8 w-8 text-brand-dark/30" />
            <h2 className="mt-3 font-serif text-2xl font-bold tracking-wide">Belum ada item</h2>
            <p className="mt-1 text-sm text-brand-dark/55">Coba ubah filter status item.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-brand-dark/10 bg-white">
            <div className="hidden grid-cols-[96px_1.25fr_1fr_1fr_140px_180px] gap-4 border-b border-brand-dark/10 bg-[#FCF8F2] px-4 py-3 text-xs font-bold uppercase tracking-wide text-brand-dark/55 lg:grid">
              <span>Foto-Foto</span>
              <span>Item</span>
              <span>User</span>
              <span>Info</span>
              <span>Status</span>
              <span>Aksi</span>
            </div>

            <div className="divide-y divide-brand-dark/10">
              {paginatedItems.map((item) => (
                <article
                  key={item.id}
                  className="grid gap-4 px-4 py-4 lg:grid-cols-[96px_1.25fr_1fr_1fr_140px_180px] lg:items-start"
                >
                  <div className="flex gap-3 lg:block">
                    <button
                      type="button"
                      disabled={!item.photos.length}
                      onClick={() => openPhotoPreview(item)}
                      className="group h-28 w-24 shrink-0 overflow-hidden rounded-md bg-[#F5F0EB] text-left disabled:cursor-not-allowed lg:h-28 lg:w-full"
                      aria-label={`Preview foto ${item.name}`}
                    >
                      {item.photos[0] ? (
                        <span className="relative block h-full w-full">
                          <img
                            src={item.photos[0]}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            loading="lazy"
                          />
                          <span className="absolute inset-x-2 bottom-2 rounded-full bg-black/55 px-2 py-1 text-center text-[10px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                            Preview
                          </span>
                        </span>
                      ) : (
                        <span className="flex h-full items-center justify-center">
                          <Shirt className="h-6 w-6 text-brand-dark/25" />
                        </span>
                      )}
                    </button>
                    <div className="min-w-0 lg:hidden">
                      <h2 className="line-clamp-2 text-base font-bold">{item.name}</h2>
                      <span
                        className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${statusStyles[item.status]}`}
                      >
                        {statusLabels[item.status]}
                      </span>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <h2 className="hidden text-base font-bold lg:block">{item.name}</h2>
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-brand-dark/60">
                      {item.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
                      <span className="rounded-full bg-[#F5F0EB] px-2.5 py-1">
                        {genderLabels[item.categoryGender]}
                      </span>
                      <span className="rounded-full bg-[#F5F0EB] px-2.5 py-1">
                        {item.category}
                      </span>
                      <span className="rounded-full bg-[#F5F0EB] px-2.5 py-1">
                        Size {item.size}
                      </span>
                    </div>
                  </div>

                  <div className="min-w-0 text-sm">
                    <p className="truncate font-bold">{item.owner.name}</p>
                    <p className="mt-1 font-semibold text-brand-dark/55">{item.owner.phone}</p>
                    <p className="mt-1 truncate text-brand-dark/55">{item.owner.city}</p>
                    <p className="mt-2 text-xs font-semibold text-brand-dark/40">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>

                  <div className="min-w-0 text-sm">
                    <p className="font-bold">{item.isBranded ? item.brand || 'Branded' : 'Non Branded'}</p>
                    <p className="mt-1 text-brand-dark/60">{conditionPreview(item.condition)}</p>
                    <p className="mt-2 text-xs font-semibold text-brand-dark/45">
                      Beli: {item.canBuy ? formatPrice(item.buyPrice) : '-'}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-brand-dark/45">
                      Sewa: {item.canRent ? `${formatPrice(item.rentPrice)}/hari` : '-'}
                    </p>
                    {item.brandProofs[0] && (
                      <button
                        type="button"
                        onClick={() => openProofPreview(item)}
                        className="mt-2 inline-flex items-center gap-1 rounded-full border border-brand-gold/40 px-2.5 py-1 text-xs font-bold text-brand-gold transition-colors hover:bg-[#FCF8F2] hover:text-brand-dark"
                      >
                        <Image className="h-3 w-3" />
                        Proof: {item.brandProofs[0].proofKind}
                      </button>
                    )}
                  </div>

                  <div>
                    <span
                      className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-bold ${statusStyles[item.status]}`}
                    >
                      {statusLabels[item.status]}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:flex-col">
                    <button
                      type="button"
                      disabled={updatingItemId === item.id || item.status === 'approved'}
                      onClick={() => handleUpdateStatus(item, 'approved')}
                      className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-45 lg:flex-none"
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={updatingItemId === item.id || item.status === 'rejected'}
                      onClick={() => handleUpdateStatus(item, 'rejected')}
                      className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-red-600 px-4 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-45 lg:flex-none"
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                </article>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex flex-col gap-3 border-t border-brand-dark/10 px-4 py-4 md:flex-row md:items-center md:justify-between">
                <p className="text-sm font-semibold text-brand-dark/50">
                  {pageSize} item per halaman
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setPage((previousPage) => Math.max(1, previousPage - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-dark/15 text-brand-dark transition-colors hover:bg-[#FCF8F2] disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label="Halaman sebelumnya"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {visiblePages.map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setPage(pageNumber)}
                      className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-bold transition-colors ${
                        currentPage === pageNumber
                          ? 'border-brand-dark bg-brand-dark text-white'
                          : 'border-brand-dark/15 text-brand-dark hover:bg-[#FCF8F2]'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setPage((previousPage) => Math.min(totalPages, previousPage + 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-dark/15 text-brand-dark transition-colors hover:bg-[#FCF8F2] disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label="Halaman berikutnya"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {preview && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/60 px-4 py-6">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Preview gambar admin"
            className="flex max-h-full w-full max-w-[760px] flex-col overflow-hidden rounded-lg bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-brand-dark/10 px-5 py-4">
              <div className="min-w-0">
                <h2 className="truncate font-serif text-2xl font-bold tracking-wide">
                  {preview.title}
                </h2>
                <p className="mt-1 text-sm font-semibold text-brand-dark/55">
                  {preview.media[preview.index]?.label} - {preview.index + 1} dari {preview.media.length}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-dark/15 transition-colors hover:bg-[#FCF8F2]"
                aria-label="Tutup preview"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative flex min-h-[360px] items-center justify-center bg-[#F5F0EB] p-4 md:min-h-[520px]">
              <img
                src={preview.media[preview.index]?.url}
                alt={preview.media[preview.index]?.label}
                className="max-h-[65vh] w-auto max-w-full rounded-md object-contain"
              />

              {preview.media.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => movePreview(-1)}
                    className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-dark shadow-lg transition-colors hover:bg-white"
                    aria-label="Gambar sebelumnya"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => movePreview(1)}
                    className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-dark shadow-lg transition-colors hover:bg-white"
                    aria-label="Gambar berikutnya"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {preview.media.length > 1 && (
              <div className="flex gap-2 overflow-x-auto border-t border-brand-dark/10 px-4 py-3">
                {preview.media.map((media, index) => (
                  <button
                    key={`${media.url}-${index}`}
                    type="button"
                    onClick={() => setPreview((currentPreview) =>
                      currentPreview ? { ...currentPreview, index } : currentPreview
                    )}
                    className={`h-16 w-14 shrink-0 overflow-hidden rounded-md border transition-colors ${
                      preview.index === index ? 'border-brand-dark' : 'border-brand-dark/10'
                    }`}
                    aria-label={`Pilih ${media.label}`}
                  >
                    <img src={media.url} alt={media.label} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};
