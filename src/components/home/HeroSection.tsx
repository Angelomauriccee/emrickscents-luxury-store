import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

export function HeroSection() {
  const microLabelRef = useRef<HTMLParagraphElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % 5);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tl.from(microLabelRef.current, { y: 12, opacity: 0, duration: 0.5 }, 0.3)
        .from(line1Ref.current, { x: -24, opacity: 0, duration: 0.7 }, 0.5)
        .from(line2Ref.current, { opacity: 0, duration: 0.7 }, 0.8)
        .from(bodyRef.current, { y: 12, opacity: 0, duration: 0.5 }, 1.0)
        .from(ctasRef.current?.children ?? [], { y: 12, opacity: 0, duration: 0.4, stagger: 0.12 }, 1.2)
        .from(imageRef.current, { scale: 1.05, duration: 1.4, ease: 'power1.out', opacity: 0 }, 0.2);
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'stretch',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Left column */}
      <div
        style={{
          width: '45%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '120px 80px',
          gap: '32px',
          position: 'relative',
          zIndex: 1,
        }}
        className="hero-left"
      >
        <p ref={microLabelRef} className="text-label" style={{ color: 'var(--gold-muted)' }}>
          LUXURY FRAGRANCES · EST. 2025
        </p>
        <div style={{ overflow: 'hidden' }}>
          <h1>
            <span
              ref={line1Ref}
              style={{
                display: 'block',
                fontFamily: 'var(--font-display)',
                fontWeight: 300,
                fontSize: 'clamp(56px, 7vw, 96px)',
                lineHeight: 0.95,
                color: 'var(--text-primary)',
              }}
            >
              The Art of
            </span>
            <span
              ref={line2Ref}
              style={{
                display: 'block',
                fontFamily: 'var(--font-display)',
                fontWeight: 300,
                fontStyle: 'italic',
                fontSize: 'clamp(64px, 8vw, 108px)',
                lineHeight: 0.95,
                color: 'var(--text-primary)',
              }}
            >
              Scent
            </span>
          </h1>
        </div>
        <p
          ref={bodyRef}
          className="text-body"
          style={{ color: 'var(--text-secondary)', maxWidth: '380px' }}
        >
          A curated library of the world's finest fragrances, sourced thoughtfully and presented for the discerning nose. Discover your signature.
        </p>
        <div ref={ctasRef} className="hero-ctas" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Link to="/shop" className="btn-primary">
            EXPLORE COLLECTIONS
          </Link>
          <Link to="/build-your-box" className="btn-secondary">
            BUILD YOUR BOX
          </Link>
        </div>
      </div>

      {/* Right column — image */}
      <div
        ref={imageRef}
        style={{
          width: '55%',
          position: 'relative',
          overflow: 'hidden',
          background: 'var(--bg-surface)',
        }}
        className="hero-right"
      >
        {/* Gradient overlay on left edge */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '120px',
            background: 'linear-gradient(90deg, var(--bg-primary) 0%, transparent 100%)',
            zIndex: 1,
          }}
        />
        {['/images/hero-perfume.png', '/images/hero-perfume-2.png', '/images/hero-perfume-3.png', '/images/hero-perfume-4.png', '/images/hero-perfume-5.png'].map((src, index) => (
          <img
            key={src}
            src={src}
            alt={`Luxury perfume variation ${index + 1}`}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              filter: 'brightness(0.9)',
              opacity: index === currentImageIndex ? 1 : 0,
              transition: 'opacity 1.2s ease-in-out',
              zIndex: 0,
            }}
          />
        ))}
      </div>

      <style>{`
        @media (max-width: 767px) {
          section { flex-direction: column-reverse !important; min-height: auto !important; }
          .hero-left { width: 100% !important; padding: 40px 24px 60px !important; order: 2; }
          .hero-right { width: 100% !important; min-height: 60vw !important; height: 60vw !important; order: 1; }
          .hero-left .gradient-edge { display: none !important; }
          .hero-ctas { flex-direction: column !important; }
          .hero-ctas a { width: 100% !important; justify-content: center !important; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .hero-left { width: 50% !important; padding: 80px 40px !important; }
          .hero-right { width: 50% !important; }
        }
      `}</style>
    </section>
  );
}
