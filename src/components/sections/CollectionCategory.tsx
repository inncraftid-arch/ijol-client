import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { ProductCard } from '../ui/ProductCard';
import { ProductDetailModal } from '../ui/ProductDetailModal';
import type { Product } from '../../types';

interface CollectionCategoryProps {
  title: string;
  products: Product[];
  href?: string;
  isLoading?: boolean;
}

export const CollectionCategory: React.FC<CollectionCategoryProps> = ({
  title,
  products,
  href = '/collections',
  isLoading = false,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="mb-12 md:mb-16">
      <div className="flex items-center justify-between gap-4 mb-6 md:mb-8">
        <h3 className="text-2xl md:text-3xl text-[#C99547] font-serif tracking-wide">{title}</h3>
        <Link to={href} className="shrink-0 px-4 md:px-6 py-2 rounded-full border border-brand-dark text-brand-dark font-semibold hover:bg-brand-dark hover:text-white transition-colors text-xs md:text-sm">
          Lihat Semua
        </Link>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="rounded-xl border border-brand-dark/5 overflow-hidden">
                <div className="aspect-[3/4] bg-[#F5F0EB] animate-pulse" />
                <div className="p-2 space-y-2">
                  <div className="h-3 bg-[#F5F0EB] rounded-full animate-pulse" />
                  <div className="h-3 w-2/3 bg-[#F5F0EB] rounded-full animate-pulse" />
                </div>
              </div>
            ))
          : products.map((product, index) => (
              <motion.div
                key={product.id || index}
                className="h-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <ProductCard product={product} onClick={setSelectedProduct} />
              </motion.div>
            ))}
      </div>

      <ProductDetailModal
        key={selectedProduct?.id || 'empty-product'}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};
