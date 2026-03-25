import { useState, useRef, useEffect } from 'react';
import { BsWhatsapp } from 'react-icons/bs';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatPrice';
import { buildWhatsAppUrl } from '../../utils/whatsapp';
import { useCart } from '../../context/CartContext';
import gsap from 'gsap';

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState(product.size);
  const { addToCart } = useCart();
  const ctaRef = useRef<HTMLButtonElement>(null);

  const sizes = product.images?.length > 0
    ? [product.size]
    : [product.size];

  const availableSizes = product.size ? [product.size] : [];

  const handleAddToCart = () => {
    addToCart(product, selectedSize);
    const el = ctaRef.current;
    if (!el) return;
    gsap.fromTo(el, { scale: 0.97 }, { scale: 1, duration: 0.2 });
  };

  const singleItemCart = [{ ...product, id: `${product.id}-${selectedSize}`, productId: product.id, quantity: 1, size: selectedSize }];
  const waUrl = buildWhatsAppUrl(singleItemCart as Parameters<typeof buildWhatsAppUrl>[0]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Brand */}
      <p className="text-label" style={{ color: 'var(--gold-muted)' }}>
        {(product.brand ?? '').toUpperCase()}
      </p>

      {/* Name */}
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 'clamp(36px, 4vw, 56px)',
          color: 'var(--text-primary)',
          lineHeight: 1.1,
        }}
      >
        {product.name}
      </h1>

      {/* Type + Size */}
      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {product.type} · {selectedSize}
      </p>

      {/* Rating */}
      {product.rating && (
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
          <span style={{ color: 'var(--gold)' }}>{'★'.repeat(Math.round(product.rating))}</span>
          {' '}{product.rating} ({product.reviewCount} REVIEWS)
        </p>
      )}

      {/* Price */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: '32px', color: 'var(--gold)' }}>
          {formatPrice(product.price)}
        </span>
        {product.originalPrice && (
          <span style={{ color: 'var(--text-muted)', fontSize: '18px', textDecoration: 'line-through' }}>
            {formatPrice(product.originalPrice)}
          </span>
        )}
        {product.discount && (
          <span className="badge-discount">−{product.discount}% OFF</span>
        )}
      </div>

      {/* Volume selector */}
      {availableSizes.length > 0 && (
        <div>
          <p className="text-label" style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>
            {availableSizes.length > 1 ? 'SELECT VOLUME' : 'AVAILABLE VOLUME'}
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                style={{
                  padding: '10px 20px',
                  border: `1px solid ${selectedSize === size ? 'var(--gold)' : 'var(--bg-border)'}`,
                  background: selectedSize === size ? 'var(--gold-glow)' : 'transparent',
                  color: selectedSize === size ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-label)',
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: availableSizes.length > 1 ? 'pointer' : 'default',
                  transition: 'all 0.2s',
                }}
              >
                {size.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add to cart */}
      <button
        ref={ctaRef}
        id="product-add-to-cart"
        onClick={handleAddToCart}
        className="btn-primary"
        style={{ width: '100%', height: '56px', justifyContent: 'center' }}
      >
        ADD TO CART
      </button>

      {/* WhatsApp */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          color: 'var(--text-muted)',
          fontSize: '13px',
          textDecoration: 'none',
          transition: 'color 0.2s',
        }}
      >
        <BsWhatsapp size={14} style={{ color: 'var(--whatsapp-green)' }} />
        Order via WhatsApp Checkout
      </a>
    </div>
  );
}
