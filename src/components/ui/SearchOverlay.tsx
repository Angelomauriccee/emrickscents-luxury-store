import { useRef, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext';
import { useDebounce } from '../../hooks/useDebounce';
import { searchProducts } from '../../firebase/search';
import { ProductCard } from './ProductCard';
import gsap from 'gsap';

export function SearchOverlay() {
  const {
    isOpen, searchTerm, searchResults, isSearching,
    recentSearches, closeSearch, setSearchTerm,
    setSearchResults, setIsSearching, addRecentSearch,
  } = useSearch();

  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedTerm = useDebounce(searchTerm, 400);

  useEffect(() => {
    const overlay = overlayRef.current;
    const content = contentRef.current;
    if (!overlay || !content) return;

    if (isOpen) {
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(content, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, delay: 0.1, ease: 'power2.out' });
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) closeSearch();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, closeSearch]);

  useEffect(() => {
    if (!debouncedTerm || debouncedTerm.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    searchProducts(debouncedTerm)
      .then(setSearchResults)
      .catch(() => setSearchResults([]))
      .finally(() => setIsSearching(false));
  }, [debouncedTerm, setSearchResults, setIsSearching]);

  const handleClose = () => {
    const overlay = overlayRef.current;
    if (!overlay) { closeSearch(); return; }
    gsap.to(overlay, { opacity: 0, duration: 0.25, onComplete: closeSearch });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) addRecentSearch(searchTerm.trim());
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10,10,10,0.97)',
        zIndex: 1000,
        overflowY: 'auto',
        padding: '60px 0',
      }}
    >
      {/* Close */}
      <button
        onClick={handleClose}
        style={{
          position: 'fixed',
          top: '24px',
          right: '40px',
          color: 'var(--text-secondary)',
          padding: '8px',
          transition: 'color 0.2s',
          zIndex: 1,
        }}
        aria-label="Close search"
      >
        <FiX size={24} />
      </button>

      <div ref={contentRef} className="container-content" style={{ maxWidth: '900px' }}>
        {/* Label */}
        <p className="text-label" style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '32px' }}>
          SEARCH FRAGRANCES
        </p>

        {/* Input */}
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Hugo Boss, Chanel, Oud..."
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid var(--bg-border)',
              outline: 'none',
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: '42px',
              color: 'var(--text-primary)',
              paddingBottom: '16px',
              textAlign: 'center',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--gold)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--bg-border)')}
          />
        </form>

        {/* Recent searches */}
        {recentSearches.length > 0 && !searchTerm && (
          <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span className="text-label" style={{ color: 'var(--text-muted)' }}>RECENTLY VIEWED</span>
            {recentSearches.map((term) => (
              <button
                key={term}
                onClick={() => setSearchTerm(term)}
                className="filter-pill"
              >
                {term.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        {(searchTerm.length >= 2) && (
          <div style={{ marginTop: '60px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: '32px' }}>
                Curated Suggestions
              </h2>
              <span className="text-label" style={{ color: 'var(--text-muted)' }}>
                {isSearching ? 'SEARCHING...' : `${searchResults.length} RESULTS FOUND`}
              </span>
            </div>
            {searchResults.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }} className="search-grid">
                {searchResults.slice(0, 8).map((product) => (
                  <div key={product.id} onClick={handleClose}>
                    <ProductCard product={product} showQuickAdd={false} />
                  </div>
                ))}
              </div>
            )}
            {!isSearching && searchResults.length === 0 && (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
                No fragrances found for "{searchTerm}"
              </p>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .search-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
