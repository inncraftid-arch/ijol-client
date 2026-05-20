import React from 'react';
import type { Product } from '../../types';
import { IconProfile, IconLocation } from '../icons/ProductIcons';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact';
  onClick?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'default', onClick }) => {
  const isCompact = variant === 'compact';
  const displayCondition = product.condition.split('(')[0].trim();
  const brandLabel = product.isNonBranded ? 'Non Branded' : 'Branded';

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick(product);
    }
  };

  return (
    <div
      data-product-card
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={() => onClick?.(product)}
      onKeyDown={handleKeyDown}
      className={`group flex flex-col bg-white rounded-xl overflow-hidden hover:shadow-md transition-shadow border border-brand-dark/5 ${onClick ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2' : ''}`}
    >
      {/* Image Section */}
      <div className={`relative bg-[#F5F0EB] overflow-hidden ${isCompact ? 'aspect-[5/6]' : 'aspect-[3/4]'}`}>
        {/* Top Badges overlay */}
        <div className="absolute top-2 right-2 flex gap-1 z-10">
          <div className={`bg-white text-[10px] font-bold rounded-full shadow-sm ${isCompact ? 'px-1.5 py-0' : 'px-2 py-0.5'}`}>
            {product.label}
          </div>
          <div
            className={`bg-white text-[10px] font-medium rounded-full shadow-sm ${
              product.isNonBranded ? 'text-[#C99547]' : 'text-brand-dark'
            } ${isCompact ? 'px-1.5 py-0' : 'px-2 py-0.5'}`}
          >
            {brandLabel}
          </div>
        </div>

        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content Section */}
      <div className={`${isCompact ? 'p-2 gap-1' : 'p-3 gap-1'} flex flex-col border-t border-brand-dark/5 bg-white`}>
        <h4 className={`font-bold text-brand-dark line-clamp-2 ${isCompact ? 'text-xs min-h-8' : 'text-base h-12'}`} title={product.name}>
          {product.name}
        </h4>

        <div className={`flex items-center justify-start gap-1.5 ${isCompact ? 'mt-3' : 'mt-4'}`}>
          <span className={`bg-[#FCF8F2] text-[#4A3D30] font-medium px-2 py-0.5 rounded-sm ${isCompact ? 'text-[10px]' : 'text-sm'}`}>
            Size: {product.sizes[0]}
          </span>
          <span
            className={`truncate bg-gray-100 text-gray-400 font-medium px-2 py-0.5 rounded-sm ${isCompact ? 'max-w-20 text-[10px]' : 'max-w-28 text-sm'}`}
            title={product.condition}
          >
            {displayCondition}
          </span>
        </div>

        <div className={`flex items-center justify-between gap-2 text-brand-dark/60 mt-1 ${isCompact ? 'text-[11px]' : 'text-base'}`}>
          <div className="flex max-w-[40%] min-w-0 shrink-0 items-center gap-1.5">
            <IconProfile className={`shrink-0 text-brand-dark/40 ${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} />
            <span className="truncate" title={product.owner.name}>{product.owner.name}</span>
          </div>
          <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-1.5">
            <IconLocation className={`shrink-0 text-brand-dark/40 ${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} />
            <span className="truncate" title={product.location}>{product.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
