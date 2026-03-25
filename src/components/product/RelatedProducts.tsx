import { useState, useEffect, useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Product } from '../../types';
import { getRelatedProducts } from '../../firebase/products';
import { ProductCard } from '../ui/ProductCard';
import gsap from 'gsap';

interface RelatedProductsProps {
  currentSlug: string;
  brand: string;
  collection: string | null;
}

export function RelatedProducts({ currentSlug, brand, collection }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getRelatedProducts(currentSlug, brand, collection).then(setProducts).catch(() => setProducts([]));
  }, [currentSlug, brand, collection]);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    gsap.to(el, { scrollLeft: el.scrollLeft + (dir === 'right' ? 280 : -280), duration: 0.4, ease: 'power2.out' });
  };

  if (products.length === 0) return null;

  return (
    <section style={{ padding: '80px 0', borderTop: '1px solid var(--bg-border)' }}>
      <div className="container-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <div>
            <p className="text-label" style={{ color: 'var(--gold-muted)', marginBottom: '10px' }}>CURATED FOR YOU</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '40px', color: 'var(--text-primary)' }}>
              You May Also Love
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => scroll('left')} className="btn-secondary btn-sm" style={{ width: '44px', padding: 0, justifyContent: 'center' }}>
              <FiChevronLeft size={18} />
            </button>
            <button onClick={() => scroll('right')} className="btn-secondary btn-sm" style={{ width: '44px', padding: 0, justifyContent: 'center' }}>
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: '20px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            paddingBottom: '8px',
          }}
        >
          {products.map((product) => (
            <div key={product.id} style={{ minWidth: '240px', maxWidth: '260px', flexShrink: 0 }}>
              <ProductCard product={product} showQuickAdd={false} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
