import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterBar } from '../components/ui/FilterBar';
import { FilterDrawer } from '../components/ui/FilterDrawer';
import { ProductCard } from '../components/ui/ProductCard';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { Pagination } from '../components/ui/Pagination';
import { EmptyState } from '../components/ui/EmptyState';
import { Footer } from '../components/layout/Footer';
import { FilterProvider, useFilters } from '../context/FilterContext';
import { getProducts } from '../firebase/products';
import { Product } from '../types';
import { PRODUCTS_PER_PAGE } from '../utils/constants';
import { formatPrice } from '../utils/formatPrice';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import gsap from 'gsap';
import { FiShoppingBag } from 'react-icons/fi';

// Price range helper
function matchesPriceRange(price: number, range: string | null): boolean {
  if (!range) return true;
  if (range === 'under-100k') return price < 100000;
  if (range === '100k-300k') return price >= 100000 && price <= 300000;
  if (range === '300k-500k') return price > 300000 && price <= 500000;
  if (range === 'above-500k') return price > 500000;
  return true;
}

// List row component
function ProductListRow({ product }: { product: Product }) {
  const { addToCart } = useCart();
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '100px 1fr auto',
        gap: '24px',
        alignItems: 'center',
        padding: '20px 0',
        borderBottom: '1px solid var(--bg-border)',
        transition: 'background 0.2s',
      }}
      className="list-row"
    >
      <Link to={`/product/${product.id}`}>
        <div style={{ width: '100px', height: '120px', background: 'var(--bg-surface)', overflow: 'hidden', flexShrink: 0 }}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            className="list-img"
          />
        </div>
      </Link>
      <div style={{ minWidth: 0 }}>
        <p className="text-label" style={{ color: 'var(--gold-muted)', marginBottom: '6px' }}>
          {(product.collection ?? '').toUpperCase()}
        </p>
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '22px', color: 'var(--text-primary)', marginBottom: '6px', lineHeight: 1.2 }}>
            {product.name}
          </h3>
        </Link>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '10px' }}>
          {product.type} · {product.size}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {product.originalPrice && (
            <span style={{ color: 'var(--text-muted)', fontSize: '13px', textDecoration: 'line-through' }}>
              {formatPrice(product.originalPrice)}
            </span>
          )}
          <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: '18px' }}>
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
      <button
        className="btn-primary btn-sm"
        onClick={() => addToCart(product)}
        style={{ whiteSpace: 'nowrap' }}
      >
        ADD TO CART
      </button>
      <style>{`
        .list-row:hover .list-img { transform: scale(1.04); }
        .list-row:hover { background: var(--gold-glow); }
      `}</style>
    </div>
  );
}

