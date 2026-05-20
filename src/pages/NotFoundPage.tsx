import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate('/');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F0EB] px-5 text-brand-dark">
      <section className="w-full max-w-[520px] rounded-lg border border-brand-dark/10 bg-white px-6 py-10 text-center shadow-sm md:px-10">
        <img src="/assets/images/logo.light.svg" alt="IJOL" className="mx-auto h-8" />
        <p className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-brand-gold">
          404
        </p>
        <h1 className="mt-3 font-serif text-3xl font-bold tracking-wide md:text-4xl">
          Halaman Tidak Ditemukan
        </h1>
        <p className="mx-auto mt-3 max-w-[360px] text-sm leading-relaxed text-brand-dark/60 md:text-base">
          Link ini belum tersedia atau alamatnya berubah.
        </p>
        <button
          type="button"
          onClick={handleBack}
          className="mx-auto mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-dark px-6 text-sm font-bold text-white transition-colors hover:bg-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke halaman sebelumnya
        </button>
      </section>
    </main>
  );
};
