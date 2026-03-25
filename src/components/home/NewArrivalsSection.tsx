import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProductCard } from '../ui/ProductCard';
import { SkeletonCard } from '../ui/SkeletonCard';
import { getFeaturedProducts } from '../../firebase/products';
import { Product } from '../../types';
import { useState } from 'react';

gsap.registerPlugin(ScrollTrigger);

export function NewArrivalsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedProducts(4).then((p) => { setProducts(p); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.new-arrivals-card', {
        y: 30, opacity: 0, duration: 0.6, ease: 'power2.out', stagger: 0.07,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [loading]);

  return (
    <section ref={sectionRef} style={{ padding: '120px 0' }}>
      <div className="container-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
          <div>
            <p className="text-label" style={{ color: 'var(--gold-muted)', marginBottom: '12px' }}>THE LATEST ESSENCES</p>
            <h2 className="text-heading" style={{ color: 'var(--text-primary)' }}>New Arrivals</h2>
          </div>
          <Link to="/shop?isNew=true" className="text-label" style={{ color: 'var(--text-secondary)', textDecoration: 'none', paddingBottom: '4px', borderBottom: '1px solid var(--bg-border)', transition: 'border-color 0.2s, color 0.2s' }}>
            VIEW ALL →
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }} className="new-arrivals-grid">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((product) => (
                <div key={product.id} className="new-arrivals-card">
                  <ProductCard product={product} />
                </div>
              ))
          }
        </div>
      </div>
      <style>{`
        @media (max-width: 1024px) { .new-arrivals-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px) { .new-arrivals-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </section>
  );
}
