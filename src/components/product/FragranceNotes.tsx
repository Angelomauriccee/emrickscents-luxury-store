import { useState, useRef } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { ProductDetails } from '../../types';
import gsap from 'gsap';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    const el = contentRef.current;
    const next = !isOpen;
    setIsOpen(next);
    if (!el) return;
    if (next) {
      gsap.set(el, { height: 'auto' });
      const h = el.offsetHeight;
      gsap.from(el, { height: 0, duration: 0.35, ease: 'power2.out' });
      gsap.set(el, { height: h });
    } else {
      const h = el.offsetHeight;
      gsap.fromTo(el, { height: h }, { height: 0, duration: 0.3, ease: 'power2.in' });
    }
  };

  return (
    <div style={{ borderBottom: '1px solid var(--bg-border)' }}>
      <button
        onClick={toggle}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          padding: '18px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          transition: 'color 0.2s',
        }}
      >
        <span className="text-label" style={{ color: 'inherit' }}>{title}</span>
        {isOpen ? <FiMinus size={14} style={{ color: 'var(--gold)' }} /> : <FiPlus size={14} style={{ color: 'var(--text-muted)' }} />}
      </button>
      <div ref={contentRef} style={{ height: 0, overflow: 'hidden' }}>
        <div style={{ paddingBottom: '20px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

interface FragranceNotesProps {
  details: ProductDetails;
  description: string;
  ingredients?: string;
}

export function FragranceNotes({ details, description, ingredients }: FragranceNotesProps) {
  const noteStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '4px 12px',
    border: '1px solid var(--bg-border)',
    color: 'var(--text-secondary)',
    fontSize: '12px',
    fontFamily: 'var(--font-label)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginRight: '6px',
    marginBottom: '8px',
    borderRadius: '1px',
  };

  return (
    <div style={{ marginTop: '8px' }}>
      <AccordionItem title="FRAGRANCE NOTES" defaultOpen={true}>
        {details.topNotes?.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '11px', fontFamily: 'var(--font-label)', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '8px' }}>
              TOP:
            </p>
            {details.topNotes.map((note) => (
              <span key={note} style={noteStyle}>{note}</span>
            ))}
          </div>
        )}
        {details.heartNotes?.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '11px', fontFamily: 'var(--font-label)', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '8px' }}>
              HEART:
            </p>
            {details.heartNotes.map((note) => (
              <span key={note} style={noteStyle}>{note}</span>
            ))}
          </div>
        )}
        {details.baseNotes?.length > 0 && (
          <div>
            <p style={{ fontSize: '11px', fontFamily: 'var(--font-label)', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '8px' }}>
              BASE:
            </p>
            {details.baseNotes.map((note) => (
              <span key={note} style={noteStyle}>{note}</span>
            ))}
          </div>
        )}
      </AccordionItem>

      <AccordionItem title="COMPOSITION & INGREDIENTS">
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.8 }}>
          {ingredients || description || 'Alcohol Denat., Fragrance (Parfum), Water (Aqua), Linalool, Coumarin, Citronellol, Geraniol.'}
        </p>
      </AccordionItem>

      <AccordionItem title="SHIPPING & RETURNS">
        <div style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.8 }}>
          <p style={{ marginBottom: '12px' }}>Complimentary shipping on all orders within Lagos. Nationwide delivery in 3–5 business days.</p>
          <p>Returns accepted within 7 days of delivery for unopened items. Contact us via WhatsApp to initiate a return.</p>
        </div>
      </AccordionItem>
    </div>
  );
}
