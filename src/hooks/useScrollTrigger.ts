import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollTriggerOptions {
  start?: string;
  once?: boolean;
  stagger?: number;
  y?: number;
  duration?: number;
}

export function useScrollTrigger(
  selector: string,
  containerRef: React.RefObject<HTMLElement | null>,
  options: ScrollTriggerOptions = {}
) {
  const {
    start = 'top 85%',
    once = true,
    stagger = 0.07,
    y = 30,
    duration = 0.6,
  } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const elements = container.querySelectorAll(selector);
      if (!elements.length) return;

      gsap.from(elements, {
        y,
        opacity: 0,
        duration,
        ease: 'power2.out',
        stagger,
        scrollTrigger: {
          trigger: container,
          start,
          once,
        },
      });
    }, container);

    return () => ctx.revert();
  }, [selector, containerRef, start, once, stagger, y, duration]);
}
