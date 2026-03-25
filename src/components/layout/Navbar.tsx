import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FiSearch, FiShoppingBag, FiX, FiMenu } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useSearch } from '../../context/SearchContext';
import { NAV_LINKS } from '../../utils/constants';
import gsap from 'gsap';

export function Navbar() {
  const { cartCount } = useCart();
  const { openSearch } = useSearch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile on route change
  useEffect(() => {
    setMobileOpen(false);
    document.body.style.overflow = '';
  }, [location]);

  const toggleMobile = () => {
    const next = !mobileOpen;
    setMobileOpen(next);
    document.body.style.overflow = next ? 'hidden' : '';
  };

  useEffect(() => {
    const el = mobileMenuRef.current;
    if (!el) return;
    if (mobileOpen) {
      gsap.fromTo(el, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
    }
  }, [mobileOpen]);

  return (
    <>
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          height: 'var(--nav-height)',
          background: scrolled ? 'rgba(17,17,17,0.96)' : 'var(--bg-elevated)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--bg-border)',
          transition: 'background 0.3s ease',
        }}
      >
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 80px',
          }}
          className="responsive-nav-padding"
        >
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="/logo.png"
              alt="EMRICKSCENTS"
              style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="desktop-nav" style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <button
              onClick={openSearch}
              style={{ color: 'var(--text-secondary)', transition: 'color 0.2s', padding: '4px' }}
              aria-label="Search"
            >
              <FiSearch size={20} />
            </button>
            <Link
              to="/cart"
              style={{ position: 'relative', color: 'var(--text-secondary)', padding: '4px', transition: 'color 0.2s' }}
              aria-label="Cart"
            >
              <FiShoppingBag size={20} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-6px',
                    background: 'var(--gold)',
                    color: 'var(--bg-primary)',
                    fontSize: '10px',
                    fontWeight: 600,
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-ui)',
                  }}
                >
                  {cartCount > 99 ? '99' : cartCount}
                </span>
              )}
            </Link>
            {/* Mobile hamburger */}
            <button
              onClick={toggleMobile}
              style={{
                color: 'var(--text-secondary)',
                padding: '4px',
                display: 'none',
              }}
              className="mobile-menu-toggle"
              aria-label="Menu"
            >
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          ref={mobileMenuRef}
          style={{
            position: 'fixed',
            inset: 0,
            top: 'var(--nav-height)',
            background: 'var(--bg-elevated)',
            zIndex: 99,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '40px',
          }}
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `nav-link text-heading ${isActive ? 'active' : ''}`}
              style={{ fontSize: '36px', letterSpacing: '0.05em' }}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-toggle { display: flex !important; }
          .responsive-nav-padding { padding: 0 24px !important; }
        }
        @media (max-width: 1024px) {
          .responsive-nav-padding { padding: 0 40px !important; }
        }
      `}</style>
    </>
  );
}
