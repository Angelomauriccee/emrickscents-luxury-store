import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { CartItem as CartItemType } from '../../types';
import { formatPrice } from '../../utils/formatPrice';
import { useCart } from '../../context/CartContext';
import gsap from 'gsap';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const handleEditBox = (boxItem: CartItemType) => {
    localStorage.setItem('emrickscents-box-progress', JSON.stringify({
      selectedProducts: boxItem.boxProducts || [],
      currentStep: 2,
      giftMessage: boxItem.boxGiftMessage || '',
      selectedRibbon: boxItem.boxRibbon || null,
      editingCartItemId: boxItem.id,
      savedAt: new Date().toISOString(),
    }));
    removeFromCart(boxItem.id);
    navigate('/build-your-box');
  };
  const itemRef = useRef<HTMLDivElement>(null);

  const handleRemove = () => {
    const el = itemRef.current;
    if (!el) { removeFromCart(item.id); return; }
    gsap.to(el, {
      opacity: 0,
      height: 0,
      marginBottom: 0,
      paddingTop: 0,
      paddingBottom: 0,
      duration: 0.4,
      ease: 'power2.inOut',
      onComplete: () => removeFromCart(item.id),
    });
  };

  // ── BOX ITEM LAYOUT ────────────────────────────────────────────────────────
  if (item.isBox) {
    return (
      <div
        ref={itemRef}
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--gold-border)',
          borderRadius: '2px',
          padding: '24px',
          marginBottom: '24px',
        }}
      >
        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--gold-muted)', marginBottom: '6px' }}>
              FRAGRANCE BOX
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontStyle: 'italic', fontSize: '24px', color: 'var(--text-primary)' }}>
              {item.type}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => handleEditBox(item)}
              style={{
                fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase',
                letterSpacing: '0.15em', color: 'var(--gold)', border: '1px solid var(--gold-border)',
                background: 'transparent', padding: '6px 14px', borderRadius: 0, cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--gold-glow)'; e.currentTarget.style.borderColor = 'var(--gold)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--gold-border)'; }}
            >
              EDIT BOX
            </button>
            <button
              onClick={handleRemove}
              style={{ fontFamily: 'var(--font-label)', fontSize: '11px', letterSpacing: '0.12em', color: 'var(--text-muted)', cursor: 'pointer', textTransform: 'uppercase', background: 'none', border: 'none', textDecoration: 'underline' }}
            >
              REMOVE
            </button>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--gold-line)', margin: '16px 0' }} />

        {/* Mini products grid */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          {item.boxProducts?.map((p) => (
            <div key={p.id} style={{ width: '80px', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--bg-surface)', border: '1px solid var(--bg-border)', overflow: 'hidden' }}>
                <img
                  src={p.image}
                  alt={p.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'grayscale(80%)' }}
                />
              </div>
              <p style={{
                fontFamily: 'var(--font-display)', fontWeight: 300, fontStyle: 'italic', fontSize: '11px',
                color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.3,
                overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              }}>
                {p.name}
              </p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--gold-line)', margin: '16px 0' }} />

        {/* Personalisation row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--gold-muted)', marginBottom: '8px' }}>RIBBON</p>
            {item.boxRibbon ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '16px', height: '16px', background: item.boxRibbon.color, border: '1px solid var(--bg-border)', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-primary)' }}>{item.boxRibbon.name}</span>
              </div>
            ) : (
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-muted)' }}>None selected</span>
            )}
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--gold-muted)', marginBottom: '8px' }}>GIFT MESSAGE</p>
            {item.boxGiftMessage ? (
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontStyle: 'italic', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                "{item.boxGiftMessage}"
              </p>
            ) : (
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontStyle: 'italic', fontSize: '13px', color: 'var(--text-muted)' }}>No message</p>
            )}
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '16px' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-muted)' }}>
            {item.boxProducts?.length ?? 0} fragrances · {item.size}
          </span>
          <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: '20px', color: 'var(--gold)' }}>
            {formatPrice(item.price)}
          </span>
        </div>
      </div>
    );
  }

  // ── REGULAR ITEM LAYOUT ────────────────────────────────────────────────────
  return (
    <div
      ref={itemRef}
      style={{
        display: 'flex',
        gap: '20px',
        paddingBottom: '32px',
        marginBottom: '32px',
        borderBottom: '1px solid var(--bg-border)',
        alignItems: 'flex-start',
      }}
    >
      {/* Image */}
      <div style={{ width: '100px', height: '120px', flexShrink: 0, background: 'var(--bg-surface)', border: '1px solid var(--bg-border)', overflow: 'hidden' }}>
        <img src={item.image} alt={item.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="text-label" style={{ color: 'var(--gold-muted)', marginBottom: '6px' }}>{item.brand.toUpperCase()}</p>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 300, color: 'var(--text-primary)', marginBottom: '4px' }}>
          {item.name}
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: item.isCustomBox ? '12px' : '20px', textTransform: 'uppercase' }}>
          {item.type} / {item.size}
        </p>

        {item.isCustomBox && item.boxItems && (
          <div style={{ marginBottom: '20px', padding: '12px', background: 'var(--bg-surface)', borderLeft: '2px solid var(--gold)' }}>
            <p className="text-label" style={{ fontSize: '9px', color: 'var(--gold-muted)', marginBottom: '8px' }}>BOX CONTENTS</p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {item.boxItems.map((p, i) => (
                <li key={i} style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}>
                  • {p.name}
                </li>
              ))}
            </ul>
            {(item.ribbon || item.recipientName) && (
              <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--bg-border)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {item.ribbon && <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Ribbon: {item.ribbon}</p>}
                {item.recipientName && <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>For: {item.recipientName}</p>}
              </div>
            )}
          </div>
        )}

        {/* Quantity + Remove */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--bg-border)' }}>
            <button
              onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : handleRemove()}
              style={{ width: '36px', height: '36px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid var(--bg-border)' }}
            >
              <FiMinus size={12} />
            </button>
            <span style={{ width: '40px', textAlign: 'center', fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-primary)' }}>
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              style={{ width: '36px', height: '36px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid var(--bg-border)' }}
            >
              <FiPlus size={12} />
            </button>
          </div>
          <button
            onClick={handleRemove}
            style={{ fontFamily: 'var(--font-label)', fontSize: '11px', letterSpacing: '0.12em', color: 'var(--text-muted)', cursor: 'pointer', textTransform: 'uppercase', background: 'none', border: 'none', textDecoration: 'underline' }}
          >
            REMOVE
          </button>
        </div>
      </div>

      {/* Price */}
      <div style={{ flexShrink: 0 }}>
        <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: '18px', color: 'var(--gold)' }}>
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>
    </div>
  );
}
