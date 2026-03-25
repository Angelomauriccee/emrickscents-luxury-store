import { useState, useRef } from 'react';
import { FiChevronDown, FiPlus, FiMinus } from 'react-icons/fi';
import Map from 'react-map-gl/mapbox';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '../hooks/useGSAP';
import { BeaconMarker } from '../components/ui/BeaconMarker';
import { Footer } from '../components/layout/Footer';

gsap.registerPlugin(ScrollTrigger);

const LONGITUDE = 3.3843;
const LATITUDE = 6.5793;

const FAQS = [
  { q: "What do I do if an item is damaged?", a: "If your order arrives damaged (e.g., broken bottle or faulty spray), please contact us immediately within 24 hours with clear photos/videos. We'll review your request and assist you. For full details, kindly check our Return & Store Credit Policy." },
  { q: "Can my package be delivered to an office address?", a: "Yes! Your package can be delivered to any address that suits you. Simply enter your preferred delivery address (home, office, etc.) when placing your order." },
  { q: "If I return an item, will I receive my refund or exchange?", a: "We do not offer refunds, but eligible returns may receive store credit, valid for 14 working days. Please review our Return & Store Credit Policy for conditions and step-by-step instructions." },
  { q: "Are all products on EmrickScents original and genuine?", a: "Absolutely! We only offer 100% genuine and original perfumes, sourced directly from trusted brands and suppliers." },
  { q: "Can I sample your fragrances before purchasing a full bottle?", a: "Yes! We offer a discovery set that includes samples of our most popular fragrances — a perfect way to explore and find your signature scent before committing to a full-size bottle." },
  { q: "Are your products cruelty-free?", a: "Yes, all Emrickscents products are cruelty-free. We do not test on animals, nor do we work with suppliers who test on animals. We are committed to ethical and sustainable practices." },
];

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [messageLength, setMessageLength] = useState(0);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState('');

  const accordionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    setIsSubmitting(true);

    // Trigger mailto link
    const mailtoLink = `mailto:info@emrickscents.com?subject=${encodeURIComponent(`Emrickscents Contact: ${subject} - ${name}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    window.location.href = mailtoLink;

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      // Reset form
      setName('');
      setEmail('');
      setSubject('General Inquiry');
      setMessage('');
      setMessageLength(0);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  const toggleFaq = (index: number) => {
    // If clicking already open, close it
    if (openFaq === index) {
      gsap.to(accordionRefs.current[index], { height: 0, duration: 0.3, ease: 'power2.in' });
      setOpenFaq(null);
    } else {
      // Close previous
      if (openFaq !== null) {
        gsap.to(accordionRefs.current[openFaq], { height: 0, duration: 0.3, ease: 'power2.in' });
      }
      // Open new
      setOpenFaq(index);
      gsap.to(accordionRefs.current[index], { height: 'auto', duration: 0.35, ease: 'power2.out' });
    }
  };

  return (
    <>
      <div>
        {/* SECTION 1 — PAGE HEADER */}
        <div style={{
          minHeight: '240px', background: 'var(--bg-elevated)', borderBottom: '1px solid var(--gold-line)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '0 80px',
        }}>
          <p className="text-label" style={{ color: 'var(--gold-muted)' }}>GET IN TOUCH</p>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 300, fontStyle: 'normal',
            fontSize: 'clamp(52px, 6vw, 72px)', color: 'var(--text-primary)', lineHeight: 1.0, margin: '12px 0',
          }}>
            Contact Us
          </h1>
          <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 400, fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            We'd love to hear from you.
          </p>
        </div>

        {/* SECTION 2 — CONTACT FORM + INFO */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 0', display: 'flex' }}>
          {/* LEFT COLUMN — CONTACT FORM */}
          <div style={{ width: '58%', paddingRight: '60px' }}>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <p className="text-label" style={{ color: 'var(--gold-muted)', fontSize: '10px', marginBottom: '8px' }}>FULL NAME</p>
                  <input required value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="ALEXANDER EMRICK" style={{ width: '100%', height: '48px', background: 'transparent', border: 'none', borderBottom: '1px solid var(--bg-border)', borderRadius: 0, color: 'var(--text-primary)', fontFamily: 'var(--font-ui)', fontSize: '14px', outline: 'none' }} onFocus={(e) => e.target.style.borderBottomColor = 'var(--gold)'} onBlur={(e) => e.target.style.borderBottomColor = 'var(--bg-border)'} />
                </div>
                <div>
                  <p className="text-label" style={{ color: 'var(--gold-muted)', fontSize: '10px', marginBottom: '8px' }}>EMAIL ADDRESS</p>
                  <input required value={email} onChange={(e) => { setEmail(e.target.value); setEmailError(''); }} type="email" placeholder="HELLO@EMRICKSCENTS.COM" style={{ width: '100%', height: '48px', background: 'transparent', border: 'none', borderBottom: emailError ? '1px solid var(--error-red, #ff5e5e)' : '1px solid var(--bg-border)', borderRadius: 0, color: 'var(--text-primary)', fontFamily: 'var(--font-ui)', fontSize: '14px', outline: 'none' }} onFocus={(e) => !emailError && (e.target.style.borderBottomColor = 'var(--gold)')} onBlur={(e) => !emailError && (e.target.style.borderBottomColor = 'var(--bg-border)')} />
                  {emailError && <p style={{ color: '#ff5e5e', fontSize: '12px', marginTop: '4px', fontFamily: 'var(--font-ui)' }}>{emailError}</p>}
                </div>
              </div>
              <div style={{ position: 'relative' }}>
                <p className="text-label" style={{ color: 'var(--gold-muted)', fontSize: '10px', marginBottom: '8px' }}>SUBJECT</p>
                <select required value={subject} onChange={(e) => setSubject(e.target.value)} style={{ width: '100%', height: '48px', background: 'transparent', border: 'none', borderBottom: '1px solid var(--bg-border)', borderRadius: 0, color: 'var(--text-primary)', fontFamily: 'var(--font-ui)', fontSize: '14px', outline: 'none', appearance: 'none', cursor: 'pointer' }} onFocus={(e) => e.target.style.borderBottomColor = 'var(--gold)'} onBlur={(e) => e.target.style.borderBottomColor = 'var(--bg-border)'}>
                  <option value="General Inquiry" style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>General Inquiry</option>
                  <option value="Order Support" style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>Order Support</option>
                </select>
                <FiChevronDown color="var(--gold)" style={{ position: 'absolute', right: '0', bottom: '16px', pointerEvents: 'none' }} />
              </div>
              <div>
                <p className="text-label" style={{ color: 'var(--gold-muted)', fontSize: '10px', marginBottom: '8px' }}>MESSAGE</p>
                <textarea required value={message} maxLength={300} placeholder="Write your message here..." onChange={(e) => { setMessage(e.target.value); setMessageLength(e.target.value.length); }} style={{ width: '100%', height: '140px', background: 'transparent', border: 'none', borderBottom: '1px solid var(--bg-border)', borderRadius: 0, color: 'var(--text-primary)', fontFamily: 'var(--font-ui)', fontSize: '14px', outline: 'none', resize: 'none' }} onFocus={(e) => e.target.style.borderBottomColor = 'var(--gold)'} onBlur={(e) => e.target.style.borderBottomColor = 'var(--bg-border)'} />
                <p style={{ textAlign: 'right', fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                  {messageLength} / 300
                </p>
              </div>

              <button type="submit" disabled={isSubmitting || success} style={{ width: '100%', height: '52px', background: 'var(--gold)', color: 'var(--bg-primary)', fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', border: 'none', borderRadius: 0, marginTop: '24px', cursor: (isSubmitting || success) ? 'default' : 'pointer', transition: 'background 0.25s' }} onMouseEnter={(e) => !success && (e.currentTarget.style.background = 'var(--gold-light)')} onMouseLeave={(e) => !success && (e.currentTarget.style.background = 'var(--gold)')}>
                {isSubmitting ? 'SENDING...' : success ? 'MESSAGE SENT ✓' : 'SEND MESSAGE'}
              </button>
              
              <div style={{ marginTop: '16px', fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-muted)' }}>
                Prefer WhatsApp? <a href="https://wa.me/+2349065988598" style={{ color: 'var(--gold)', fontWeight: 500, textDecoration: 'none' }}>Chat with us directly →</a>
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN — STICKY CONTACT INFO */}
          <div style={{ width: '42%' }}>
            <div style={{ position: 'sticky', top: '96px', padding: '0 36px' }}>
              
              {/* Block 1 */}
              <div style={{ marginBottom: '32px' }}>
                <p className="text-label" style={{ color: 'var(--gold-muted)', fontSize: '10px', marginBottom: '8px' }}>VISIT US</p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: '22px', color: 'var(--text-primary)', marginBottom: '8px' }}>Ogudu Mall, Lagos</h3>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Suite 42, Level 1, Ogudu Mall<br />Ogudu Rd, Lagos, Nigeria
                </p>
              </div>

              {/* Block 2 */}
              <div style={{ marginBottom: '32px' }}>
                <p className="text-label" style={{ color: 'var(--gold-muted)', fontSize: '10px', marginBottom: '16px' }}>OPENING HOURS</p>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex' }}><span style={{ width: '100px' }}>Mon – Sat</span><span>10:00 – 20:00</span></div>
                  <div style={{ display: 'flex' }}><span style={{ width: '100px' }}>Sunday</span><span>12:00 – 18:00</span></div>
                </div>
              </div>

              {/* Block 3 */}
              <div style={{ marginBottom: '32px' }}>
                <p className="text-label" style={{ color: 'var(--gold-muted)', fontSize: '10px', marginBottom: '8px' }}>CALL OR WHATSAPP</p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-primary)' }}>+2349065988598</p>
              </div>

              {/* Block 4 */}
              <div>
                <p className="text-label" style={{ color: 'var(--gold-muted)', fontSize: '10px', marginBottom: '8px' }}>EMAIL</p>
                <a href="mailto:info@emrickscents.com" style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--gold)', textDecoration: 'none' }}>info@emrickscents.com</a>
              </div>
              
              {/* Socials */}
              <div style={{ marginTop: '20px' }}>
                <p className="text-label" style={{ color: 'var(--text-muted)', fontSize: '10px', display: 'flex', gap: '8px' }}>
                  <a href="https://www.instagram.com/emrickscents?igsh=N2p6cjk3Y296c3Vl" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>INSTAGRAM</a> ·
                  <a href="https://www.facebook.com/share/17v65JUbkn/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>FACEBOOK</a> ·
                  <a href="https://wa.me/+2349065988598" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>WHATSAPP</a>
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* SECTION 3 — FAQ ACCORDION */}
        <div style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--gold-line)', padding: '100px 0' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto 60px', textAlign: 'center' }}>
            <p className="text-label" style={{ color: 'var(--gold-muted)', fontSize: '11px', marginBottom: '16px' }}>LEARN MORE</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: '64px', color: 'var(--text-primary)', lineHeight: 1 }}>Frequently Asked</h2>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} style={{ borderTop: '1px solid var(--bg-border)' }}>
                  <div
                    onClick={() => toggleFaq(index)}
                    style={{ padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                    onMouseEnter={(e) => (e.currentTarget.querySelector('p') as HTMLElement).style.color = 'var(--gold)'}
                    onMouseLeave={(e) => (e.currentTarget.querySelector('p') as HTMLElement).style.color = isOpen ? 'var(--gold)' : 'var(--text-primary)'}
                  >
                    <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: '16px', color: isOpen ? 'var(--gold)' : 'var(--text-primary)', transition: 'color 0.2s' }}>
                      {faq.q}
                    </p>
                    {isOpen ? <FiMinus color="var(--gold)" size={18} /> : <FiPlus color="var(--gold)" size={18} />}
                  </div>
                  <div className="faq-answer-container" ref={(el) => { accordionRefs.current[index] = el; }} style={{ height: 0, overflow: 'hidden' }}>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8, paddingBottom: '20px' }}>
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 4 — MAP */}
        <div style={{ width: '100%', height: '400px', position: 'relative' }}>
          <Map
            mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
            initialViewState={{ longitude: LONGITUDE, latitude: LATITUDE, zoom: 15 }}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/dark-v11"
            scrollZoom={false}
            dragPan={true}
            doubleClickZoom={false}
            touchZoomRotate={false}
            attributionControl={false}
            logoPosition="bottom-right"
          >
            <BeaconMarker longitude={LONGITUDE} latitude={LATITUDE} />
          </Map>
          
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '160px', background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', pointerEvents: 'none' }} />
          
          <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', pointerEvents: 'auto' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: '36px', color: 'var(--text-primary)', marginBottom: '8px', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>Our Lagos Boutique</h3>
            <a href={`https://www.google.com/maps/dir/?api=1&destination=${LATITUDE},${LONGITUDE}`} target="_blank" rel="noopener noreferrer" className="text-label" style={{ color: 'var(--gold)', fontSize: '10px', textDecoration: 'none', padding: '8px' }}>
              GET DIRECTIONS
            </a>
          </div>
        </div>

        <Footer variant="full" />
      </div>
    </>
  );
}
