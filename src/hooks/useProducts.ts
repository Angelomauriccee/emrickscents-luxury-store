import { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../firebase/products';
import { Product, GetProductsOptions, ProductsResult } from '../types';

interface UseProductsReturn extends ProductsResult {
  loading: boolean;
  error: string | null;
  loadMore: () => Promise<void>;
}

export function useProducts(options: GetProductsOptions = {}): UseProductsReturn {
  const [data, setData] = useState<ProductsResult>({
    products: [],
    lastDoc: null,
    hasMore: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const depKey = `${options.category ?? ''}|${options.brand ?? ''}|${options.collection ?? ''}|${options.isNew ?? ''}|${options.sortBy ?? ''}|${options.sortDir ?? ''}|${options.pageSize ?? ''}`;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getProducts(options)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depKey]);

  const loadMore = useCallback(async () => {
    if (!data.hasMore || !data.lastDoc) return;
    setLoading(true);
    try {
      const more = await getProducts({ ...options, lastDoc: data.lastDoc });
      setData((prev) => ({
        products: [...prev.products, ...more.products],
        lastDoc: more.lastDoc,
        hasMore: more.hasMore,
      }));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.hasMore, data.lastDoc, depKey]);

  return { ...data, loading, error, loadMore };
}
