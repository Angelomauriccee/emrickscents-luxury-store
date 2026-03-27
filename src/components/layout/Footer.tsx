import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook } from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';
import { useShippingModal } from '../../context/ShippingModalContext';

interface FooterProps {
  variant?: 'full' | 'minimal';
}

export function Footer({ variant = 'full' }: FooterProps) {
  const { openShippingModal } = useShippingModal();

  if (variant === 'minimal') {
    return (
      <footer
        style={{
          borderTop: '1px solid var(--bg-border)',
          padding: '40px 0',
          textAlign: 'center',
        }}
      >
        <div className="container-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '0.18em', color: 'var(--gold)', fontWeight: 300 }}>
            EMRICKSCENTS
          </span>
          <div style={{ display: 'flex', gap: '32px' }}>
            {['Shipping', 'Returns', 'Careers'].map((l) => (
              <a key={l} href="#" className="text-label" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}>
                {l.toUpperCase()}
              </a>
            ))}
          </div>
          <p className="text-label" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} EMRICKSCENTS PURVEYORS. MADE IN LAGOS.
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer style={{ borderTop: '1px solid var(--bg-border)', paddingTop: '80px', paddingBottom: '40px' }}>
      <div className="container-content">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr',
            gap: '60px',
            paddingBottom: '60px',
            borderBottom: '1px solid var(--bg-border)',
          }}
          className="footer-grid"
        >
          {/* Column 1 — Brand */}
          <div>
            <Link to="/" style={{ display: 'block', marginBottom: '16px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '0.18em', color: 'var(--gold)', fontWeight: 300 }}>
                EMRICKSCENTS
              </span>
            </Link>
            <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 400, fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '280px', lineHeight: 1.7 }}>
              Emrickscents is a luxury perfume boutique offering a curated selection of rare, artisanal, and designer fragrances. Known for elegance and sophistication, the brand provides personalized consultations and cruelty-free, high-quality perfumes crafted with sustainably sourced ingredients. Emrickscents turns fragrance into a refined, sensory art form tailored to each individual.
            </p>
            <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
              <a href="https://www.instagram.com/emrickscents?igsh=N2p6cjk3Y296c3Vl" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }} aria-label="Instagram" onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}><FiInstagram size={18} /></a>
              <a href="https://www.facebook.com/share/17v65JUbkn/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }} aria-label="Facebook" onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}><FiFacebook size={18} /></a>
              <a href="https://wa.me/+2349065988598" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }} aria-label="WhatsApp" onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}><BsWhatsapp size={18} /></a>
            </div>
          </div>

          {/* Column 2 — Navigation */}
          <div>
            <p className="text-label" style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>NAVIGATION</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Shop', path: '/shop' },
                { label: 'Build Your Box', path: '/build-your-box' },
                { label: 'About', path: '/about' },
                { label: 'Store Locator', path: '/store-locator' },
                { label: 'Contact', path: '/contact' },
              ].map((l) => (
                <Link key={l.path} to={l.path} style={{ color: 'var(--text-muted)', fontSize: '14px', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3 — Customer Care */}
          <div>
            <p className="text-label" style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>CUSTOMER CARE</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <button
                onClick={openShippingModal}
                style={{
                  color: 'var(--text-muted)', fontSize: '14px', background: 'none', border: 'none',
                  cursor: 'pointer', padding: 0, textAlign: 'left', fontFamily: 'inherit',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                Shipping & Returns
              </button>
              <Link to="/contact" style={{ color: 'var(--text-muted)', fontSize: '14px', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ paddingTop: '32px', display: 'flex', justifyContent: 'center' }}>
          <p className="text-label" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} EMRICKSCENTS ALL RIGHTS RESERVED
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 0 !important; }
          .footer-grid > div { text-align: center !important; padding: 32px 0 !important; border-bottom: 1px solid var(--bg-border) !important; }
          .footer-grid > div:last-child { border-bottom: none !important; }
          .footer-grid > div p { margin-left: auto !important; margin-right: auto !important; }
          .footer-grid > div > div { justify-content: center !important; align-items: center !important; }
          .footer-grid > div a, .footer-grid > div button { text-align: center !important; }
        }
      `}</style>
    </footer>
  );
}
