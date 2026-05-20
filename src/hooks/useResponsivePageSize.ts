import { useEffect, useState } from 'react';

export function useResponsivePageSize() {
  const getPageSize = () => {
    if (typeof window === 'undefined') {
      return 24;
    }

    if (window.matchMedia('(max-width: 767px)').matches) {
      return 10;
    }

    if (window.matchMedia('(max-width: 1023px)').matches) {
      return 16;
    }

    return 24;
  };

  const [pageSize, setPageSize] = useState(getPageSize);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const tabletQuery = window.matchMedia('(max-width: 1023px)');
    const handleChange = () => setPageSize(getPageSize());

    handleChange();
    mobileQuery.addEventListener('change', handleChange);
    tabletQuery.addEventListener('change', handleChange);

    return () => {
      mobileQuery.removeEventListener('change', handleChange);
      tabletQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return pageSize;
}
