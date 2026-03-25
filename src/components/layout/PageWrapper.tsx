import { useRef, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

interface PageWrapperProps {
  children: ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;
    gsap.fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
  }, [location.pathname]);

  return (
    <div ref={pageRef} style={{ minHeight: '100vh' }}>
      {children}
    </div>
  );
}
