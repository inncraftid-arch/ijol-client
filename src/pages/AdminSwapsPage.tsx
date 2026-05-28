import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  LogOut,
  MessageCircle,
  RefreshCw,
  Repeat2,
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
  acceptAdminSwapOffer,
  completeAdminSwap,
  fetchAdminSwapRequests,
  markSwapOwnerContacted,
  rejectAdminSwapOffer,
  type AdminSwapRequest,
  type AdminSwapRequestStatus,
} from '../services/adminSwapRequestsService';

type StatusFilter = 'all' | AdminSwapRequestStatus;

const pageSize = 15;

const statusLabels: Record<AdminSwapRequestStatus, string> = {
  pending_admin_review: 'Pending Admin',
  owner_contacted: 'Owner Contacted',
  accepted_by_owner: 'Accepted',
  rejected_by_owner: 'Rejected',
  closed_other_offer_accepted: 'Closed',
  cancelled_by_requester: 'Cancelled',
  cancelled_by_admin: 'Cancelled Admin',
  completed: 'Completed',
};

const statusStyles: Record<AdminSwapRequestStatus, string> = {
  pending_admin_review: 'border-amber-200 bg-amber-50 text-amber-700',
  owner_contacted: 'border-blue-200 bg-blue-50 text-blue-700',
  accepted_by_owner: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  rejected_by_owner: 'border-red-200 bg-red-50 text-red-700',
  closed_other_offer_accepted: 'border-brand-dark/10 bg-[#F5F0EB] text-brand-dark/55',
  cancelled_by_requester: 'border-brand-dark/10 bg-[#F5F0EB] text-brand-dark/55',
  cancelled_by_admin: 'border-brand-dark/10 bg-[#F5F0EB] text-brand-dark/55',
  completed: 'border-purple-200 bg-purple-50 text-purple-700',
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));

const getReviewUrl = (token: string) => `${window.location.origin}/swap-review/${token}`;

const getCounts = (requests: AdminSwapRequest[]) =>
  requests.reduce(
    (result, request) => ({
      ...result,
      all: result.all + 1,
      [request.status]: result[request.status] + 1,
    }),
    {
      all: 0,
      pending_admin_review: 0,
      owner_contacted: 0,
      accepted_by_owner: 0,
      rejected_by_owner: 0,
      closed_other_offer_accepted: 0,
      cancelled_by_requester: 0,
      cancelled_by_admin: 0,
      completed: 0,
    }
  );

