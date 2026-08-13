import { Link } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatPrice';
import { getWhatsAppCustomerServiceUrl } from '../../utils/whatsapp';

export function OrderSummary() {
  const { cartTotal } = useCart();
  const csWhatsAppUrl = getWhatsAppCustomerServiceUrl('Shipping & Delivery Info');

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Shipping</span>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-label)', letterSpacing: '0.05em', color: 'var(--gold)', textAlign: 'right' }}>
            Calculated by Customer Service
          </span>
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

      <Link
        to="/checkout"
        className="btn-primary"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          width: '100%',
          padding: '16px',
          textDecoration: 'none',
          textAlign: 'center',
          letterSpacing: '0.15em',
        }}
      >
        <FiLock size={16} />
        PROCEED TO CHECKOUT
      </Link>

      <p style={{ color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center', marginTop: '16px', lineHeight: 1.6 }}>
        Shipping is calculated by customer service depending on your location. Our team will contact you after your order. For delivery info,{' '}
        <a
          href={csWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--gold)', textDecoration: 'underline' }}
        >
          contact customer service via WhatsApp
        </a>.
      </p>
    </div>
  );
}
