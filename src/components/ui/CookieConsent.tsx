import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const STORAGE_KEY = 'emrickscents-cookies';

interface ToggleProps {
  checked: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
}

function Toggle({ checked, onChange, disabled }: ToggleProps) {
  return (
    <div
      onClick={() => !disabled && onChange?.(!checked)}
      style={{
        width: '40px', height: '22px', borderRadius: '999px', flexShrink: 0,
        background: checked ? 'var(--gold)' : 'var(--bg-border)',
        position: 'relative', cursor: disabled ? 'default' : 'pointer',
        transition: 'background 0.2s ease',
        opacity: disabled ? 0.7 : 1,
      }}
    >
      <div style={{
        position: 'absolute', top: '2px',
        left: checked ? '20px' : '2px',
        width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
        transition: 'left 0.2s ease',
      }} />
    </div>
  );
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [analytical, setAnalytical] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (visible && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [visible]);

  const save = (analyticalVal: boolean, marketingVal: boolean) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      essential: true,
      analytical: analyticalVal,
      marketing: marketingVal,
      savedAt: new Date().toISOString(),
    }));
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        y: 20, opacity: 0, duration: 0.35, ease: 'power2.in',
        onComplete: () => setVisible(false),
      });
    } else {
      setVisible(false);
    }
  };

  if (!visible) return null;

  const rowStyle: React.CSSProperties = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingTop: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--bg-border)',
    gap: '16px',
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
        background: 'var(--bg-elevated)', border: '1px solid var(--gold-border)', borderRadius: '2px',
        padding: '32px 40px', maxWidth: '480px', width: '90%', zIndex: 999,
      }}
    >
      {/* Header */}
      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontStyle: 'italic', fontSize: '28px', color: 'var(--text-primary)', marginBottom: '8px' }}>
        Cookie Preferences
      </h3>
      <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 400, fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px', lineHeight: 1.6 }}>
        We use cookies to enhance your sensory journey and personalise your experience.
      </p>

      {/* Essential */}
      <div style={rowStyle}>
        <div>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold-muted)', marginBottom: '4px' }}>ESSENTIAL COOKIES</p>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-muted)' }}>Required for the site to function correctly.</p>
        </div>
        <Toggle checked={true} disabled={true} />
      </div>

      {/* Analytical */}
      <div style={rowStyle}>
        <div>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold-muted)', marginBottom: '4px' }}>ANALYTICAL COOKIES</p>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-muted)' }}>Help us understand how visitors interact with our site.</p>
        </div>
        <Toggle checked={analytical} onChange={setAnalytical} />
      </div>

      {/* Marketing */}
      <div style={{ ...rowStyle, borderBottom: 'none' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold-muted)', marginBottom: '4px' }}>MARKETING COOKIES</p>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-muted)' }}>Personalised content based on your interests.</p>
        </div>
        <Toggle checked={marketing} onChange={setMarketing} />
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button
          onClick={() => save(true, true)}
          style={{
            flex: 1, height: '44px', background: 'var(--gold)', color: 'var(--bg-primary)',
            fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: '12px', textTransform: 'uppercase',
            letterSpacing: '0.08em', border: 'none', borderRadius: 0, cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gold-light)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'var(--gold)'}
        >
          ACCEPT ALL
        </button>
        <button
          onClick={() => save(analytical, marketing)}
          style={{
            flex: 1, height: '44px', background: 'transparent', color: 'var(--text-secondary)',
            border: '1px solid var(--gold-border)', fontFamily: 'var(--font-ui)', fontWeight: 500,
            fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em',
            borderRadius: 0, cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--gold-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
        >
          SAVE PREFERENCES
        </button>
      </div>
    </div>
  );
}
