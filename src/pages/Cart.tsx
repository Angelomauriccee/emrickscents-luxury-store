import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag } from 'react-icons/fi';
import { CartItem as CartItemComponent } from '../components/cart/CartItem';
import { OrderSummary } from '../components/cart/OrderSummary';
import { EmptyState } from '../components/ui/EmptyState';
import { Footer } from '../components/layout/Footer';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cartItems, cartCount, clearCart } = useCart();
  const [clearConfirm, setClearConfirm] = useState(false);

  const handleClearAll = () => {
    if (clearConfirm) {
      clearCart();
      setClearConfirm(false);
    } else {
      setClearConfirm(true);
      setTimeout(() => setClearConfirm(false), 3000);
    }
  };

  return (
    <>
      <div className="container-content cart-page" style={{ padding: '64px 80px', minHeight: '80vh' }}>
        {cartItems.length === 0 ? (
          <EmptyState
            icon={<FiShoppingBag />}
            title="Your cart is empty"
            description="Discover something beautiful."
            ctaLabel="EXPLORE COLLECTION"
            ctaPath="/shop"
          />
        ) : (
          <>
            {/* Header */}
            <div className="cart-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
              <div>
                <p className="text-label" style={{ color: 'var(--gold-muted)', marginBottom: '10px' }}>YOUR CART</p>
                <h1
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontWeight: 300,
                    fontSize: 'clamp(40px, 5vw, 64px)',
                    color: 'var(--text-primary)',
                  }}
                >
                  Your Selection
                </h1>
              </div>
              <div className="cart-header-right" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <p className="text-label" style={{ color: 'var(--text-secondary)' }}>
                  {cartCount} {cartCount === 1 ? 'ITEM' : 'ITEMS'} IN YOUR COLLECTION
                </p>
                <button
                  onClick={handleClearAll}
                  style={{
                    fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase',
                    letterSpacing: '0.15em', color: clearConfirm ? 'var(--gold)' : 'var(--text-muted)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => { if (!clearConfirm) e.currentTarget.style.color = 'var(--gold)'; }}
                  onMouseLeave={(e) => { if (!clearConfirm) e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  {clearConfirm ? 'CONFIRM CLEAR?' : 'CLEAR ALL'}
                </button>
              </div>
            </div>

            {/* Cart layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '60% 40%', gap: '60px', alignItems: 'start' }} className="cart-layout">
              {/* Items */}
              <div>
                {cartItems.map((item) => (
                  <CartItemComponent key={item.id} item={item} />
                ))}
                <Link
                  to="/shop"
                  style={{
                    fontFamily: 'var(--font-label)',
                    fontSize: '11px',
                    letterSpacing: '0.15em',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '8px',
                    transition: 'color 0.2s',
                  }}
                >
                  ← CONTINUE SHOPPING
                </Link>
              </div>

              {/* Summary */}
              <div>
                <OrderSummary />
              </div>
            </div>
          </>
        )}
      </div>

      <Footer variant="full" />

      <style>{`
        @media (max-width: 1023px) {
          .cart-layout { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 767px) {
          .cart-page { padding: 32px 24px !important; }
          .cart-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; margin-bottom: 32px !important; }
          .cart-header-right { flex-direction: row !important; gap: 16px !important; align-items: center !important; }
          .cart-box-personalisation { grid-template-columns: 1fr !important; }
          .order-summary-wrap { position: static !important; }
        }
      `}</style>
    </>
  );
}
