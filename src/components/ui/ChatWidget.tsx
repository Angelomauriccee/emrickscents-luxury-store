import { useEffect, useRef, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import gsap from 'gsap';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER as string;
const TAG_TEXT = 'Chat with our fragrance expert';
const TAG_AUTO_SHOW_DELAY_MS = 1000;
const TAG_AUTO_HIDE_AFTER_MS = 3000;

function openWhatsApp() {
  const message = encodeURIComponent(
    "Hello Emrickscents! I'd like to speak with a fragrance expert."
  );
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank', 'noopener,noreferrer');
}

export function ChatWidget() {
  const [tagVisible, setTagVisible] = useState(false);
  const hoveringRef = useRef(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const autoHideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Entrance: button pops in, then the tag auto-shows once and auto-hides
  useEffect(() => {
    if (buttonRef.current) {
      gsap.fromTo(
        buttonRef.current,
        { scale: 0, opacity: 0, rotate: -45 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.6, ease: 'back.out(1.7)', delay: 0.4 }
      );
    }

    const showTimer = setTimeout(() => setTagVisible(true), TAG_AUTO_SHOW_DELAY_MS);
    return () => clearTimeout(showTimer);
  }, []);

  // Continuous pulse ring around the button
  useEffect(() => {
    if (!ringRef.current) return;
    const tween = gsap.to(ringRef.current, {
      scale: 1.6,
      opacity: 0,
      duration: 1.8,
      ease: 'power1.out',
      repeat: -1,
    });
    return () => { tween.kill(); };
  }, []);

  // Tag enter/exit animation + auto-hide (unless hovering)
  useEffect(() => {
    const el = tagRef.current;
    if (!el) return;
    gsap.killTweensOf(el);

    if (tagVisible) {
      gsap.fromTo(
        el,
        { opacity: 0, x: 16, scale: 0.9 },
        { opacity: 1, x: 0, scale: 1, duration: 0.4, ease: 'back.out(1.8)' }
      );
      if (autoHideTimeout.current) clearTimeout(autoHideTimeout.current);
      autoHideTimeout.current = setTimeout(() => {
        if (!hoveringRef.current) setTagVisible(false);
      }, TAG_AUTO_HIDE_AFTER_MS);
    } else {
      gsap.to(el, { opacity: 0, x: 16, scale: 0.9, duration: 0.25, ease: 'power2.in' });
    }

    return () => {
      if (autoHideTimeout.current) clearTimeout(autoHideTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagVisible]);

  const handleMouseEnter = () => {
    hoveringRef.current = true;
    if (autoHideTimeout.current) clearTimeout(autoHideTimeout.current);
    setTagVisible(true);
  };
  const handleMouseLeave = () => {
    hoveringRef.current = false;
    if (autoHideTimeout.current) clearTimeout(autoHideTimeout.current);
    autoHideTimeout.current = setTimeout(() => setTagVisible(false), 400);
  };

  if (!WHATSAPP_NUMBER) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        left: '28px',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '14px',
        pointerEvents: 'none',
      }}
    >
      {/* Tag */}
      <div
        ref={tagRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={openWhatsApp}
        style={{
          opacity: 0,
          cursor: 'pointer',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--gold-border)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
          padding: '12px 18px',
          whiteSpace: 'nowrap',
          maxWidth: 'min(280px, calc(100vw - 130px))',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          pointerEvents: tagVisible ? 'auto' : 'none',
        }}
        className="text-ui"
      >
        <span style={{ color: 'var(--text-primary)' }}>{TAG_TEXT}</span>
      </div>

      {/* Button */}
      <button
        ref={buttonRef}
        onClick={openWhatsApp}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label="Chat with us on WhatsApp"
        className="chat-widget-btn"
        style={{
          position: 'relative',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(145deg, #1c1c1c, #0a0a0a)',
          border: '1px solid var(--gold-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 28px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.08)',
          flexShrink: 0,
          pointerEvents: 'auto',
        }}
      >
        <span
          ref={ringRef}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '1.5px solid var(--gold)',
          }}
        />
        <FaWhatsapp size={28} color="#25D366" />
      </button>

      <style>{`
        .chat-widget-btn {
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .chat-widget-btn:hover {
          transform: scale(1.08);
          border-color: var(--gold);
          box-shadow: 0 12px 36px rgba(0,0,0,0.55), 0 0 0 1px rgba(201,168,76,0.2);
        }
        .chat-widget-btn:active {
          transform: scale(0.96);
        }
        @media (max-width: 480px) {
          .chat-widget-btn { width: 52px !important; height: 52px !important; }
        }
      `}</style>
    </div>
  );
}
