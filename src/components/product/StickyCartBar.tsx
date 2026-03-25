import { useRef, useEffect } from 'react';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatPrice';
import { useCart } from '../../context/CartContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface StickyCartBarProps {
  product: Product;
}

export function StickyCartBar({ product }: StickyCartBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    gsap.set(bar, { y: 80 });

    const trigger = ScrollTrigger.create({
      trigger: '#product-add-to-cart',
      start: 'bottom top',
      onEnter: () => gsap.to(bar, { y: 0, duration: 0.3, ease: 'power2.out' }),
      onLeaveBack: () => gsap.to(bar, { y: 80, duration: 0.25, ease: 'power2.in' }),
    });

    return () => trigger.kill();
  }, []);

  return (
    <div
      ref={barRef}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--bg-elevated)',
        borderTop: '1px solid var(--bg-border)',
        zIndex: 90,
        padding: '12px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
      }}
      className="sticky-bar"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '40px', height: '48px', background: 'var(--bg-surface)', overflow: 'hidden', flexShrink: 0 }}>
          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 300, color: 'var(--text-primary)' }}>{product.name}</p>
          <p style={{ color: 'var(--gold)', fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: '15px' }}>{formatPrice(product.price)}</p>
        </div>
      </div>
      <button className="btn-primary" onClick={() => addToCart(product)} style={{ flexShrink: 0 }}>
        ADD TO CART
      </button>

      <style>{`
        @media (max-width: 640px) {
          .sticky-bar { padding: 12px 24px !important; }
        }
      `}</style>
    </div>
  );
}
