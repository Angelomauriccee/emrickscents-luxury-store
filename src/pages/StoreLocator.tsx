import { useRef } from 'react';
import { FiMapPin, FiClock, FiPhone } from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';
import Map from 'react-map-gl/mapbox';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '../hooks/useGSAP';
import { BeaconMarker } from '../components/ui/BeaconMarker';
import { Footer } from '../components/layout/Footer';

gsap.registerPlugin(ScrollTrigger);

const LONGITUDE = 3.3843;
const LATITUDE = 6.5793;

export default function StoreLocator() {
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Header Animation
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power2.out' }
      );
    }

    // Neighbourhood Cards Animation
    if (cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );
    }
  }, []);

  return (
    <>
      <div>
        {/* SECTION 1 — PAGE HEADER */}
        <div
          ref={headerRef}
          style={{
            minHeight: '240px', background: 'var(--bg-elevated)', borderBottom: '1px solid var(--gold-line)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', padding: '0 80px',
          }}
        >
          <p className="text-label" style={{ color: 'var(--gold-muted)' }}>
            EXPERIENCE IN PERSON
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 300, fontStyle: 'normal',
            fontSize: 'clamp(52px, 6vw, 72px)', color: 'var(--text-primary)', lineHeight: 1.0, margin: '12px 0',
          }}>
            Find Us
          </h1>
          <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 400, fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            One location. Ogudu Mall, Lagos.
          </p>
        </div>

        {/* SECTION 2 — MAIN TWO-COLUMN LAYOUT */}
        <div style={{ display: 'flex', height: '620px', width: '100%' }}>
          {/* LEFT COLUMN */}
          <div
            style={{
              width: '38%',
              background: 'var(--bg-elevated)',
              padding: '48px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ width: '60px', height: '1px', background: 'var(--gold)', marginBottom: '28px' }} />
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', color: 'var(--text-primary)', lineHeight: 1.1 }}>
                Lagos Flagship
              </h2>
              <p className="text-label" style={{ color: 'var(--gold-muted)', fontSize: '10px', marginTop: '8px', marginBottom: '40px' }}>
                OUR ONLY LOCATION
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: '32px', columnGap: '24px' }}>
                {/* Cell 1: ADDRESS */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span className="text-label" style={{ color: 'var(--gold-muted)', fontSize: '9px' }}>ADDRESS</span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                    Ogudu Mall, 178 Ogudu Road,<br />
                    Ogudu, Lagos, Nigeria
                  </p>
                </div>

                {/* Cell 2: OPENING HOURS */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span className="text-label" style={{ color: 'var(--gold-muted)', fontSize: '9px' }}>OPENING HOURS</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.6, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ paddingRight: '12px' }}>Mon – Sat</span>
                      <span>10:00 – 20:00</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ paddingRight: '12px' }}>Sunday</span>
                      <span>12:00 – 18:00</span>
                    </div>
                  </div>
                </div>

                {/* Cell 3: WHATSAPP */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span className="text-label" style={{ color: 'var(--gold-muted)', fontSize: '9px' }}>WHATSAPP</span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-primary)' }}>
                    +234 906 598 8598
                  </p>
                </div>

                {/* Cell 4: CALL US */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span className="text-label" style={{ color: 'var(--gold-muted)', fontSize: '9px' }}>CALL US</span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-primary)' }}>
                    +234 906 598 8598
                  </p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${LATITUDE},${LONGITUDE}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', 
                  background: 'linear-gradient(135deg, #e6c364 0%, #c9a84c 100%)', color: '#3d2e00',
                  padding: '20px 32px', fontFamily: 'Jost, var(--font-ui)', fontSize: '11px', 
                  fontWeight: 500, letterSpacing: '0.25em', textTransform: 'uppercase', textDecoration: 'none',
                  transition: 'transform 0.15s ease-out'
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                GET DIRECTIONS
              </a>
              <a
                href="https://wa.me/+2349065988598"
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', 
                  border: '1px solid var(--gold)', color: 'var(--gold)', background: 'transparent',
                  padding: '20px 32px', fontFamily: 'Jost, var(--font-ui)', fontSize: '11px', 
                  fontWeight: 500, letterSpacing: '0.25em', textTransform: 'uppercase', textDecoration: 'none',
                  transition: 'all 0.2s ease-out'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(230,195,100,0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                CHAT ON WHATSAPP
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN — MAP */}
          <div style={{ width: '62%', height: '100%' }}>
            <Map
              mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
              initialViewState={{
                longitude: LONGITUDE,
                latitude: LATITUDE,
                zoom: 15
              }}
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
          </div>
        </div>

        {/* SECTION 3 — NEIGHBOURHOOD GUIDE */}
        <div style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--gold-line)', padding: '100px 60px' }}>
          <div style={{ display: 'flex', width: '100%' }}>
            {/* Left Col */}
            <div style={{ width: '40%', paddingRight: '60px' }}>
              <p className="text-label" style={{ color: 'var(--gold-muted)' }}>
                THE NEIGHBOURHOOD
              </p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '52px', color: 'var(--text-primary)', marginTop: '16px', marginBottom: '24px', lineHeight: 1.1 }}>
                Ojota & Ogudu
              </h2>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                Located at the heart of Lagos' vibrant mainland, our flagship boutique at Ogudu Mall offers a sanctuary of scent amidst the city's kinetic energy. The neighborhood bridges the heritage of Ojota with the modern luxury of Ogudu's residential enclaves.
              </p>
            </div>

            {/* Right Col */}
            <div ref={cardsRef} style={{ width: '60%', display: 'flex', gap: '24px' }}>
              {/* Card 1 */}
              <div
                style={{
                  flex: 1,
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--bg-border)',
                  borderRadius: '2px',
                  padding: '28px',
                  transition: 'border-color 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--gold-border)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--bg-border)')}
              >
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--gold)', marginBottom: '16px' }}>P</div>
                <p className="text-label" style={{ color: 'var(--gold-muted)', fontSize: '10px', marginBottom: '12px' }}>
                  PARKING
                </p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Secure multi-level parking available directly within Ogudu Mall. Complimentary for customers.
                </p>
              </div>

              {/* Card 2 */}
              <div
                style={{
                  flex: 1,
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--bg-border)',
                  borderRadius: '2px',
                  padding: '28px',
                  transition: 'border-color 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--gold-border)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--bg-border)')}
              >
                <div style={{ marginBottom: '16px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                  </svg>
                </div>
                <p className="text-label" style={{ color: 'var(--gold-muted)', fontSize: '10px', marginBottom: '12px' }}>
                  PUBLIC TRANSPORT
                </p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Conveniently accessible via major transport hubs at Ojota, just 5 minutes from our boutique entrance.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Footer variant="full" />
      </div>
    </>
  );
}
