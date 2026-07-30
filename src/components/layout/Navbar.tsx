import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FiSearch, FiShoppingBag, FiX, FiMenu, FiChevronDown } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useSearch } from '../../context/SearchContext';
import { useProducts } from '../../hooks/useProducts';
import { NAV_LINKS, PRODUCTS_FETCH_LIMIT } from '../../utils/constants';
import { ShopMegaMenu } from './ShopMegaMenu';
import gsap from 'gsap';

export function Navbar() {
  const { cartCount } = useCart();
  const { openSearch } = useSearch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [shopHover, setShopHover] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const shopHoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shopDropdownRef = useRef<HTMLDivElement>(null);
  const mobileShopPanelRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const { products: shopProducts, loading: shopLoading } = useProducts({
    pageSize: PRODUCTS_FETCH_LIMIT,
    sortBy: 'name',
    sortDir: 'asc',
  });

  const openShopHover = () => {
    if (shopHoverTimeout.current) clearTimeout(shopHoverTimeout.current);
    setShopHover(true);
  };
  const closeShopHover = () => {
    shopHoverTimeout.current = setTimeout(() => setShopHover(false), 200);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile on route change
  useEffect(() => {
    setMobileOpen(false);
    setMobileShopOpen(false);
    document.body.style.overflow = '';
  }, [location]);

  const toggleMobile = () => {
    const next = !mobileOpen;
    setMobileOpen(next);
    document.body.style.overflow = next ? 'hidden' : '';
  };

  // ESC closes mobile menu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && mobileOpen) toggleMobile(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  useEffect(() => {
    const el = mobileMenuRef.current;
    if (!el) return;
    if (mobileOpen) {
      gsap.fromTo(el, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
      // Scoped to top-level rows only — querying 'a' here would also catch the (always-mounted,
      // hidden) mega-menu's product links and stagger behind hundreds of them first
      gsap.fromTo(
        el.querySelectorAll('.mobile-nav-row'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.4, delay: 0.1, ease: 'power2.out' }
      );
    }
  }, [mobileOpen]);

  // Desktop dropdown open/close animation (panel stays mounted — only opacity/transform animate,
  // so hovering never unmounts/remounts it, which was causing the blink)
  useEffect(() => {
    const el = shopDropdownRef.current;
    if (!el) return;
    gsap.killTweensOf(el);
    if (shopHover) {
      gsap.set(el, { pointerEvents: 'auto' });
      gsap.to(el, { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: 'power2.out' });
    } else {
      gsap.to(el, {
        opacity: 0,
        y: -8,
        scale: 0.98,
        duration: 0.18,
        ease: 'power2.in',
        onComplete: () => { gsap.set(el, { pointerEvents: 'none' }); },
      });
    }
  }, [shopHover]);

  // Mobile "Shop" accordion open/close animation
  useEffect(() => {
    const el = mobileShopPanelRef.current;
    if (!el) return;
    gsap.to(el, {
      height: mobileShopOpen ? 'auto' : 0,
      opacity: mobileShopOpen ? 1 : 0,
      duration: 0.4,
      ease: 'power2.inOut',
      overwrite: true,
    });
  }, [mobileShopOpen]);

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
            {NAV_LINKS.map((link) =>
              link.path === '/shop' ? (
                <div
                  key={link.path}
                  style={{ position: 'relative' }}
                  onMouseEnter={openShopHover}
                  onMouseLeave={closeShopHover}
                >
                  <NavLink
                    to={link.path}
                    className={({ isActive }) => `nav-link ${isActive || shopHover ? 'active' : ''}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    {link.label}
                    <FiChevronDown
                      size={14}
                      style={{
                        transition: 'transform 0.2s ease',
                        transform: shopHover ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    />
                  </NavLink>

                  {/* Always mounted — top:100% with zero gap + paddingTop spacer keeps the
                      hover chain unbroken between the link and the panel (no dead zone to blink through) */}
                  <div
                    ref={shopDropdownRef}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      transformOrigin: 'top center',
                      paddingTop: '16px',
                      opacity: 0,
                      pointerEvents: 'none',
                      zIndex: 110,
                    }}
                  >
                    <div
                      style={{
                        minWidth: '640px',
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--gold-border)',
                        borderTop: '2px solid var(--gold)',
                        boxShadow: '0 24px 48px rgba(0,0,0,0.45)',
                      }}
                    >
                      <ShopMegaMenu products={shopProducts} loading={shopLoading} />
                    </div>
                  </div>
                </div>
              ) : (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  {link.label}
                </NavLink>
              )
            )}
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
            background: 'var(--bg-primary)',
            zIndex: 99,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            overflowY: 'auto',
            padding: '32px 28px 60px',
          }}
        >
          {NAV_LINKS.map((link, i) =>
            link.path === '/shop' ? (
              <div
                key={link.path}
                className="mobile-nav-row"
                style={{
                  width: '100%',
                  borderBottom: i < NAV_LINKS.length - 1 ? '1px solid var(--gold-line)' : 'none',
                  padding: '22px 0',
                }}
              >
                <button
                  onClick={() => setMobileShopOpen((v) => !v)}
                  className={`nav-link text-heading ${location.pathname === '/shop' ? 'active' : ''}`}
                  style={{
                    fontSize: '30px',
                    letterSpacing: '0.03em',
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'none',
                    border: 'none',
                  }}
                >
                  {link.label}
                  <FiChevronDown
                    size={20}
                    color="var(--gold)"
                    style={{
                      transition: 'transform 0.3s ease',
                      transform: mobileShopOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>

                <div
                  ref={mobileShopPanelRef}
                  style={{
                    marginTop: mobileShopOpen ? '18px' : 0,
                    width: '100%',
                    textAlign: 'left',
                    background: 'var(--bg-elevated)',
                    border: '1px solid',
                    borderColor: mobileShopOpen ? 'var(--gold-border)' : 'transparent',
                    transition: 'border-color 0.3s ease, margin-top 0.3s ease',
                    height: 0,
                    opacity: 0,
                    overflow: 'hidden',
                  }}
                >
                  <ShopMegaMenu
                    products={shopProducts}
                    loading={shopLoading}
                    variant="mobile"
                    onNavigate={() => setMobileOpen(false)}
                  />
                </div>
              </div>
            ) : (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `mobile-nav-row nav-link text-heading ${isActive ? 'active' : ''}`}
                style={{
                  fontSize: '30px',
                  letterSpacing: '0.03em',
                  padding: '22px 0',
                  borderBottom: i < NAV_LINKS.length - 1 ? '1px solid var(--gold-line)' : 'none',
                }}
              >
                {link.label}
              </NavLink>
            )
          )}
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
