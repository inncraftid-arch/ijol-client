import React from 'react';
import type { Product } from '../../types';
import { IconProfile, IconLocation } from '../icons/ProductIcons';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group flex flex-col bg-white rounded-xl overflow-hidden hover:shadow-md transition-shadow border border-brand-dark/5">
      {/* Image Section */}
      <div className="relative aspect-[3/4] bg-[#F5F0EB] overflow-hidden">
        {/* Top Badges overlay */}
        <div className="absolute top-2 right-2 flex gap-1 z-10">
          <div className="bg-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            {product.label}
          </div>
          {product.isNonBranded && (
            <div className="bg-white text-[#C99547] text-[10px] font-medium px-2 py-0.5 rounded-full shadow-sm">
              Non Branded
            </div>
          )}
        </div>

        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content Section */}
      <div className="p-3 flex flex-col gap-1 border-t border-brand-dark/5 bg-white">
        <h4 className="font-bold text-brand-dark text-base line-clamp-2 h-12" title={product.name}>
          {product.name}
        </h4>

        <div className="flex items-center justify-start gap-1.5 mt-4">
          <span className="bg-[#FCF8F2] text-[#4A3D30] text-sm font-medium px-2 py-0.5 rounded-sm">
            Size: {product.sizes[0]}
          </span>
          <span className="bg-gray-100 text-gray-400 text-sm font-medium px-2 py-0.5 rounded-sm">
            {product.condition}
          </span>
        </div>

        <div className="flex items-center justify-between text-base text-brand-dark/60 mt-1">
          <div className="flex items-center gap-1.5">
            <IconProfile className="text-brand-dark/40 w-4 h-4" />
            <span>{product.owner.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <IconLocation className="text-brand-dark/40 w-4 h-4" />
            <span>{product.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
