import React from 'react';
import { products } from '../../data/products';
import { CollectionCategory } from './CollectionCategory';

export const CollectionsSection: React.FC = () => {
  const womenProducts = products.filter(p => p.category === 'women');
  const menProducts = products.filter(p => p.category === 'men');

  // Show dummy grid items if not enough men's products
  const menProductsToDisplay = [...menProducts, ...menProducts, ...menProducts]
    .slice(0, 6)
    .map((product, index) => ({ ...product, id: `men-${index}` }));

  return (
    <section id="collections" className="pt-32 bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-360">
        
        {/* Main Header */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl text-brand-dark mb-2 font-serif tracking-wide">Our Collections</h2>
          <p className="text-brand-dark/60 text-lg">
            Explore our newest collections to Swap
          </p>
        </div>

        {/* Women's Wear Category */}
        <CollectionCategory title="Women's wear" products={womenProducts} />

        {/* Men's Wear Category */}
        <CollectionCategory title="Men's wear" products={menProductsToDisplay} />
        
        {/* Kids Wear Category */}
        {/* <CollectionCategory title="Kids' wear" products={menProductsToDisplay} /> */}

      </div>
    </section>
  );
};
