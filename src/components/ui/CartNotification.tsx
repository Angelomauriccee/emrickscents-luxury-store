import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatPrice';
import gsap from 'gsap';

export function CartNotification() {
  const { notification } = useCart();
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = toastRef.current;
    if (!el) return;

    if (notification.visible && notification.item) {
      gsap.fromTo(el, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' });
    } else if (!notification.visible) {
      gsap.to(el, { y: 20, opacity: 0, duration: 0.3, ease: 'power2.in' });
    }
  }, [notification.visible]);

  if (!notification.item) return null;

  const { item } = notification;

  return (
    <div
      ref={toastRef}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 500,
        background: 'var(--bg-elevated)',
        border: '1px solid var(--gold-border)',
        width: '300px',
        opacity: 0,
        pointerEvents: notification.visible ? 'all' : 'none',
      }}
    >
      <div style={{ padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        {/* Image */}
        <div style={{ width: '56px', height: '56px', flexShrink: 0, background: 'var(--bg-surface)', overflow: 'hidden' }}>
          <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p className="text-label" style={{ color: 'var(--gold)', marginBottom: '4px' }}>ADDED TO CART</p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 300, color: 'var(--text-primary)', marginBottom: '4px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {item.name}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.size}</p>
        </div>
        {/* Price */}
        <div style={{ flexShrink: 0 }}>
          <p style={{ color: 'var(--gold)', fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: '14px' }}>
            {formatPrice(item.price)}
          </p>
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--bg-border)', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/cart" style={{ fontSize: '11px', fontFamily: 'var(--font-label)', letterSpacing: '0.12em', color: 'var(--gold)', textTransform: 'uppercase' }}>
          View Cart →
        </Link>
      </div>
    </div>
  );
}
