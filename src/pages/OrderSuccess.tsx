import { useLocation, Link } from 'react-router-dom';
import { OrderRecord } from '../types';
import { formatPrice } from '../utils/formatPrice';
import { Footer } from '../components/layout/Footer';
import { BsWhatsapp } from 'react-icons/bs';
import { FiCheckCircle, FiPackage, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

export default function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order as OrderRecord | undefined;

  const buildWhatsAppMessage = () => {
    if (!order) return '';
    const number = import.meta.env.VITE_WHATSAPP_NUMBER || '+2348000000000';

    const itemLines = order.items
      .map((item, index) => {
        let details = `• ${index + 1}. *${item.name}*`;
        if (item.brand) details += ` (${item.brand})`;
        details += `\n   Type: ${item.type || 'Fragrance'} | Size: ${item.size || 'N/A'}`;
        details += `\n   Qty: ${item.quantity} × ${formatPrice(item.price)} = ${formatPrice(item.price * item.quantity)}`;

        // If it's a custom gift box, include the box contents, ribbon & gift note!
        if (item.isBox && item.boxProducts && item.boxProducts.length > 0) {
          details += `\n   📦 *Box Contents:*`;
          item.boxProducts.forEach((p, pIdx) => {
            details += `\n      - Fragrance ${pIdx + 1}: ${p.name} (${p.brand}) [${p.size}]`;
          });
          if (item.boxRibbon) {
            details += `\n   🎀 Ribbon: ${item.boxRibbon.name}`;
          }
          if (item.boxGiftMessage) {
            details += `\n   💌 Gift Note: "${item.boxGiftMessage}"`;
          }
        }

        return details;
      })
      .join('\n\n');

    const messageText =
      `*NEW PAID ORDER RECEIVED*\n\n` +
      `*Payment Reference:* ${order.reference}\n` +
      `*Payment Status:* PAID (via Paystack)\n\n` +
      `*CUSTOMER & DELIVERY DETAILS*\n` +
      `Name: ${order.customer.fullName}\n` +
      `Phone: ${order.customer.phone}\n` +
      `Email: ${order.customer.email}\n` +
      `Address: ${order.customer.address}, ${order.customer.city}, ${order.customer.state}\n\n` +
      `*ORDER ITEMS & SPECIFICATIONS*\n${itemLines}\n\n` +
      `*TOTAL PAID:* ${formatPrice(order.totalAmount)}\n\n` +
      `Please confirm receipt and dispatch schedule. Thank you!`;

    return `https://wa.me/${number}?text=${encodeURIComponent(messageText)}`;
  };

  if (!order) {
    return (
      <>
        <div className="container-content" style={{ padding: '120px 24px', textAlign: 'center', minHeight: '70vh' }}>
          <FiCheckCircle size={64} style={{ color: 'var(--gold)', marginBottom: '24px' }} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', color: 'var(--text-primary)', marginBottom: '16px' }}>
            Thank You for Shopping
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '32px' }}>
            Your order has been received and is being processed.
          </p>
          <Link to="/shop" className="btn-primary" style={{ padding: '14px 28px', textDecoration: 'none' }}>
            EXPLORE COLLECTION
          </Link>
        </div>
        <Footer variant="full" />
      </>
    );
  }

  return (
    <>
      <div className="container-content order-success-page" style={{ padding: '64px 80px', minHeight: '85vh', maxWidth: '900px', margin: '0 auto' }}>
        {/* Banner */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid var(--gold-line)',
              marginBottom: '24px',
            }}
          >
            <FiCheckCircle size={40} style={{ color: 'var(--gold)' }} />
          </div>

          <p className="text-label" style={{ color: 'var(--gold)', marginBottom: '8px' }}>PAYMENT CONFIRMED</p>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(36px, 5vw, 56px)',
              color: 'var(--text-primary)',
              lineHeight: 1.1,
              marginBottom: '12px',
            }}
          >
            Thank You, {order.customer.fullName.split(' ')[0]}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Order Reference: <strong style={{ color: 'var(--gold)', fontFamily: 'var(--font-ui)' }}>{order.reference}</strong>
          </p>
        </div>

        {/* Receipt Box */}
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--gold-line)', padding: '40px', marginBottom: '40px' }} className="receipt-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '24px', borderBottom: '1px solid var(--bg-border)', marginBottom: '24px' }}>
            <div>
              <p style={{ fontSize: '11px', fontFamily: 'var(--font-label)', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>ORDER RECEIPT</p>
              <p style={{ fontSize: '18px', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Emrickscents Luxury Store</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  background: 'rgba(34, 197, 94, 0.15)',
                  color: '#4ade80',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-label)',
                  letterSpacing: '0.1em',
                }}
              >
                ✓ PAID VIA PAYSTACK
              </span>
            </div>
          </div>

          {/* Customer & Delivery Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }} className="receipt-grid">
            <div>
              <p style={{ fontSize: '12px', fontFamily: 'var(--font-label)', color: 'var(--gold-muted)', letterSpacing: '0.1em', marginBottom: '12px' }}>
                <FiMapPin style={{ marginRight: '6px' }} /> DELIVERY ADDRESS
              </p>
              <p style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 500 }}>{order.customer.fullName}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6 }}>{order.customer.address}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{order.customer.city}, {order.customer.state}</p>
            </div>

            <div>
              <p style={{ fontSize: '12px', fontFamily: 'var(--font-label)', color: 'var(--gold-muted)', letterSpacing: '0.1em', marginBottom: '12px' }}>
                CONTACT INFO
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <FiPhone size={14} style={{ color: 'var(--gold)' }} /> {order.customer.phone}
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiMail size={14} style={{ color: 'var(--gold)' }} /> {order.customer.email}
              </p>
            </div>
          </div>

          {/* Purchased Items */}
          <div style={{ borderTop: '1px solid var(--bg-border)', paddingTop: '24px', marginBottom: '24px' }}>
            <p style={{ fontSize: '12px', fontFamily: 'var(--font-label)', color: 'var(--gold-muted)', letterSpacing: '0.1em', marginBottom: '16px' }}>
              <FiPackage style={{ marginRight: '6px' }} /> ITEMS IN ORDER
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {order.items.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <img src={item.image} alt={item.name} style={{ width: '48px', height: '56px', objectFit: 'cover', background: 'var(--bg-surface)' }} />
                    <div>
                      <p style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 500 }}>{item.name}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Qty: {item.quantity} · {item.size}</p>
                    </div>
                  </div>
                  <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-ui)', fontWeight: 500 }}>
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div style={{ borderTop: '1px solid var(--bg-border)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-label)', fontSize: '12px', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>TOTAL PAID</span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '28px', fontWeight: 500, color: 'var(--gold)' }}>
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </div>

        {/* WhatsApp & Continue Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <a
            href={buildWhatsAppMessage()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
            style={{ width: '100%', maxWidth: '480px', justifyContent: 'center', padding: '16px' }}
          >
            <BsWhatsapp size={20} />
            NOTIFY CURATOR ON WHATSAPP
          </a>

          <p style={{ color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center', maxWidth: '480px', lineHeight: 1.6 }}>
            Clicking the button above sends your order details and payment reference directly to our team on WhatsApp for immediate dispatch.
          </p>

          <Link
            to="/shop"
            style={{
              fontFamily: 'var(--font-label)',
              fontSize: '11px',
              letterSpacing: '0.15em',
              color: 'var(--gold)',
              textTransform: 'uppercase',
              marginTop: '16px',
              textDecoration: 'underline',
            }}
          >
            ← CONTINUE EXPLORING COLLECTION
          </Link>
        </div>
      </div>

      <Footer variant="full" />

      <style>{`
        @media (max-width: 767px) {
          .order-success-page { padding: 32px 24px !important; }
          .receipt-box { padding: 24px !important; }
          .receipt-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
        }
      `}</style>
    </>
  );
}