export const AdminSwapsPage: React.FC = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [requests, setRequests] = useState<AdminSwapRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending_admin_review');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [updatingRequestId, setUpdatingRequestId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadRequests = async (activeSession: AdminSession, isSilent = false) => {
    if (isSilent) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError('');

    try {
      const adminRequests = await fetchAdminSwapRequests(activeSession.accessToken);
      setRequests(adminRequests);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Gagal mengambil request tukar.');
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
      loadRequests(validSession);
    });

    return () => {
      isActive = false;
    };
  }, [navigate]);

  const counts = useMemo(() => getCounts(requests), [requests]);
  const filteredRequests = useMemo(
    () => requests.filter((request) => statusFilter === 'all' || request.status === statusFilter),
    [requests, statusFilter]
  );
  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedRequests = filteredRequests.slice(
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

  const runAction = async (requestId: string, action: () => Promise<void>, successMessage: string) => {
    if (!session) {
      return;
    }

    setUpdatingRequestId(requestId);
    setError('');
    setNotice('');

    try {
      await action();
      setNotice(successMessage);
      await loadRequests(session, true);
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Gagal menjalankan aksi request.');
    } finally {
      setUpdatingRequestId(null);
    }
  };

  const copyReviewLink = async (request: AdminSwapRequest) => {
    const reviewUrl = getReviewUrl(request.reviewToken);

    try {
      await navigator.clipboard.writeText(reviewUrl);
      setNotice('Link review owner sudah disalin.');
      setError('');
    } catch {
      setError(`Gagal copy otomatis. Link review: ${reviewUrl}`);
    }
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
              <h1 className="font-serif text-2xl font-bold tracking-wide">Request Tukar</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/items"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-brand-dark/15 bg-white px-4 text-sm font-bold transition-colors hover:bg-[#FCF8F2]"
            >
              <Shirt className="h-4 w-4" />
              QC Items
            </Link>
            <span className="rounded-full bg-[#FCF8F2] px-4 py-2 text-xs font-semibold text-brand-dark/70">
              {session?.user.email}
            </span>
            <button
              type="button"
              onClick={() => session && loadRequests(session, true)}
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
        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-5">
          {[
            { label: 'Semua', value: 'all' as StatusFilter, count: counts.all },
            {
              label: 'Pending',
              value: 'pending_admin_review' as StatusFilter,
              count: counts.pending_admin_review,
            },
            {
              label: 'Contacted',
              value: 'owner_contacted' as StatusFilter,
              count: counts.owner_contacted,
            },
            {
              label: 'Accepted',
              value: 'accepted_by_owner' as StatusFilter,
              count: counts.accepted_by_owner,
            },
            { label: 'Completed', value: 'completed' as StatusFilter, count: counts.completed },
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
            Menampilkan {paginatedRequests.length} dari {filteredRequests.length} request
          </p>
          <p className="text-sm font-semibold text-brand-dark/55">
            Halaman {currentPage} dari {totalPages}
          </p>
        </div>

        {notice && (
          <div className="mb-5 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {notice}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-lg border border-brand-dark/10 bg-white py-16 text-center">
            <p className="text-sm font-semibold text-brand-dark/60">Mengambil request tukar...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="rounded-lg border border-brand-dark/10 bg-white py-16 text-center">
            <Repeat2 className="mx-auto h-8 w-8 text-brand-dark/30" />
            <h2 className="mt-3 font-serif text-2xl font-bold tracking-wide">Belum ada request</h2>
            <p className="mt-1 text-sm text-brand-dark/55">Coba ubah filter status request.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedRequests.map((request) => {
              const canMarkOwnerContacted = request.status === 'pending_admin_review';
              const canRecordOwnerDecision = request.status === 'owner_contacted';
              const isAccepted = request.status === 'accepted_by_owner';
              const reviewUrl = getReviewUrl(request.reviewToken);

              return (
                <article
                  key={request.id}
                  className="overflow-hidden rounded-lg border border-brand-dark/10 bg-white"
                >
                  <div className="flex flex-col gap-4 border-b border-brand-dark/10 bg-[#FCF8F2] px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-bold ${statusStyles[request.status]}`}
                        >
                          {statusLabels[request.status]}
                        </span>
                        <span className="text-xs font-semibold text-brand-dark/45">
                          Dibuat {formatDate(request.createdAt)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-brand-dark/55">
                        Expire link: {formatDate(request.reviewTokenExpiresAt)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <a
                        href={reviewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 items-center gap-2 rounded-full border border-brand-dark/15 bg-white px-4 text-sm font-bold transition-colors hover:bg-[#FCF8F2]"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Buka link
                      </a>
                      <button
                        type="button"
                        onClick={() => void copyReviewLink(request)}
                        className="inline-flex h-10 items-center gap-2 rounded-full border border-brand-dark/15 bg-white px-4 text-sm font-bold transition-colors hover:bg-[#FCF8F2]"
                      >
                        <Copy className="h-4 w-4" />
                        Copy link
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-5 p-4 xl:grid-cols-[1.05fr_1fr_1.45fr_210px]">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-brand-dark/40">
                        Item yang diminta
                      </p>
                      <div className="mt-3 flex gap-3">
                        <img
                          src={request.targetItem.image}
                          alt={request.targetItem.name}
                          className="h-28 w-24 shrink-0 rounded-md object-cover"
                          loading="lazy"
                        />
                        <div className="min-w-0">
                          <h2 className="line-clamp-2 font-bold">{request.targetItem.name}</h2>
                          <p className="mt-1 text-sm font-semibold text-brand-dark/55">
                            {request.targetItem.label} · Size {request.targetItem.sizes[0]}
                          </p>
                          <p className="mt-2 text-sm text-brand-dark/60">
                            Owner: <strong>{request.targetOwner.name}</strong>
                          </p>
                          <p className="mt-1 text-sm text-brand-dark/55">
                            {request.targetOwner.phone} · {request.targetOwner.city}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-brand-dark/40">
                        Requester
                      </p>
                      <div className="mt-3 rounded-md bg-[#F5F0EB] p-4 text-sm">
                        <p className="font-bold">{request.requester.name}</p>
                        <p className="mt-1 font-semibold text-brand-dark/60">{request.requester.phone}</p>
                        <p className="mt-1 text-brand-dark/55">{request.requester.city}</p>
                        {request.ownerContactedAt && (
                          <p className="mt-3 text-xs font-semibold text-brand-dark/40">
                            Owner contacted {formatDate(request.ownerContactedAt)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-brand-dark/40">
                        Item yang ditawarkan
                      </p>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        {request.offeredItems.map((item) => {
                          const isSelected = request.selectedOfferedItemId === item.id;

                          return (
                            <div
                              key={item.id}
                              className={`rounded-md border p-2 ${
                                isSelected
                                  ? 'border-emerald-300 bg-emerald-50'
                                  : 'border-brand-dark/10 bg-white'
                              }`}
                            >
                              <div className="flex gap-3">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-20 w-16 shrink-0 rounded object-cover"
                                  loading="lazy"
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="line-clamp-2 text-sm font-bold">{item.name}</p>
                                  <p className="mt-1 text-xs font-semibold text-brand-dark/55">
                                    {item.label} · Size {item.sizes[0]}
                                  </p>
                                  {isSelected && (
                                    <p className="mt-1 text-xs font-bold text-emerald-700">
                                      Dipilih
                                    </p>
                                  )}
                                </div>
                              </div>
                              {canRecordOwnerDecision && (
                                <button
                                  type="button"
                                  disabled={updatingRequestId === request.id}
                                  onClick={() => {
                                    if (!window.confirm(`Catat owner memilih item "${item.name}"?`)) {
                                      return;
                                    }

                                    void runAction(
                                      request.id,
                                      () =>
                                        session
                                          ? acceptAdminSwapOffer(session.accessToken, request.id, item.id)
                                          : Promise.resolve(),
                                      'Offer berhasil diterima.'
                                    );
                                  }}
                                  className="mt-2 inline-flex h-9 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-3 text-xs font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-45"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                  Catat Owner Pilih Ini
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {canMarkOwnerContacted && (
                        <button
                          type="button"
                          disabled={updatingRequestId === request.id}
                          onClick={() =>
                            void runAction(
                              request.id,
                              () =>
                                session
                                  ? markSwapOwnerContacted(session.accessToken, request.targetItem.id)
                                  : Promise.resolve(),
                              'Request ditandai sudah menghubungi owner.'
                            )
                          }
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-45"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Owner contacted
                        </button>
                      )}
                      {canRecordOwnerDecision && (
                        <button
                          type="button"
                          disabled={updatingRequestId === request.id}
                          onClick={() => {
                            if (!window.confirm('Catat owner menolak request tukar ini?')) {
                              return;
                            }

                            void runAction(
                              request.id,
                              () =>
                                session
                                  ? rejectAdminSwapOffer(session.accessToken, request.id)
                                  : Promise.resolve(),
                              'Request berhasil direject.'
                            );
                          }}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-red-600 px-4 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-45"
                        >
                          <X className="h-4 w-4" />
                          Tandai Ditolak Owner
                        </button>
                      )}
                      {isAccepted && (
                        <button
                          type="button"
                          disabled={updatingRequestId === request.id}
                          onClick={() => {
                            if (!window.confirm('Selesaikan swap ini dan ubah item menjadi swapped?')) {
                              return;
                            }

                            void runAction(
                              request.id,
                              () =>
                                session
                                  ? completeAdminSwap(session.accessToken, request.id)
                                  : Promise.resolve(),
                              'Swap berhasil diselesaikan.'
                            );
                          }}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand-dark px-4 text-sm font-bold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-45"
                        >
                          <Check className="h-4 w-4" />
                          Complete
                        </button>
                      )}
                      {!canMarkOwnerContacted && !canRecordOwnerDecision && !isAccepted && (
                        <div className="rounded-md bg-[#F5F0EB] px-4 py-3 text-sm font-semibold text-brand-dark/45">
                          Tidak ada aksi aktif.
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}

            {totalPages > 1 && (
              <div className="flex flex-col gap-3 rounded-lg border border-brand-dark/10 bg-white px-4 py-4 md:flex-row md:items-center md:justify-between">
                <p className="text-sm font-semibold text-brand-dark/50">
                  {pageSize} request per halaman
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
    </main>
  );
};
