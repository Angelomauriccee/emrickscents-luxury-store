import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function PhilosophySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.philosophy-content > *', {
        y: 30, opacity: 0, duration: 0.7, ease: 'power2.out', stagger: 0.1,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ display: 'flex', minHeight: '600px' }} className="philosophy-layout">
        {/* Left image */}
        <div style={{ width: '50%', background: 'var(--bg-surface)', overflow: 'hidden', position: 'relative' }} className="philosophy-img">
          <img
            src="https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80"
            alt="Philosophy"
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(30%) brightness(0.7)' }}
          />
        </div>

        {/* Right text */}
        <div
          style={{
            width: '50%',
            background: 'var(--bg-elevated)',
            display: 'flex',
            alignItems: 'center',
            padding: '80px',
          }}
          className="philosophy-text"
        >
          <div className="philosophy-content">
            <p className="text-label" style={{ color: 'var(--gold-muted)', marginBottom: '24px' }}>OUR PHILOSOPHY</p>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 300,
                fontSize: 'clamp(32px, 3.5vw, 52px)',
                lineHeight: 1.15,
                color: 'var(--text-primary)',
                marginBottom: '28px',
              }}
            >
              Elegance is an{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Invisible</em>{' '}
              Aura.
            </h2>
            <p className="text-body" style={{ color: 'var(--text-secondary)', maxWidth: '420px', marginBottom: '32px' }}>
              Perfumery, like architecture, is the art of creating space and memory. Each fragrance in our collection is a structure — built from accords, shaped by intention, and inhabited by the wearer.
            </p>
            <Link to="/about" style={{ fontFamily: 'var(--font-label)', fontSize: '11px', letterSpacing: '0.15em', color: 'var(--gold)', textTransform: 'uppercase', borderBottom: '1px solid var(--gold-border)', paddingBottom: '4px' }}>
              LEARN OUR STORY →
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .philosophy-layout { flex-direction: column !important; }
          .philosophy-img, .philosophy-text { width: 100% !important; }
          .philosophy-img { height: 300px; }
          .philosophy-text { padding: 48px 24px !important; }
        }
      `}</style>
    </section>
  );
}
