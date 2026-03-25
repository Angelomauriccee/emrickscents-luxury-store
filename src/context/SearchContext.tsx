import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Product } from '../types';

interface SearchContextValue {
  isOpen: boolean;
  searchTerm: string;
  searchResults: Product[];
  isSearching: boolean;
  recentSearches: string[];
  openSearch: () => void;
  closeSearch: () => void;
  setSearchTerm: (term: string) => void;
  setSearchResults: (results: Product[]) => void;
  setIsSearching: (v: boolean) => void;
  addRecentSearch: (term: string) => void;
  clearRecentSearches: () => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);
const RECENT_KEY = 'emrickscents-recent-searches';

export function SearchProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTermState] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const openSearch = useCallback(() => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setSearchTermState('');
    setSearchResults([]);
    document.body.style.overflow = '';
  }, []);

  const setSearchTerm = useCallback((term: string) => {
    setSearchTermState(term);
  }, []);

  const addRecentSearch = useCallback((term: string) => {
    if (!term.trim()) return;
    setRecentSearches((prev) => {
      const updated = [term, ...prev.filter((s) => s !== term)].slice(0, 5);
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_KEY);
  }, []);

  return (
    <SearchContext.Provider
      value={{
        isOpen, searchTerm, searchResults, isSearching, recentSearches,
        openSearch, closeSearch, setSearchTerm, setSearchResults,
        setIsSearching, addRecentSearch, clearRecentSearches,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be used inside SearchProvider');
  return ctx;
}
