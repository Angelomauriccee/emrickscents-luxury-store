import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types';
import { FiArrowLeft, FiShield, FiTruck, FiMessageCircle, FiCheck, FiShoppingBag } from 'react-icons/fi';
import { formatPrice } from '../utils/formatPrice';
import { useCart } from '../context/CartContext';

const STEPS = ['01 SELECT', '02 PERSONALISE', '03 ORDER'];

const RIBBONS = [
  { id: 'gold', name: 'Classic Gold', hex: 'linear-gradient(135deg, #e6c364 0%, #c9a84c 100%)', ring: '' },
  { id: 'black', name: 'Midnight Black', hex: '#000000', ring: 'group-hover:ring-outline-variant' },
  { id: 'ivory', name: 'Ivory White', hex: '#F5F5F0', ring: 'group-hover:ring-outline-variant' },
  { id: 'burgundy', name: 'Deep Burgundy', hex: '#4A0E0E', ring: 'group-hover:ring-outline-variant' }
];

export default function BuildYourBox() {
  const location = useLocation();
  const stateFromCart = location.state as {
    editingBoxId?: string,
    boxItems?: Product[],
    ribbon?: string,
    recipientName?: string,
    giftMessage?: string
  };

  const { addBoxToCart } = useCart();

  // ── Restore from localStorage on initial mount (lazy initializer pattern) ──
  const initialProgress = !stateFromCart ? (() => {
    try {
      const saved = localStorage.getItem('emrickscents-box-progress');
      if (saved) {
        const p = JSON.parse(saved);
        if (p.selectedProducts?.length > 0) return p;
      }
    } catch (e) {
      localStorage.removeItem('emrickscents-box-progress');
    }
    return null;
  })() : null;

  // When restoring an edited box, selectedRibbon is { name, color } — map back to ribbon ID
  const resolveInitialRibbon = () => {
    if (stateFromCart?.ribbon) return RIBBONS.find(r => r.name === stateFromCart.ribbon)?.id ?? 'gold';
    const sr = initialProgress?.selectedRibbon;
    if (!sr) return 'gold';
    if (typeof sr === 'string') return sr;
    // Object form { name, color } from cart box item
    return RIBBONS.find(r => r.name === sr.name)?.id ?? 'gold';
  };

  const [step, setStep] = useState<number>(
    stateFromCart ? 1 : (initialProgress?.currentStep >= 0 ? initialProgress.currentStep : 0)
  );
  const [gender, setGender] = useState<'women' | 'men'>('women');
  const [selected, setSelected] = useState<Product[]>(
    stateFromCart?.boxItems ?? initialProgress?.selectedProducts ?? []
  );
  const [message, setMessage] = useState<string>(
    stateFromCart?.giftMessage ?? initialProgress?.giftMessage ?? ''
  );
  const [recipientName, setRecipientName] = useState<string>(stateFromCart?.recipientName ?? '');
  const [ribbon, setRibbon] = useState<string>(resolveInitialRibbon());
  const [boxAddedSuccess, setBoxAddedSuccess] = useState(false);

  const { products, loading } = useProducts({ category: gender, pageSize: 24 });
  const MAX = 6;
  const total = selected.reduce((sum, p) => sum + p.price, 0);

  // Track first render to avoid overwriting localStorage before state settles
  const initializedRef = useRef(false);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Save progress to localStorage on state changes (skip the very first sync render)
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }
    const progress = {
      selectedProducts: selected,
      currentStep: step,
      giftMessage: message,
      selectedRibbon: ribbon,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('emrickscents-box-progress', JSON.stringify(progress));
  }, [selected, step, message, ribbon]);

  const toggleProduct = (product: Product) => {
    setSelected((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      if (prev.length >= MAX) return prev;
      return [...prev, product];
    });
  };

  const getActiveRibbon = () => RIBBONS.find((r) => r.id === ribbon);

  const buildBoxMessage = () => {
    const lines = selected.map((p) => `• ${p.name} (${p.size})`).join('\n');
    const note = message || recipientName
      ? `\n\nRecipient: ${recipientName || 'None'}\nGift message: "${message || 'None'}"\nRibbon: ${getActiveRibbon()?.name}`
      : '';
    return encodeURIComponent(`Hello Emrickscents! I'd like to order a bespoke curated box:\n\n${lines}${note}\n\nTotal: ${formatPrice(total)}`);
  };

  const handleWhatsAppCheckout = () => {
    localStorage.removeItem('emrickscents-box-progress');
  };

  const handleAddBoxToCart = () => {
    addBoxToCart(
      selected.map(p => ({
        id: p.id,
        name: p.name,
        brand: p.brand || '',
        price: p.price,
        image: p.images?.[0] || p.image,
        size: p.size,
        type: p.type,
        category: p.category,
      })),
      ribbon ? { name: getActiveRibbon()?.name || '', color: getActiveRibbon()?.hex || '' } : null,
      message
    );
    localStorage.removeItem('emrickscents-box-progress');
    setBoxAddedSuccess(true);
    setTimeout(() => setBoxAddedSuccess(false), 2000);
  };

  const number = import.meta.env.VITE_WHATSAPP_NUMBER as string;

  // ── Unified Progress Indicator ──
  const progressIndicator = (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingTop: '40px',
      paddingBottom: '40px',
    }}>
      {STEPS.map((s, idx) => (
        <span key={s} style={{ display: 'flex', alignItems: 'center' }}>
          {idx > 0 && (
            <span className="box-progress-line" style={{ width: '64px', height: '1px', background: 'rgba(201,168,76,0.2)', display: 'block', marginTop: '16px' }} />
          )}
          <div
            onClick={() => idx < step && setStep(idx)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              cursor: idx < step ? 'pointer' : 'default',
            }}
          >
            {/* Circle */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: idx < step
                ? '1px solid var(--gold)'
                : idx === step
                ? '2px solid var(--gold)'
                : '1px solid var(--bg-border)',
              background: 'var(--bg-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              {idx < step && <FiCheck size={14} style={{ color: 'var(--gold)' }} />}
              {idx === step && (
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--gold)' }} />
              )}
            </div>
            {/* Label */}
            <span className="box-progress-label" style={{
              fontFamily: 'var(--font-label)',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: idx === step ? 'var(--gold)' : idx < step ? 'var(--text-secondary)' : 'var(--text-muted)',
              whiteSpace: 'nowrap',
            }}>
              {s}
            </span>
          </div>
        </span>
      ))}
    </div>
  );

  return (
    <>
      {/* ═══════════════════════════════════════════════
          STEP 0 — SELECT
          ═══════════════════════════════════════════════ */}
      {step === 0 && (
        <div className="container-content box-step0-padding" style={{ padding: '0 80px 80px' }}>
          {progressIndicator}

          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p className="text-label" style={{ color: 'var(--gold-muted)', marginBottom: '12px' }}>CURATED EXPERIENCE</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '56px', color: 'var(--text-primary)', marginBottom: '0' }}>
              Build Your Box
            </h1>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '16px' }}>
                  Select up to {MAX} fragrances for your curated box
                </p>
                <div style={{ display: 'inline-flex', background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', padding: '4px' }}>
                  <button
                    onClick={() => setGender('women')}
                    style={{
                      padding: '8px 24px',
                      background: gender === 'women' ? 'var(--bg-surface)' : 'transparent',
                      color: gender === 'women' ? 'var(--gold)' : 'var(--text-secondary)',
                      border: gender === 'women' ? '1px solid var(--gold-muted)' : '1px solid transparent',
                      fontFamily: 'var(--font-label)', fontSize: '11px', letterSpacing: '0.1em',
                      textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s ease'
                    }}
                  >
                    FOR HER
                  </button>
                  <button
                    onClick={() => setGender('men')}
                    style={{
                      padding: '8px 24px',
                      background: gender === 'men' ? 'var(--bg-surface)' : 'transparent',
                      color: gender === 'men' ? 'var(--gold)' : 'var(--text-secondary)',
                      border: gender === 'men' ? '1px solid var(--gold-muted)' : '1px solid transparent',
                      fontFamily: 'var(--font-label)', fontSize: '11px', letterSpacing: '0.1em',
                      textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s ease'
                    }}
                  >
                    FOR HIM
                  </button>
                </div>
              </div>
              <p style={{ color: 'var(--gold)', fontFamily: 'var(--font-ui)', fontWeight: 500 }}>
                {selected.length} of {MAX} selected
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', width: '100%' }} className="box-grid">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="skeleton" style={{ aspectRatio: '3/4', borderRadius: '2px' }} />
                  ))
                : products.map((product) => {
                    const isSelected = selected.some((p) => p.id === product.id);
                    return (
                      <div
                        key={product.id}
                        style={{ position: 'relative', cursor: 'pointer' }}
                        onClick={() => toggleProduct(product)}
                      >
                        {/* Inline card — no navigation */}
                        <div style={{
                          border: `2px solid ${isSelected ? 'var(--gold)' : 'transparent'}`,
                          transition: 'all 0.3s ease',
                          opacity: isSelected ? 0.9 : 1,
                          background: 'var(--bg-elevated)',
                          borderRadius: '2px',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          height: '100%',
                        }}>
                          {/* Image */}
                          <div style={{ height: '320px', background: 'var(--bg-surface)', overflow: 'hidden', position: 'relative' }}>
                            <img
                              src={product.images?.[0] || product.image}
                              alt={product.name}
                              loading="lazy"
                              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                            {product.isNew && (
                              <span className="badge-new" style={{ position: 'absolute', top: '12px', left: '12px' }}>NEW</span>
                            )}
                          </div>
                          {/* Body */}
                          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <p className="text-label" style={{ color: 'var(--gold-muted)', marginBottom: '6px' }}>
                              {(product.collection ?? product.brand ?? '').toUpperCase()}
                            </p>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '20px', lineHeight: 1.25, color: 'var(--text-primary)', marginBottom: '6px', flex: 1 }}>
                              {product.name}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '10px' }}>
                              {product.type} · {product.size}
                            </p>
                            <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: '18px' }}>
                              {formatPrice(product.price)}
                            </span>
                          </div>
                        </div>

                        {/* Checkbox overlay */}
                        <div
                          onClick={(e) => { e.stopPropagation(); toggleProduct(product); }}
                          style={{ position: 'absolute', top: '12px', right: '12px', cursor: 'pointer', zIndex: 10 }}
                        >
                          <div style={{
                            width: '24px', height: '24px',
                            border: `2px solid ${isSelected ? 'var(--gold)' : 'var(--bg-border)'}`,
                            background: isSelected ? 'var(--gold)' : 'var(--bg-surface)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s ease',
                          }}>
                            {isSelected && (
                              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                                <path d="M1 5L4.5 8.5L13 1" stroke="var(--bg-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                        </div>

                        {/* Selected bar */}
                        {isSelected && (
                          <div style={{ position: 'absolute', inset: 0, border: '2px solid var(--gold)', pointerEvents: 'none' }}>
                            <div style={{
                              position: 'absolute', bottom: '0', left: '0', width: '100%', padding: '8px 0', textAlign: 'center',
                              background: 'var(--gold)', color: 'var(--bg-primary)', fontFamily: 'var(--font-label)', fontSize: '10px',
                              letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase'
                            }}>
                              SELECTED
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
              }
            </div>

            {selected.length > 0 && (
              <div style={{ textAlign: 'center', marginTop: '48px' }}>
                <button className="btn-primary" onClick={() => setStep(1)}>
                  NEXT: PERSONALISE →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          STEPS 1 & 2 — PERSONALISE / ORDER
          ═══════════════════════════════════════════════ */}
      {(step === 1 || step === 2) && (
        <div className="bg-[#080808] text-[#e5e2e1] min-h-screen">
          <main className="pb-24 px-6 md:px-12 max-w-7xl mx-auto">

            {progressIndicator}

            {/* ─── STEP 1: PERSONALISE ─────────────────── */}
            {step === 1 && (
              <div className="container-content" style={{ paddingBottom: '120px' }}>
                <div style={{ textAlign: 'center', marginBottom: '96px' }}>
                  <h1 className="text-display" style={{ fontStyle: 'italic', color: 'var(--text-primary)', marginBottom: '16px' }}>The Final Touches</h1>
                  <p className="text-label" style={{ color: 'var(--text-secondary)' }}>ADD A PERSONAL SENTIMENT TO YOUR CURATED COLLECTION</p>
                </div>

                <section style={{ maxWidth: '720px', margin: '0 auto', marginBottom: '48px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div>
                      <span className="text-label" style={{ color: 'var(--gold)', display: 'block', marginBottom: '12px', fontWeight: 600 }}>SECTION A</span>
                      <h2 className="text-title" style={{ fontStyle: 'italic', color: 'var(--text-primary)' }}>Write your gift message</h2>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        maxLength={150}
                        className="input"
                        style={{
                          fontFamily: 'var(--font-display)', fontSize: '24px', fontStyle: 'italic',
                          height: '110px', resize: 'none', background: 'transparent', padding: '16px 0',
                          color: 'var(--text-primary)'
                        }}
                        placeholder="Begin typing your message..."
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                        <span className="text-label" style={{ color: 'var(--text-muted)', fontSize: '9px' }}>{message.length} / 150 CHARACTER LIMIT</span>
                      </div>
                    </div>
                  </div>
                </section>

                <section style={{ maxWidth: '720px', margin: '0 auto' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                      <div>
                        <span className="text-label" style={{ color: 'var(--gold)', display: 'block', marginBottom: '12px', fontWeight: 600 }}>SECTION B</span>
                        <h2 className="text-label" style={{ color: 'var(--text-primary)', fontSize: '13px' }}>RIBBON COLOUR</h2>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', paddingTop: '8px' }}>
                        {RIBBONS.map((r) => (
                          <button key={r.id} onClick={() => setRibbon(r.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', opacity: ribbon === r.id ? 1 : 0.6, transition: 'opacity 0.3s', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}>
                            <div style={{
                              background: r.hex, width: '44px', height: '44px', borderRadius: '50%',
                              border: ribbon === r.id ? '2px solid var(--gold)' : '2px solid transparent',
                              outline: '2px solid var(--bg-primary)', outlineOffset: '-2px',
                              boxShadow: ribbon === r.id ? '0 0 0 2px var(--gold)' : 'none'
                            }} />
                            <span className="text-label" style={{ fontSize: '8px', textAlign: 'center', lineHeight: '1.6', color: ribbon === r.id ? 'var(--gold)' : 'var(--text-muted)', maxWidth: '56px' }}>{r.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                      <h2 className="text-label" style={{ color: 'var(--text-primary)', fontSize: '13px', marginTop: '28px' }}>RECIPIENT NAME</h2>
                      <div style={{ position: 'relative', paddingTop: '4px' }}>
                        <input
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          className="input"
                          style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontStyle: 'italic', padding: '16px 0', background: 'transparent', color: 'var(--text-primary)' }}
                          placeholder="Enter full name"
                          type="text"
                        />
                      </div>
                      <p className="text-label" style={{ fontSize: '8px', color: 'var(--text-muted)', lineHeight: '1.8', maxWidth: '280px', marginTop: '16px' }}>THIS NAME WILL BE CALLIGRAPHED ON THE EXTERIOR ENVELOPE OF YOUR GIFT BOX.</p>
                    </div>
                  </div>
                </section>

                <div className="box-nav-row" style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '96px', borderBottom: '1px solid var(--bg-border)', paddingBottom: '80px' }}>
                  <button onClick={() => setStep(0)} className="btn-secondary" style={{ padding: '0 48px' }}>
                    ← BACK
                  </button>
                  <button onClick={() => setStep(2)} className="btn-primary" style={{ padding: '0 64px' }}>
                    CONTINUE →
                  </button>
                </div>
              </div>
            )}

            {/* ─── STEP 2: ORDER SUMMARY ───────────────── */}
            {step === 2 && (
              <div className="box-step2-grid" style={{
                display: 'grid',
                gridTemplateColumns: '7fr 5fr',
                gap: '4rem',
                alignItems: 'start',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 48px 96px',
              }}>

                {/* LEFT COLUMN */}
                <div>
                  {/* Header row */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    borderBottom: '1px solid rgba(201,168,76,0.1)', paddingBottom: '16px', marginBottom: '32px'
                  }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '36px', color: 'var(--text-primary)', fontStyle: 'italic' }}>Your Box</h2>
                    <button
                      onClick={() => setStep(0)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <FiArrowLeft size={14} /> EDIT SELECTION
                    </button>
                  </div>

                  {/* Products 3-column grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                    {selected.map(p => (
                      <div key={p.id} style={{
                        background: 'var(--bg-surface)',
                        padding: '16px',
                        aspectRatio: '3/4',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                      }}>
                        <img
                          src={p.images?.[0] || p.image}
                          alt={p.name}
                          className="product-box-img"
                        />
                        <p style={{ fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '4px' }}>
                          {p.type || 'Eau de Parfum'}
                        </p>
                        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '14px', fontStyle: 'italic', color: 'var(--gold)', lineHeight: 1.2 }}>
                          {p.name}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Personalisation Summary — left border only */}
                  <div style={{ background: 'var(--bg-surface)', padding: '40px', borderLeft: '3px solid rgba(201,168,76,0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <p style={{ fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--gold)' }}>PERSONALISATION SUMMARY</p>
                      <button
                        onClick={() => setStep(1)}
                        style={{ fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)', background: 'transparent', border: '1px solid var(--gold-border)', padding: '6px 14px', cursor: 'pointer', borderRadius: 0, transition: 'all 0.2s ease' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--gold-glow)'; e.currentTarget.style.borderColor = 'var(--gold)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--gold-border)'; }}
                      >
                        EDIT
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                      <div>
                        <p style={{ fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--gold-muted)', marginBottom: '8px' }}>SELECTED RIBBON</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '2px', background: getActiveRibbon()?.hex || 'var(--gold)', border: '1px solid var(--bg-border)', flexShrink: 0 }} />
                          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-primary)' }}>{getActiveRibbon()?.name || 'Classic Gold'}</span>
                        </div>
                      </div>
                      <div>
                        <p style={{ fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--gold-muted)', marginBottom: '8px' }}>GIFT MESSAGE</p>
                        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '14px', fontStyle: 'italic', color: message ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                          {message ? `"${message}"` : 'No personalized message applied'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN — sticky */}
                <aside className="box-step2-aside" style={{ position: 'sticky', top: '96px', minWidth: 0 }}>
                  {/* Summary card */}
                  <div style={{ background: '#2A2A2A', padding: '32px', position: 'relative', overflow: 'hidden' }}>

                    {/* Gold glow blob */}
                    <div style={{ position: 'absolute', top: 0, right: '40px', width: '64px', height: '80px', background: 'var(--gold)', opacity: 0.1, filter: 'blur(24px)', pointerEvents: 'none' }} />

                    {/* SUMMARY heading */}
                    <p style={{ fontFamily: 'var(--font-label)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.4em', color: 'var(--gold)', textAlign: 'center', marginBottom: '40px' }}>SUMMARY</p>

                    {/* Line items */}
                    <div style={{ paddingTop: '16px', paddingBottom: '16px', borderBottom: '1px solid rgba(201,168,76,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        Discovery Box ({selected.length} items)
                      </span>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-primary)' }}>{formatPrice(total)}</span>
                    </div>
                    <div style={{ paddingTop: '16px', paddingBottom: '16px', borderBottom: '1px solid rgba(201,168,76,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-secondary)' }}>Custom Ribbon & Messaging</span>
                      <span style={{ fontFamily: 'var(--font-label)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-primary)' }}>INCLUDED</span>
                    </div>
                    <div style={{ paddingTop: '16px', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-secondary)' }}>Express Shipping</span>
                      <span style={{ fontFamily: 'var(--font-label)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-primary)' }}>FREE</span>
                    </div>

                    {/* Divider */}
                    <div style={{ height: '1px', background: 'var(--gold-line)', margin: '8px 0 24px' }} />

                    {/* Total row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '48px' }}>
                      <span style={{ fontFamily: 'var(--font-label)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-primary)' }}>TOTAL AMOUNT</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '40px', color: 'var(--gold)' }}>{formatPrice(total)}</span>
                    </div>

                    {/* WhatsApp button */}
                    <a
                      href={`https://wa.me/${number}?text=${buildBoxMessage()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleWhatsAppCheckout}
                      style={{
                        width: '100%', height: 'auto', minHeight: '52px', background: '#25D366', color: '#fff',
                        fontFamily: 'var(--font-label)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '10px', marginBottom: '12px', textDecoration: 'none', borderRadius: '0', border: 'none',
                        padding: '14px 20px', whiteSpace: 'nowrap', overflow: 'hidden',
                      }}
                    >
                      <FiMessageCircle size={16} />
                      COMPLETE ORDER VIA WHATSAPP
                    </a>

                    {/* Add Box to Cart button */}
                    <button
                      onClick={handleAddBoxToCart}
                      style={{
                        width: '100%', height: 'auto', minHeight: '48px', background: 'transparent',
                        border: boxAddedSuccess ? '1px solid var(--gold)' : '1px solid var(--gold-border)',
                        color: boxAddedSuccess ? 'var(--gold)' : 'var(--text-secondary)',
                        fontFamily: 'var(--font-label)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '8px', marginBottom: '32px', borderRadius: '0', transition: 'border-color 0.25s ease, color 0.25s ease',
                        padding: '12px 20px', whiteSpace: 'nowrap', overflow: 'hidden',
                      }}
                      onMouseEnter={(e) => { if (!boxAddedSuccess) { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
                      onMouseLeave={(e) => { if (!boxAddedSuccess) { e.currentTarget.style.borderColor = 'var(--gold-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
                    >
                      <FiShoppingBag size={16} style={{ color: boxAddedSuccess ? 'var(--gold)' : 'var(--gold)' }} />
                      {boxAddedSuccess ? 'BOX ADDED TO CART ✓' : 'ADD BOX TO CART'}
                    </button>

                    {/* Security note */}
                    <p style={{ fontFamily: 'var(--font-label)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
                      Secure checkout via concierge. Your curator will confirm your selection within 15 minutes.
                    </p>
                  </div>

                  {/* Trust badges — outside card */}
                  <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ border: '1px solid rgba(201,168,76,0.1)', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <FiShield size={18} style={{ color: 'var(--gold)' }} />
                      <span style={{ fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>SAFE CONCIERGE</span>
                    </div>
                    <div style={{ border: '1px solid rgba(201,168,76,0.1)', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <FiTruck size={18} style={{ color: 'var(--gold)' }} />
                      <span style={{ fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>EXPRESS GLOBAL</span>
                    </div>
                  </div>
                </aside>

              </div>
            )}

          </main>
        </div>
      )}

      <Footer variant="full" />

      <style>{`
        /* Box product selection grid */
        @media (max-width: 1023px) { .box-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 767px) {
          .box-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          .box-step0-padding { padding: 0 24px 60px !important; }
          /* Step 1 personalise */
          .box-step1-padding { padding-bottom: 60px !important; }
          /* Step 2 order layout — stack */
          .box-step2-grid { grid-template-columns: 1fr !important; padding: 0 24px 60px !important; }
          .box-step2-aside { position: static !important; }
          /* Progress indicator labels */
          .box-progress-label { font-size: 9px !important; }
          .box-progress-line { width: 32px !important; }
          /* Step 1 back/continue row */
          .box-nav-row { flex-direction: column !important; gap: 12px !important; }
          .box-nav-row button { width: 100% !important; padding: 0 24px !important; }
        }
      `}</style>
    </>
  );
}