function ShopContent() {
  const { activeFilters } = useFilters();
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [allBrands, setAllBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(() => parseInt(searchParams.get('page') || '1', 10));

  const getSortParams = (sortBy: string) => {
    switch (sortBy) {
      case 'price_asc': return { sortBy: 'price', sortDir: 'asc' as const };
      case 'price_desc': return { sortBy: 'price', sortDir: 'desc' as const };
      case 'az': return { sortBy: 'name', sortDir: 'asc' as const };
      default: return { sortBy: 'name', sortDir: 'asc' as const };
    }
  };

  // 1. Fetch ALL products ONCE
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    // Fetch a large page size to get all products in the database
    getProducts({ pageSize: 250 }).then((result) => {
      if (cancelled) return;
      setAllProducts(result.products);

      // Extract all unique brands
      const brandsSet = new Set<string>();
      result.products.forEach(p => {
        if (p.brand) {
          brandsSet.add(p.brand);
        } else {
          // Fallback: guess brand from name (first word)
          const firstWord = p.name.split(' ')[0];
          brandsSet.add(firstWord);
        }
      });
      setAllBrands(Array.from(brandsSet).sort());
      setLoading(false);
    }).catch((err) => {
      if (cancelled) return;
      console.error('Firestore getProducts error:', err);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  // 2. Perform ALL filtering and sorting client-side
  useEffect(() => {
    if (allProducts.length === 0) return;

    let filtered = [...allProducts];

    if (activeFilters.category) {
      filtered = filtered.filter(p => p.category === activeFilters.category);
    }
    if (activeFilters.brand) {
      const lowerBrand = activeFilters.brand.toLowerCase();
      filtered = filtered.filter(p => 
        (p.brand && p.brand.toLowerCase() === lowerBrand) ||
        p.name.toLowerCase().includes(lowerBrand)
      );
    }
    if (activeFilters.collection) {
      filtered = filtered.filter(p => p.collection === activeFilters.collection);
    }
    if (activeFilters.isNew) {
      filtered = filtered.filter(p => p.isNew);
    }
    if (activeFilters.size) {
      filtered = filtered.filter(p => p.size === activeFilters.size);
    }
    if (activeFilters.priceRange) {
      filtered = filtered.filter(p => matchesPriceRange(p.price, activeFilters.priceRange));
    }

    const { sortBy, sortDir } = getSortParams(activeFilters.sortBy);
    if (sortBy === 'price') {
      filtered.sort((a, b) => sortDir === 'asc' ? a.price - b.price : b.price - a.price);
    } else {
      filtered.sort((a, b) => sortDir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
    }

    setProducts(filtered);
    setTotalCount(filtered.length);
    setCurrentPage(1);

    if (viewMode === 'grid') {
      requestAnimationFrame(() => {
        gsap.from('.shop-card', { y: 30, opacity: 0, duration: 0.5, ease: 'power2.out', stagger: 0.04 });
      });
    }
  }, [allProducts, activeFilters, viewMode]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams((prev) => { prev.set('page', String(page)); return prev; }, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Paginate client-side
  const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const visibleProducts = products.slice(start, start + PRODUCTS_PER_PAGE);
  const clientTotalPages = Math.max(1, Math.ceil(products.length / PRODUCTS_PER_PAGE));

  return (
    <>
      {/* Page header */}
      <div style={{
        minHeight: '240px', background: 'var(--bg-elevated)', borderBottom: '1px solid var(--gold-line)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 80px',
      }}>
        <p className="text-label" style={{ color: 'var(--gold-muted)', marginBottom: '12px' }}>FRAGRANCES</p>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 300, fontStyle: 'normal',
          fontSize: 'clamp(52px, 6vw, 72px)', color: 'var(--text-primary)', lineHeight: 1.0, margin: '12px 0',
        }}>The Collection</h1>
        <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 400, fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {loading ? 'Loading...' : `${totalCount} fragrances · Chanel, Dior, YSL, and more`}
        </p>
      </div>

      {/* Filter bar */}
      <FilterBar
        totalCount={loading ? undefined : totalCount}
        viewMode={viewMode}
        onViewChange={setViewMode}
        onOpenDrawer={() => setDrawerOpen(true)}
      />
      <FilterDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} brands={allBrands} />

      {/* Content */}
      <div className="container-content" style={{ padding: '48px 80px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }} className="shop-grid">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : visibleProducts.length === 0 ? (
          <EmptyState
            icon={<FiShoppingBag />}
            title="No fragrances found"
            description="Try adjusting your filters to discover more from our collection."
            ctaLabel="VIEW ALL"
            ctaPath="/shop"
          />
        ) : viewMode === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }} className="shop-grid">
            {visibleProducts.map((product) => (
              <div key={product.id} className="shop-card" style={{ height: '100%' }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div>
            {visibleProducts.map((product) => (
              <ProductListRow key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && visibleProducts.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={clientTotalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <Footer variant="full" />

      <style>{`
        @media (max-width: 1024px) { .shop-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 768px) {
          .shop-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .container-content { padding-left: 24px !important; padding-right: 24px !important; }
        }
        @media (max-width: 480px) { .shop-grid { grid-template-columns: repeat(1, 1fr) !important; } }
      `}</style>
    </>
  );
}

export default function Shop() {
  return (
    <FilterProvider>
      <ShopContent />
    </FilterProvider>
  );
}
