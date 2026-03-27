import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatPrice';
import { useCart } from '../../context/CartContext';
import gsap from 'gsap';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'horizontal';
  showQuickAdd?: boolean;
  onAddToCart?: () => void;
}

export function ProductCard({ product, variant = 'default', showQuickAdd = true, onAddToCart }: ProductCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const card = cardRef.current;
    const image = imageRef.current;
    const overlay = overlayRef.current;
    if (!card || !image) return;

    const onEnter = () => {
      gsap.to(image.querySelector('img'), { scale: 1.04, duration: 0.5, ease: 'power1.out' });
      if (overlay) gsap.to(overlay, { opacity: 1, duration: 0.35 });
    };
    const onLeave = () => {
      gsap.to(image.querySelector('img'), { scale: 1, duration: 0.5, ease: 'power1.out' });
      if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.35 });
    };

    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mouseleave', onLeave);
    return () => {
      card.removeEventListener('mouseenter', onEnter);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    onAddToCart?.();
  };

  const slug = product.id;
  const isHorizontal = variant === 'horizontal';
  const isCompact = variant === 'compact';

  return (
    <article
      ref={cardRef}
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        height: '100%',           // fills the grid cell height
      }}
    >
      <Link to={`/product/${slug}`} style={{ display: 'flex', flexDirection: isHorizontal ? 'row' : 'column', width: '100%', textDecoration: 'none', height: '100%' }}>
        {/* Image */}
        <div
          ref={imageRef}
          style={{
            position: 'relative',
            width: isHorizontal ? '120px' : '100%',
            height: isHorizontal ? '120px' : '320px',   // Fixed image height — increased to 320px for taller cards
            minWidth: isHorizontal ? '120px' : undefined,
            flexShrink: 0,
            background: 'var(--bg-surface)',
            overflow: 'hidden',
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transformOrigin: 'center',
            }}
            onError={(e) => { const t = e.target as HTMLImageElement; t.onerror = null; t.src = '/images/placeholder.svg'; }}
          />
          {product.isNew && !isHorizontal && (
            <span className="badge-new" style={{ position: 'absolute', top: '12px', left: '12px' }}>
              NEW
            </span>
          )}
          {showQuickAdd && !isHorizontal && !isCompact && (
            <div
              ref={overlayRef}
              style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: '16px', opacity: 0 }}
            >
              <button
                onClick={handleAddToCart}
                className="btn-primary btn-sm btn-full"
              >
                QUICK ADD
              </button>
            </div>
          )}
        </div>

        {/* Body — flex:1 pushes price to bottom */}
        <div style={{ padding: isHorizontal ? '12px 16px' : isCompact ? '12px' : '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <p className="text-label" style={{ color: 'var(--gold-muted)', marginBottom: '6px' }}>
            {(product.collection ?? product.brand ?? '').toUpperCase()}
          </p>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 300,
              fontSize: isCompact ? '18px' : '20px',
              lineHeight: 1.25,
              color: 'var(--text-primary)',
              marginBottom: '6px',
              flex: 1,                // title takes remaining space — price stays at bottom
            }}
          >
            {product.name}
          </h3>
          {!isCompact && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '10px' }}>
              {product.type} · {product.size}
            </p>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginTop: 'auto' }}>
            {product.originalPrice && (
              <span style={{ color: 'var(--text-muted)', fontSize: '13px', textDecoration: 'line-through' }}>
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: isHorizontal ? '16px' : '18px' }}>
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
