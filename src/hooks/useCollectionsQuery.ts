import { useEffect, useState } from 'react';
import type { Product } from '../types';
import {
  fetchCollections,
  type CollectionCategory,
  type FetchCollectionsResult,
} from '../services/collectionsService';

interface UseCollectionsQueryParams {
  page: number;
  pageSize: number;
  category: CollectionCategory;
  search?: string;
}

type QueryState = {
  key: string;
  result: FetchCollectionsResult;
  error: string | null;
};

const emptyResult: FetchCollectionsResult = {
  data: [],
  total: 0,
  page: 1,
  pageSize: 20,
  totalPages: 1,
};

export function useCollectionsQuery({
  page,
  pageSize,
  category,
  search = '',
}: UseCollectionsQueryParams) {
  const queryKey = `${page}:${pageSize}:${category}:${search}`;
  const [queryState, setQueryState] = useState<QueryState>({
    key: '',
    result: emptyResult,
    error: null,
  });

  useEffect(() => {
    let isCurrent = true;

    fetchCollections({ page, pageSize, category, search })
      .then((nextResult) => {
        if (!isCurrent) {
          return;
        }

        setQueryState({
          key: queryKey,
          result: nextResult,
          error: null,
        });
      })
      .catch(() => {
        if (!isCurrent) {
          return;
        }

        setQueryState({
          key: queryKey,
          result: { ...emptyResult, pageSize },
          error: 'Koleksi belum bisa dimuat.',
        });
      });

    return () => {
      isCurrent = false;
    };
  }, [category, page, pageSize, queryKey, search]);

  const isLoading = queryState.key !== queryKey;
  const result = isLoading ? { ...emptyResult, pageSize } : queryState.result;

  return {
    products: result.data as Product[],
    total: result.total,
    currentPage: result.page,
    totalPages: result.totalPages,
    isLoading,
    error: isLoading ? null : queryState.error,
  };
}
