import { useRef, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { useFilters } from '../../context/FilterContext';
import gsap from 'gsap';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  brands: string[];
}

const SIZE_OPTIONS = ['25ml', '30ml', '50ml', '55ml', '75ml', '80ml', '100ml', '105ml', '150ml', '200ml'];

const PRICE_RANGES = [
  { label: 'Under ₦100,000', value: 'under-100k' },
  { label: '₦100,000 – ₦300,000', value: '100k-300k' },
  { label: '₦300,000 – ₦500,000', value: '300k-500k' },
  { label: 'Above ₦500,000', value: 'above-500k' },
];

const sectionStyle: React.CSSProperties = { marginBottom: '32px', flexShrink: 0 };
const labelStyle: React.CSSProperties = { color: 'var(--text-secondary)', marginBottom: '16px' };
const checkLabelStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', marginBottom: '10px' };
const checkboxStyle: React.CSSProperties = { accentColor: 'var(--gold)', width: '14px', height: '14px', flexShrink: 0 };
const checkTextStyle: React.CSSProperties = { color: 'var(--text-secondary)', fontSize: '14px' };

export function FilterDrawer({ isOpen, onClose, brands }: FilterDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { activeFilters, setFilter, clearFilters } = useFilters();

  // Set initial off-screen position without animation on mount
  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      gsap.set(drawer, { y: '100%', x: 0 });
    } else {
      gsap.set(drawer, { x: '100%', y: 0 });
    }
  }, []);

  useEffect(() => {
    const drawer = drawerRef.current;
    const overlay = overlayRef.current;
    if (!drawer || !overlay) return;

    const isMobile = window.innerWidth < 1024;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (isMobile) {
        gsap.to(drawer, { y: 0, duration: 0.4, ease: 'power2.out' });
      } else {
        gsap.to(drawer, { x: 0, duration: 0.4, ease: 'power2.out' });
      }
      gsap.to(overlay, { opacity: 0.6, duration: 0.4 });
    } else {
      document.body.style.overflow = '';
      if (isMobile) {
        gsap.to(drawer, { y: '100%', duration: 0.35, ease: 'power2.in' });
      } else {
        gsap.to(drawer, { x: '100%', duration: 0.35, ease: 'power2.in' });
      }
      gsap.to(overlay, { opacity: 0, duration: 0.35 });
    }
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        ref={overlayRef}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: '#000',
          zIndex: 200,
          opacity: 0,
          pointerEvents: isOpen ? 'all' : 'none',
        }}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="filter-drawer"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '380px',
          background: 'var(--bg-elevated)',
          borderLeft: '1px solid var(--bg-border)',
          zIndex: 201,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
      <style>{`
        @media (max-width: 1023px) {
          .filter-drawer {
            top: auto !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
            height: 85vh !important;
            border-left: none !important;
            border-top: 1px solid var(--bg-border) !important;
            border-radius: 12px 12px 0 0 !important;
          }
        }
      `}</style>
        {/* Drag handle — mobile only */}
        <div style={{ width: '40px', height: '4px', background: 'var(--bg-border)', borderRadius: '2px', margin: '12px auto 0' }} />
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid var(--bg-border)', flexShrink: 0 }}>
          <span className="text-label" style={{ color: 'var(--text-primary)' }}>FILTER</span>
          <button onClick={onClose} style={{ color: 'var(--text-secondary)', padding: '4px', background: 'none', border: 'none', cursor: 'pointer' }}>
            <FiX size={20} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', minHeight: 0 }}>

          {/* Brand */}
          <div style={sectionStyle}>
            <p className="text-label" style={labelStyle}>BRAND</p>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={checkLabelStyle}>
                <input
                  type="checkbox"
                  checked={!activeFilters.brand}
                  onChange={() => setFilter('brand', null)}
                  style={checkboxStyle}
                />
                <span style={checkTextStyle}>All</span>
              </label>
              {brands.filter(b => b.trim() !== '').map((brand) => (
                <label key={brand} style={checkLabelStyle}>
                  <input
                    type="checkbox"
                    checked={activeFilters.brand === brand}
                    onChange={() => setFilter('brand', activeFilters.brand === brand ? null : brand)}
                    style={checkboxStyle}
                  />
                  <span style={checkTextStyle}>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid var(--bg-border)', marginBottom: '32px' }} />

          {/* FOR */}
          <div style={sectionStyle}>
            <p className="text-label" style={labelStyle}>FOR</p>
            {['men', 'women', 'unisex'].map((cat) => (
              <label key={cat} style={checkLabelStyle}>
                <input
                  type="radio"
                  name="category"
                  checked={activeFilters.category === cat}
                  onChange={() => setFilter('category', cat)}
                  style={checkboxStyle}
                />
                <span style={{ ...checkTextStyle, textTransform: 'capitalize' }}>{cat}</span>
              </label>
            ))}
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid var(--bg-border)', marginBottom: '32px' }} />

          {/* Size */}
          <div style={sectionStyle}>
            <p className="text-label" style={labelStyle}>SIZE</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {SIZE_OPTIONS.map((size) => {
                const isActive = activeFilters.size === size;
                return (
                  <button
                    key={size}
                    onClick={() => setFilter('size', isActive ? null : size)}
                    style={{
                      padding: '6px 14px',
                      border: `1px solid ${isActive ? 'var(--gold)' : 'var(--bg-border)'}`,
                      background: isActive ? 'var(--gold-glow)' : 'transparent',
                      color: isActive ? 'var(--gold)' : 'var(--text-secondary)',
                      fontFamily: 'var(--font-label)',
                      fontSize: '11px',
                      letterSpacing: '0.1em',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      borderRadius: 0,
                    }}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid var(--bg-border)', marginBottom: '32px' }} />

          {/* Price Range */}
          <div style={sectionStyle}>
            <p className="text-label" style={labelStyle}>PRICE RANGE</p>
            {PRICE_RANGES.map((range) => {
              const isActive = activeFilters.priceRange === range.value;
              return (
                <label key={range.value} style={checkLabelStyle}>
                  <input
                    type="radio"
                    name="priceRange"
                    checked={isActive}
                    onChange={() => setFilter('priceRange', isActive ? null : range.value)}
                    style={checkboxStyle}
                  />
                  <span style={checkTextStyle}>{range.label}</span>
                </label>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid var(--bg-border)', marginBottom: '32px' }} />

          {/* Collection */}
          <div style={sectionStyle}>
            <p className="text-label" style={labelStyle}>COLLECTION</p>
            {[{ label: 'Signature', value: 'signature' }, { label: 'Limited Edition', value: 'limited' }].map((col) => (
              <label key={col.value} style={checkLabelStyle}>
                <input
                  type="checkbox"
                  checked={activeFilters.collection === col.value}
                  onChange={() => setFilter('collection', activeFilters.collection === col.value ? null : col.value)}
                  style={checkboxStyle}
                />
                <span style={checkTextStyle}>{col.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '24px', borderTop: '1px solid var(--bg-border)', display: 'flex', gap: '16px', flexShrink: 0 }}>
          <button
            onClick={() => { clearFilters(); onClose(); }}
            style={{ color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'var(--font-ui)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Clear All
          </button>
          <button className="btn-primary btn-full" onClick={onClose}>
            APPLY FILTERS
          </button>
        </div>
      </div>
    </>
  );
}
