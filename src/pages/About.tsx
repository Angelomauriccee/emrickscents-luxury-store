import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '../hooks/useGSAP';
import { Footer } from '../components/layout/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const heroLabelRef = useRef<HTMLParagraphElement>(null);
  const heroHead1Ref = useRef<HTMLHeadingElement>(null);
  const heroHead2Ref = useRef<HTMLSpanElement>(null);
  
  const storyRightRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // SECTION 1 — HERO
    if (heroLabelRef.current) {
      gsap.fromTo(heroLabelRef.current, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.3, ease: 'power2.out' });
    }
    if (heroHead1Ref.current) {
      gsap.fromTo(heroHead1Ref.current, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, delay: 0.5, ease: 'power2.out' });
    }
    if (heroHead2Ref.current) {
      gsap.fromTo(heroHead2Ref.current, { opacity: 0 }, { opacity: 1, duration: 0.8, delay: 0.8, ease: 'power2.out' });
    }

    // SECTION 2 — FOUNDING STORY
    if (storyRightRef.current) {
      gsap.fromTo(storyRightRef.current, { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: storyRightRef.current, start: 'top 80%', once: true } });
    }

    // SECTION 3 — THREE PILLARS
    if (pillarsRef.current) {
      gsap.fromTo(pillarsRef.current.children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: pillarsRef.current, start: 'top 80%', once: true } });
    }

    // SECTION 4 — PHILOSOPHY QUOTE
    if (quoteRef.current) {
      gsap.fromTo(quoteRef.current, { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: quoteRef.current, start: 'top 75%', once: true } });
    }
  }, []);

  return (
    <>
      {/* SECTION 1 — HERO */}
      <div style={{ position: 'relative', width: '100%', height: '60vh', background: 'var(--bg-elevated)', backgroundImage: 'url(/images/about_hero.png)', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1 }} />
        
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <p ref={heroLabelRef} className="text-label" style={{ color: 'var(--gold-muted)', marginBottom: '16px' }}>OUR STORY</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '80px', color: 'var(--text-primary)', lineHeight: 1.1 }}>
            <span ref={heroHead1Ref} style={{ display: 'block' }}>Crafted in Lagos.</span>
            <span ref={heroHead2Ref} style={{ display: 'block', fontStyle: 'italic' }}>Worn Everywhere.</span>
          </h1>
        </div>
      </div>

      {/* SECTION 2 — FOUNDING STORY */}
      <div style={{ display: 'flex', width: '100%' }}>
        <div style={{ width: '50%', background: 'var(--bg-surface)', backgroundImage: 'url(/images/about_story.png)', backgroundSize: 'cover', backgroundPosition: 'center', aspectRatio: '3/4' }} />
        
        <div ref={storyRightRef} style={{ width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '60px', paddingRight: '60px' }}>
          <p className="text-label" style={{ color: 'var(--gold-muted)', marginBottom: '16px' }}>THE BEGINNING</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '52px', color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '24px' }}>
            About EmRick Scents
          </h2>
          <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 400, fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '16px' }}>
            EmRick Scents is a luxury fragrance boutique devoted to presenting the finest selection of designer and niche perfumes, complemented by premium diffusers, scented candles, body sprays, and humidifiers.
          </p>
          <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 400, fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '16px' }}>
            We offer only high-quality, authentic scents, from rare niche masterpieces to timeless designer classics, ensuring every client experiences true sophistication at both premium and accessible price points.
          </p>
          <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 400, fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '16px' }}>
            Guided by a passion for the art of fragrance, we provide personalized consultations to help you discover a scent that reflects your mood, personality, and presence.
          </p>
          <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 400, fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '24px' }}>
            At EmRick Scents, we don't just sell perfumes, we craft identity, inspire confidence, and create lasting impressions.
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontStyle: 'italic', fontSize: '22px', color: 'var(--gold)' }}>
            Redefine your aura.
          </p>
        </div>
      </div>

      {/* SECTION 3 — THREE PILLARS */}
      <div style={{ width: '100%', background: 'var(--bg-elevated)', borderTop: '1px solid var(--gold-line)', borderBottom: '1px solid var(--gold-line)', padding: '80px 0' }}>
        <div ref={pillarsRef} style={{ display: 'flex', width: '100%' }}>
          {/* Column 1 */}
          <div style={{ flex: 1, padding: '40px', textAlign: 'center', borderRight: '1px solid var(--gold-line)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '64px', color: 'var(--gold)', marginBottom: '16px' }}>I</h3>
            <p className="text-label" style={{ color: 'var(--gold-muted)', fontSize: '11px', marginBottom: '16px' }}>CURATION</p>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: '28px', color: 'var(--text-primary)', marginBottom: '16px' }}>Only the finest houses.</p>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Every fragrance is hand-selected from the world's most respected perfume houses.</p>
          </div>

          {/* Column 2 */}
          <div style={{ flex: 1, padding: '40px', textAlign: 'center', borderRight: '1px solid var(--gold-line)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '64px', color: 'var(--gold)', marginBottom: '16px' }}>II</h3>
            <p className="text-label" style={{ color: 'var(--gold-muted)', fontSize: '11px', marginBottom: '16px' }}>EXPERIENCE</p>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: '28px', color: 'var(--text-primary)', marginBottom: '16px' }}>Scent as ritual.</p>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Every interaction is designed to feel like a private atelier visit.</p>
          </div>

          {/* Column 3 */}
          <div style={{ flex: 1, padding: '40px', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '64px', color: 'var(--gold)', marginBottom: '16px' }}>III</h3>
            <p className="text-label" style={{ color: 'var(--gold-muted)', fontSize: '11px', marginBottom: '16px' }}>DELIVERY</p>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: '28px', color: 'var(--text-primary)', marginBottom: '16px' }}>Lagos and beyond.</p>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Curated fragrances delivered to your door across Nigeria.</p>
          </div>
        </div>
      </div>

      {/* SECTION 4 — PHILOSOPHY QUOTE */}
      <div style={{ position: 'relative', width: '100%', height: '50vh', background: 'var(--bg-surface)', backgroundImage: 'url(/images/about_quote_bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 1 }} />
        
        <div ref={quoteRef} style={{ position: 'relative', zIndex: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '700px', padding: '0 24px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '80px', color: 'var(--gold)', opacity: 0.4, lineHeight: 0.5, display: 'block', marginBottom: '24px' }}>"</span>
          <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: '52px', color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '40px' }}>
            Elegance is not about being noticed — it's about being remembered.
          </p>
          <div style={{ width: '80px', height: '1px', background: 'var(--gold)', marginBottom: '24px' }} />
          <p className="text-label" style={{ color: 'var(--gold-muted)', fontSize: '10px' }}>— EMRICKSCENTS</p>
        </div>
      </div>

      {/* SECTION 5 — STORE LOCATOR TEASER */}
      <div style={{ display: 'flex', width: '100%' }}>
        <div style={{ width: '55%', background: 'var(--bg-elevated)', padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p className="text-label" style={{ color: 'var(--gold-muted)', marginBottom: '16px' }}>EXPERIENCE IN PERSON</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '48px', color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '24px' }}>
            Flagship Boutique
          </h2>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '8px' }}>
            Experience the full collection at Ogudu Mall. Let our curators guide you through a sensory journey tailored to your unique identity.
          </p>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-primary)', marginBottom: '32px' }}>
            Suite 14, Ogudu Mall, Lagos
          </p>
          
          <Link 
            to="/store-locator" 
            style={{ 
              fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: '13px', 
              color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em', 
              textDecoration: 'none', position: 'relative', display: 'inline-block', width: 'fit-content' 
            }}
            className="teaser-link"
          >
            BOOK A CONSULTATION →
            <div className="teaser-line" style={{ position: 'absolute', bottom: '-4px', left: 0, width: 0, height: '1px', background: 'var(--gold)', transition: 'width 0.3s' }} />
          </Link>
          <style>{`.teaser-link:hover .teaser-line { width: 100% !important; }`}</style>
        </div>
        
        <div style={{ width: '45%', background: 'var(--bg-surface)', backgroundImage: 'url(/images/about_boutique.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      </div>

      <Footer variant="full" />
    </>
  );
}
