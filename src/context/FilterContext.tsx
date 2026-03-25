import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';

interface ActiveFilters {
  category: string | null;
  brand: string | null;
  collection: string | null;
  isNew: boolean | null;
  sortBy: string;
  size: string | null;
  priceRange: string | null;
}

interface FilterContextValue {
  activeFilters: ActiveFilters;
  setFilter: (key: keyof ActiveFilters, value: string | boolean | null) => void;
  clearFilters: () => void;
  clearFilter: (key: keyof ActiveFilters) => void;
}

const defaultFilters: ActiveFilters = {
  category: null,
  brand: null,
  collection: null,
  isNew: null,
  sortBy: 'newest',
  size: null,
  priceRange: null,
};

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(() => ({
    category: searchParams.get('category'),
    brand: searchParams.get('brand'),
    collection: searchParams.get('collection'),
    isNew: searchParams.get('isNew') === 'true' ? true : null,
    sortBy: searchParams.get('sort') || 'newest',
    size: searchParams.get('size'),
    priceRange: searchParams.get('priceRange'),
  }));

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeFilters.category) params.set('category', activeFilters.category);
    if (activeFilters.brand) params.set('brand', activeFilters.brand);
    if (activeFilters.collection) params.set('collection', activeFilters.collection);
    if (activeFilters.isNew) params.set('isNew', 'true');
    if (activeFilters.sortBy && activeFilters.sortBy !== 'newest') params.set('sort', activeFilters.sortBy);
    if (activeFilters.size) params.set('size', activeFilters.size);
    if (activeFilters.priceRange) params.set('priceRange', activeFilters.priceRange);
    setSearchParams(params, { replace: true });
  }, [activeFilters, setSearchParams]);

  const setFilter = useCallback((key: keyof ActiveFilters, value: string | boolean | null) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setActiveFilters(defaultFilters);
  }, []);

  const clearFilter = useCallback((key: keyof ActiveFilters) => {
    setActiveFilters((prev) => ({ ...prev, [key]: key === 'sortBy' ? 'newest' : null }));
  }, []);

  return (
    <FilterContext.Provider value={{ activeFilters, setFilter, clearFilters, clearFilter }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters(): FilterContextValue {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be used inside FilterProvider');
  return ctx;
}
