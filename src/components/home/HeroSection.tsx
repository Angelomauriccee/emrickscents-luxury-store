import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const HERO_VIDEO_URL =
  'https://res.cloudinary.com/drtmoxle9/video/upload/mixkit-spraying-a-perfume-sample-in-a-store-21980-hd-ready_ofse1v';

export function HeroSection() {
  const microLabelRef = useRef<HTMLParagraphElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

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
        className="hero-right hero-image-container"
      >
        {/* Gradient overlay on left edge */}
        <div
          className="hero-overlay"
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
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            filter: 'brightness(0.85)',
            zIndex: 0,
          }}
        >
          <source src={`${HERO_VIDEO_URL}.webm`} type="video/webm" />
          <source src={`${HERO_VIDEO_URL}.mp4`} type="video/mp4" />
        </video>
      </div>

      <style>{`
        /* Mobile: image becomes full-bleed background, text overlaid */
        @media (max-width: 1023px) {
          section { position: relative !important; flex-direction: column !important; min-height: 100svh !important; }
          .hero-image-container {
            position: absolute !important;
            inset: 0 !important;
            width: 100% !important;
            height: 100% !important;
            z-index: 0 !important;
          }
          .hero-overlay {
            width: 100% !important;
            background: linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.7) 60%, rgba(10,10,10,0.95) 100%) !important;
          }
          .hero-left {
            position: relative !important;
            z-index: 1 !important;
            width: 100% !important;
            padding: 120px 24px 60px !important;
            justify-content: flex-end !important;
            min-height: 100svh !important;
          }
          .hero-ctas { flex-direction: column !important; }
          .hero-ctas a { width: 100% !important; justify-content: center !important; }
        }
        @media (min-width: 1024px) {
          .hero-left { width: 45% !important; }
          .hero-image-container { width: 55% !important; position: relative !important; height: auto !important; }
          .hero-overlay { width: 120px !important; background: linear-gradient(90deg, var(--bg-primary) 0%, transparent 100%) !important; }
        }
      `}</style>
    </section>
  );
}
