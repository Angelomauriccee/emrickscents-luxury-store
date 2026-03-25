import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';
import { useShippingModal } from '../../context/ShippingModalContext';

export function ShippingModal() {
  const { isOpen, closeShippingModal } = useShippingModal();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeShippingModal();
    };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, closeShippingModal]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sectionLabel = (text: string) => (
    <p style={{ fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--gold-muted)', marginBottom: '10px' }}>
      {text}
    </p>
  );

  const divider = (
    <div style={{ height: '1px', background: 'var(--gold-line)', marginBottom: '16px' }} />
  );

  const bodyText = (text: string) => (
    <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 400, fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '20px' }}>
      {text}
    </p>
  );

  const subLabel = (text: string) => (
    <p style={{ fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold-muted)', marginTop: '16px', marginBottom: '8px' }}>
      {text}
    </p>
  );

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeShippingModal}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000 }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        background: 'var(--bg-elevated)', border: '1px solid var(--gold-border)', borderRadius: '2px',
        maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto',
        padding: '48px', zIndex: 1001,
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontStyle: 'italic', fontSize: '36px', color: 'var(--text-primary)' }}>
            Shipping & Returns
          </h2>
          <button
            onClick={closeShippingModal}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* SHIPPING */}
        <div style={{ marginBottom: '28px' }}>
          {sectionLabel('SHIPPING')}
          {divider}
          {bodyText('Curated delivery across Nigeria. Orders within Lagos are fulfilled via our private courier within 24–48 hours. Nationwide shipping takes 2–5 business days.')}
        </div>

        {/* RETURNS */}
        <div style={{ marginBottom: '28px' }}>
          {sectionLabel('RETURNS')}
          {divider}
          {bodyText('Due to the intimate nature of fragrances, we only accept returns on unopened, sealed bottles within 7 days of delivery. Sample sets are final sale.')}

          {subLabel('ELIGIBLE FOR RETURN')}
          <ul style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '20px', marginBottom: '12px' }}>
            <li>Wrong item received</li>
            <li>Damaged product (broken/leaking bottle)</li>
            <li>Defective spray mechanism</li>
          </ul>

          {subLabel('NOT ELIGIBLE')}
          <ul style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '20px', marginBottom: '12px' }}>
            <li>Opened or used perfumes</li>
            <li>Sale or promotional items</li>
            <li>Personalized/customized orders</li>
            <li>Requests after 24 hours of purchase</li>
            <li>Allergic reactions or personal preference</li>
          </ul>

          {subLabel('RETURN PROCESS')}
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '12px' }}>
            <p><strong style={{ color: 'var(--text-primary)' }}>Step 1:</strong> Submit via WhatsApp within 24 hours. Include photos and video proof.</p>
            <p><strong style={{ color: 'var(--text-primary)' }}>Step 2:</strong> Team reviews within 24 hours and provides instructions.</p>
            <p><strong style={{ color: 'var(--text-primary)' }}>Step 3:</strong> If approved, ship item back. Store credit issued within 14 working days.</p>
          </div>

          <p style={{ fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold-muted)', marginTop: '12px' }}>
            Return shipping is covered by us for our errors only.
          </p>
        </div>

        {/* WHATSAPP SUPPORT */}
        <div>
          {sectionLabel('WHATSAPP SUPPORT')}
          {divider}
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '20px' }}>
            Questions about your order? Chat with our curator directly.
          </p>
          <a
            href="https://wa.me/2349065988598"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              width: '100%', height: '48px', background: '#25D366', color: '#fff',
              fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: '13px',
              textTransform: 'uppercase', letterSpacing: '0.08em',
              textDecoration: 'none', borderRadius: '0', border: 'none',
            }}
          >
            <BsWhatsapp size={16} />
            CHAT WITH US
          </a>
        </div>
      </div>
    </>
  );
}
