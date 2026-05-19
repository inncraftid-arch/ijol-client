import React from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from '../ui/ProductCard';
import type { Product } from '../../types';

interface CollectionCategoryProps {
  title: string;
  products: Product[];
}

export const CollectionCategory: React.FC<CollectionCategoryProps> = ({ title, products }) => {
  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-brand-dark/10">
        <h3 className="text-3xl text-[#C99547] font-serif tracking-wide">{title}</h3>
        <button className="px-6 py-2 rounded-full border border-brand-dark text-brand-dark font-semibold hover:bg-brand-dark hover:text-white transition-colors text-sm">
          Lihat Semua
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id || index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
