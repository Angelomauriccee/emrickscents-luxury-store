import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type GSAPCallback = () => void;

export function useGSAP(callback: GSAPCallback, deps: React.DependencyList = []) {
  const ctx = useRef<gsap.Context | null>(null);
  useEffect(() => {
    ctx.current = gsap.context(callback);
    return () => {
      ctx.current?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
