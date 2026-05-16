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

  const optionsKey = JSON.stringify(options);

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
  }, [optionsKey]);

  const loadMore = useCallback(async () => {
    if (!data.hasMore || !data.lastDoc) return;
    setLoading(true);
    // Parse options fresh from key to avoid stale closure over options prop
    const currentOptions = JSON.parse(optionsKey) as GetProductsOptions;
    try {
      const more = await getProducts({ ...currentOptions, lastDoc: data.lastDoc });
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
  }, [data.hasMore, data.lastDoc, optionsKey]);

  return { ...data, loading, error, loadMore };
}
