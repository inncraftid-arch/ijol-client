import React from 'react';
import { useCollectionsQuery } from '../../hooks/useCollectionsQuery';
import { CollectionCategory } from './CollectionCategory';

export const CollectionsSection: React.FC = () => {
  const femaleCollection = useCollectionsQuery({
    page: 1,
    pageSize: 6,
    category: 'female',
  });
  const maleCollection = useCollectionsQuery({
    page: 1,
    pageSize: 6,
    category: 'male',
  });
  const unisexCollection = useCollectionsQuery({
    page: 1,
    pageSize: 6,
    category: 'unisex',
  });

  return (
    <section id="collections" className="pt-20 md:pt-28 lg:pt-32 bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-[1440px]">
        <div className="mb-10 md:mb-16">
          <h2 className="text-4xl md:text-5xl text-brand-dark mb-2 font-serif tracking-wide">Our Collections</h2>
          <p className="text-brand-dark/60 text-base md:text-lg">
            Explore our newest collections to Swap
          </p>
        </div>

        <CollectionCategory
          title="Women's wear"
          products={femaleCollection.products}
          href="/collections?category=female"
          isLoading={femaleCollection.isLoading}
        />

        <CollectionCategory
          title="Men's wear"
          products={maleCollection.products}
          href="/collections?category=male"
          isLoading={maleCollection.isLoading}
        />

        <CollectionCategory
          title="Unisex"
          products={unisexCollection.products}
          href="/collections?category=unisex"
          isLoading={unisexCollection.isLoading}
        />
      </div>
    </section>
  );
};
