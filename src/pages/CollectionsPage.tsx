import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'react-router';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ProductCard } from '../components/ui/ProductCard';
import { ProductDetailModal } from '../components/ui/ProductDetailModal';
import { PricingSection } from '../components/sections/PricingSection';
import { SafetySection } from '../components/sections/SafetySection';
import { useCollectionsQuery } from '../hooks/useCollectionsQuery';
import { useResponsivePageSize } from '../hooks/useResponsivePageSize';
import type { CollectionCategory } from '../services/collectionsService';
import type { Product } from '../types';

const filters: { label: string; value: CollectionCategory }[] = [
  { label: 'Semua', value: 'all' },
  { label: 'Wanita', value: 'female' },
  { label: 'Pria', value: 'male' },
  { label: 'Unisex', value: 'unisex' },
];

const getInitialCategory = (category: string | null): CollectionCategory => {
  if (category === 'female' || category === 'male' || category === 'unisex') {
    return category;
  }

  return 'all';
};

export const CollectionsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const pageSize = useResponsivePageSize();
  const [activeFilter, setActiveFilter] = useState<CollectionCategory>(() =>
    getInitialCategory(categoryParam)
  );
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { products, total, currentPage, totalPages, isLoading, error } = useCollectionsQuery({
    page,
    pageSize,
    category: activeFilter,
  });

  const visiblePages = useMemo(() => {
    const pages = new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages]);
    return Array.from(pages)
      .filter((pageNumber) => pageNumber >= 1 && pageNumber <= totalPages)
      .sort((a, b) => a - b);
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen flex flex-col font-sans text-brand-dark bg-white">
      <Navbar />

      <main className="grow">
        <section className="pt-32 md:pt-36 pb-16 bg-white">
          <div className="container mx-auto px-4 md:px-8 max-w-[1440px]">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl text-brand-dark font-serif tracking-wide leading-none">
                Our Collections
              </h1>
              <p className="text-brand-dark/40 text-lg md:text-2xl mt-3">
                Explore our newest collections to Swap
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => {
                    setActiveFilter(filter.value);
                    setPage(1);
                  }}
                  className={`min-w-16 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${
                    activeFilter === filter.value
                      ? 'border-[#EAE1D8] bg-[#EAE1D8] text-brand-dark'
                      : 'border-brand-dark text-brand-dark hover:bg-[#FCF8F2]'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {error ? (
              <div className="rounded-2xl border border-brand-dark/10 bg-[#FCF8F2] py-14 px-6 text-center">
                <h2 className="text-2xl text-brand-dark font-serif tracking-wide mb-2">{error}</h2>
                <p className="text-brand-dark/60">Coba refresh halaman beberapa saat lagi.</p>
              </div>
            ) : (
              <>
                <div data-collections-grid className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-5 gap-y-8">
                  {isLoading
                    ? Array.from({ length: pageSize }).map((_, index) => (
                        <div key={index} className="rounded-xl border border-brand-dark/5 overflow-hidden">
                          <div className="aspect-[3/4] bg-[#F5F0EB] animate-pulse" />
                          <div className="p-2 space-y-2">
                            <div className="h-3 bg-[#F5F0EB] rounded-full animate-pulse" />
                            <div className="h-3 w-2/3 bg-[#F5F0EB] rounded-full animate-pulse" />
                          </div>
                        </div>
                      ))
                    : products.map((product) => (
                        <ProductCard key={product.id} product={product} onClick={setSelectedProduct} />
                      ))}
                </div>

                {!isLoading && products.length === 0 && (
                  <div className="rounded-2xl border border-brand-dark/10 bg-[#FCF8F2] py-14 px-6 text-center">
                    <h2 className="text-2xl text-brand-dark font-serif tracking-wide mb-2">Koleksi belum ditemukan</h2>
                    <p className="text-brand-dark/60">Coba pilih kategori koleksi lain.</p>
                  </div>
                )}

                {!isLoading && total > 0 && (
                  <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-5">
                    <p className="text-sm text-brand-dark/50">
                      Menampilkan {products.length} dari {total} koleksi
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() => setPage((prevPage) => Math.max(1, prevPage - 1))}
                        className="w-10 h-10 rounded-full border border-brand-dark/15 flex items-center justify-center text-brand-dark disabled:opacity-35 disabled:cursor-not-allowed hover:bg-[#FCF8F2]"
                        aria-label="Halaman sebelumnya"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {visiblePages.map((pageNumber) => (
                        <button
                          key={pageNumber}
                          type="button"
                          onClick={() => setPage(pageNumber)}
                          className={`w-10 h-10 rounded-full border text-sm font-bold transition-colors ${
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
                        onClick={() => setPage((prevPage) => Math.min(totalPages, prevPage + 1))}
                        className="w-10 h-10 rounded-full border border-brand-dark/15 flex items-center justify-center text-brand-dark disabled:opacity-35 disabled:cursor-not-allowed hover:bg-[#FCF8F2]"
                        aria-label="Halaman berikutnya"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <PricingSection />
        <SafetySection />
      </main>

      <Footer />
      <ProductDetailModal
        key={selectedProduct?.id || 'empty-product'}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};
