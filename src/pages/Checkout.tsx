import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import { triggerPaystackPayment } from '../utils/paystack';
import { saveOrder } from '../firebase/orders';
import { CustomerInfo } from '../types';
import { Footer } from '../components/layout/Footer';
import { EmptyState } from '../components/ui/EmptyState';
import { FiShoppingBag, FiLock, FiCheckCircle } from 'react-icons/fi';

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (cartItems.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    if (!customer.fullName || !customer.email || !customer.phone || !customer.address || !customer.city || !customer.state) {
      setErrorMessage('Please fill in all shipping details.');
      return;
    }

    setIsProcessing(true);

    const reference = `ES-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const itemsSummary = cartItems
      .map((item) => `${item.name} (${item.size || 'Standard'}) — Qty: ${item.quantity} x ${formatPrice(item.price)} = ${formatPrice(item.price * item.quantity)}`)
      .join(' | ');

    const fullDeliveryAddress = `${customer.address}, ${customer.city}, ${customer.state}`;

    try {
      await triggerPaystackPayment({
        email: customer.email,
        amountInNaira: cartTotal,
        reference,
        customerName: customer.fullName,
        phone: customer.phone,
        itemsSummary,
        deliveryAddress: fullDeliveryAddress,
        onSuccess: async (paystackRef) => {
          try {
            const newOrder = {
              reference: paystackRef || reference,
              customer,
              items: cartItems,
              totalAmount: cartTotal,
              status: 'paid' as const,
              paymentChannel: 'Paystack',
            };

            await saveOrder(newOrder);
            clearCart();
            navigate('/order-success', { state: { order: newOrder } });
          } catch (err: unknown) {
            console.error('Failed to save order to Firebase:', err);
            // Even if Firebase fails, payment succeeded, so clear cart & navigate
            clearCart();
            navigate('/order-success', {
              state: {
                order: {
                  reference: paystackRef || reference,
                  customer,
                  items: cartItems,
                  totalAmount: cartTotal,
                  status: 'paid',
                },
              },
            });
          }
        },
        onClose: () => {
          setIsProcessing(false);
          setErrorMessage('Payment cancelled. You can try again when ready.');
        },
      });
    } catch (err: unknown) {
      setIsProcessing(false);
      const msg = err instanceof Error ? err.message : 'An error occurred initializing payment.';
      setErrorMessage(msg);
    }
  };

  if (cartItems.length === 0) {
    return (
      <>
        <div className="container-content" style={{ padding: '80px 24px', minHeight: '70vh' }}>
          <EmptyState
            icon={<FiShoppingBag />}
            title="Your cart is empty"
            description="Add fragrances to your cart before proceeding to checkout."
            ctaLabel="DISCOVER FRAGRANCES"
            ctaPath="/shop"
          />
        </div>
        <Footer variant="full" />
      </>
    );
  }

  return (
    <>
      <div className="container-content checkout-page" style={{ padding: '64px 80px', minHeight: '85vh' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <p className="text-label" style={{ color: 'var(--gold-muted)', marginBottom: '10px' }}>EMRICKSCENTS CHECKOUT</p>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(36px, 4vw, 56px)',
              color: 'var(--text-primary)',
            }}
          >
            Delivery & Payment
          </h1>
        </div>

        {errorMessage && (
          <div
            style={{
              padding: '16px',
              marginBottom: '32px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#f87171',
              fontSize: '14px',
            }}
          >
            {errorMessage}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '60% 40%', gap: '60px', alignItems: 'start' }} className="checkout-layout">
          {/* Shipping Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', padding: '32px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--gold)', marginBottom: '24px' }}>
                1. Delivery Details
              </h2>

              <div style={{ display: 'grid', gap: '18px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontFamily: 'var(--font-label)', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="e.g. Angelo Maurice"
                    style={{
                      padding: '12px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--bg-border)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-grid-2">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontFamily: 'var(--font-label)', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      value={customer.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="e.g. angelo@example.com"
                      style={{
                        padding: '12px',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--bg-border)',
                        color: 'var(--text-primary)',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontFamily: 'var(--font-label)', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>
                      PHONE NUMBER *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customer.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="e.g. 08012345678"
                      style={{
                        padding: '12px',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--bg-border)',
                        color: 'var(--text-primary)',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontFamily: 'var(--font-label)', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>
                    STREET ADDRESS *
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="e.g. 15 Victoria Island Road, Suite 4B"
                    style={{
                      padding: '12px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--bg-border)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-grid-2">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontFamily: 'var(--font-label)', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>
                      CITY *
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="e.g. Ikeja / Lekki"
                      style={{
                        padding: '12px',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--bg-border)',
                        color: 'var(--text-primary)',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontFamily: 'var(--font-label)', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>
                      STATE *
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="e.g. Lagos"
                      style={{
                        padding: '12px',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--bg-border)',
                        color: 'var(--text-primary)',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', padding: '32px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--gold)', marginBottom: '16px' }}>
                2. Secure Payment Gateway
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6, marginBottom: '24px' }}>
                Payments are processed securely via Paystack. Supports Debit/Credit Cards, Bank Transfer, USSD, and Apple Pay.
              </p>

              <button
                type="submit"
                disabled={isProcessing}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '14px',
                  letterSpacing: '0.15em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                }}
              >
                <FiLock size={16} />
                {isProcessing ? 'INITIALIZING PAYSTACK...' : `PAY ${formatPrice(cartTotal)} WITH PAYSTACK`}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px', color: 'var(--text-muted)', fontSize: '12px' }}>
                <FiCheckCircle size={14} style={{ color: 'var(--gold)' }} />
                <span>256-bit Encrypted SSL Payment</span>
              </div>
            </div>
          </form>

          {/* Sidebar Summary */}
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', padding: '32px', position: 'sticky', top: 'calc(var(--nav-height) + 24px)' }}>
            <p className="text-label" style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>ORDER SUMMARY ({cartItems.length} ITEMS)</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '300px', overflowY: 'auto', marginBottom: '24px', paddingRight: '4px' }}>
              {cartItems.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <img src={item.image} alt={item.name} style={{ width: '50px', height: '60px', objectFit: 'cover', background: 'var(--bg-surface)' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Qty: {item.quantity} · {item.size}</p>
                  </div>
                  <span style={{ color: 'var(--gold)', fontSize: '13px', fontFamily: 'var(--font-ui)' }}>
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--bg-border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <span>Shipping</span>
                <span style={{ color: 'var(--gold)', fontSize: '11px', fontFamily: 'var(--font-label)', letterSpacing: '0.05em', textAlign: 'right' }}>
                  Calculated by Customer Service
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 500, color: 'var(--gold)', marginTop: '8px', paddingTop: '12px', borderTop: '1px solid var(--bg-border)' }}>
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '16px', lineHeight: 1.6 }}>
              Shipping is calculated by customer service depending on your location. Our team will contact you after your order. For delivery info,{' '}
              <a
                href="https://wa.me/+2348000000000?text=Hello%20Emrickscents!%20I%20have%20an%20enquiry%20regarding%20shipping%20and%20delivery."
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--gold)', textDecoration: 'underline' }}
              >
                contact customer service via WhatsApp
              </a>.
            </p>

            <div style={{ marginTop: '20px' }}>
              <Link to="/cart" style={{ fontSize: '11px', fontFamily: 'var(--font-label)', letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                ← Return to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer variant="full" />

      <style>{`
        @media (max-width: 1023px) {
          .checkout-layout { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 767px) {
          .checkout-page { padding: 32px 24px !important; }
          .form-grid-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
