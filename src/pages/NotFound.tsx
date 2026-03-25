import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '../hooks/useGSAP';
import { ProductCard } from '../components/ui/ProductCard';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { getFeaturedProducts } from '../firebase/products';
import { Product } from '../types';

export default function NotFound() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const bgTextRef = useRef<HTMLDivElement>(null);
  const topLineRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyTextRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const bottomLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Page Not Found — EMRICKSCENTS';
    getFeaturedProducts(3)
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching featured products:', err);
        setLoading(false);
      });
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline({ ease: 'power2.out' });
    
    if (bgTextRef.current) tl.fromTo(bgTextRef.current, { opacity: 0 }, { opacity: 0.8, duration: 0.8 }, 0);
    if (topLineRef.current) tl.fromTo(topLineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.5, transformOrigin: 'center' }, 0.2);
    if (labelRef.current) tl.fromTo(labelRef.current, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0.3);
    if (headlineRef.current) tl.fromTo(headlineRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.4);
    if (bodyTextRef.current) tl.fromTo(bodyTextRef.current, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0.7);
    if (buttonsRef.current) tl.fromTo(buttonsRef.current.children, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.1 }, 0.9);
    if (bottomLineRef.current) tl.fromTo(bottomLineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.5, transformOrigin: 'center' }, 1.0);
  }, []);

  return (
    <>
      <div style={{ position: 'relative', width: '100%', minHeight: 'calc(100vh - 72px)', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        
        {/* Background 404 Text */}
        <div 
          ref={bgTextRef}
          style={{ 
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
            fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(200px, 30vw, 400px)', 
            color: '#161616', userSelect: 'none', pointerEvents: 'none', zIndex: 0, letterSpacing: '-0.02em', 
            lineHeight: 1 
          }}
        >
          404
        </div>

        {/* Foreground Content */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '560px', textAlign: 'center', padding: '0 24px' }}>
          <div ref={topLineRef} style={{ width: '80px', height: '1px', background: 'var(--gold)', margin: '0 auto 24px' }} />
          
          <p ref={labelRef} className="text-label" style={{ color: 'var(--gold-muted)', letterSpacing: '0.25em', marginBottom: '24px' }}>
            LOST IN THE COLLECTION
          </p>
          
          <h1 ref={headlineRef} style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(52px, 6vw, 72px)', color: 'var(--text-primary)', lineHeight: 1.0, marginBottom: '24px' }}>
            This scent has<br />
            <span style={{ fontStyle: 'italic' }}>drifted away.</span>
          </h1>
          
          <p ref={bodyTextRef} style={{ fontFamily: 'var(--font-ui)', fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 40px', lineHeight: 1.8 }}>
            The page you're looking for may have moved or no longer exists. Allow us to guide you back to our olfactory sanctuary.
          </p>
          
          <div ref={buttonsRef} style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              to="/shop" 
              className="btn-primary" 
              style={{ height: '52px', padding: '0 28px', borderRadius: 0, justifyContent: 'center' }}
            >
              EXPLORE THE COLLECTION
            </Link>
            
            <Link 
              to="/" 
              className="btn-outline" 
              style={{ height: '52px', padding: '0 28px', borderRadius: 0, justifyContent: 'center', borderColor: 'var(--gold-border)', color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--gold-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              RETURN HOME
            </Link>
          </div>
          
          <div ref={bottomLineRef} style={{ width: '80px', height: '1px', background: 'var(--gold)', margin: '40px auto 0' }} />
        </div>
      </div>

      {/* CURATED SUGGESTIONS */}
      <div style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--gold-line)', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p className="text-label" style={{ color: 'var(--gold-muted)', fontSize: '10px' }}>
            YOU MIGHT ENJOY
          </p>
          <div style={{ width: '40px', height: '1px', background: 'var(--gold)', margin: '16px auto 0' }} />
        </div>
        
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '240px', maxWidth: '280px' }}>
                <SkeletonCard />
              </div>
            ))
          ) : (
            products.map((product) => (
              <div key={product.id} style={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '240px', maxWidth: '280px' }}>
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
