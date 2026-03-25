import { Link } from 'react-router-dom';
import { FiMapPin, FiClock } from 'react-icons/fi';
import { STORE_INFO } from '../../utils/constants';

export function StoreLocatorTeaser() {
  return (
    <section style={{ padding: '100px 0', borderTop: '1px solid var(--bg-border)' }}>
      <div className="container-content">
        <div style={{ display: 'flex', gap: '80px', alignItems: 'center' }} className="store-layout">
          {/* Left — Info */}
          <div style={{ flex: 1 }}>
            <p className="text-label" style={{ color: 'var(--gold-muted)', marginBottom: '20px' }}>OUR STORE · LAGOS</p>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 300,
                fontSize: 'clamp(32px, 3vw, 48px)',
                color: 'var(--text-primary)',
                marginBottom: '32px',
                lineHeight: 1.1,
              }}
            >
              Flagship Boutique
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '36px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <FiMapPin size={16} style={{ color: 'var(--gold-muted)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7 }}>
                    {STORE_INFO.address}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <FiClock size={16} style={{ color: 'var(--gold-muted)', flexShrink: 0, marginTop: '2px' }} />
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7 }}>
                  {STORE_INFO.hours}
                </p>
              </div>
            </div>
            <Link to="/store-locator" className="btn-secondary" style={{ display: 'inline-flex' }}>
              GET DIRECTIONS →
            </Link>
          </div>

          {/* Right — Map placeholder */}
          <div
            style={{
              flex: 1,
              height: '360px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--bg-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
            className="store-map"
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundImage: `
                  repeating-linear-gradient(0deg, var(--bg-border) 0, var(--bg-border) 1px, transparent 1px, transparent 40px),
                  repeating-linear-gradient(90deg, var(--bg-border) 0, var(--bg-border) 1px, transparent 1px, transparent 40px)
                `,
              }}
            />
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <FiMapPin size={40} style={{ color: 'var(--gold)' }} />
              <p className="text-label" style={{ color: 'var(--text-muted)' }}>OGUDU MALL · LAGOS</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .store-layout { flex-direction: column !important; gap: 40px !important; }
          .store-map { width: 100%; }
        }
      `}</style>
    </section>
  );
}
