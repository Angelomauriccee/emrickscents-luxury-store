import { BsWhatsapp } from 'react-icons/bs';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatPrice';
import { buildWhatsAppUrl } from '../../utils/whatsapp';

export function OrderSummary() {
  const { cartItems, cartTotal } = useCart();
  const waUrl = buildWhatsAppUrl(cartItems);

  return (
    <div
      className="card order-summary-wrap"
      style={{ padding: '32px', position: 'sticky', top: 'calc(var(--nav-height) + 24px)' }}
    >
      <p className="text-label" style={{ color: 'var(--text-secondary)', marginBottom: '28px' }}>ORDER SUMMARY</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '24px', borderBottom: '1px solid var(--bg-border)', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Subtotal</span>
          <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-ui)', fontWeight: 500 }}>{formatPrice(cartTotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Shipping</span>
          <span style={{ fontFamily: 'var(--font-label)', fontSize: '11px', letterSpacing: '0.12em', color: 'var(--text-secondary)' }}>COMPLIMENTARY</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Taxes</span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>Calculated at Checkout</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <span className="text-label" style={{ color: 'var(--text-secondary)' }}>TOTAL</span>
        <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: '28px', color: 'var(--gold)' }}>
          {formatPrice(cartTotal)}
        </span>
      </div>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-whatsapp"
      >
        <BsWhatsapp size={18} />
        CHECKOUT VIA WHATSAPP
      </a>

      <p style={{ color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center', marginTop: '14px', lineHeight: 1.7, fontStyle: 'italic' }}>
        Your selection will be sent directly to our master curator for personal fulfilment and exclusive concierge service.
      </p>
    </div>
  );
}
