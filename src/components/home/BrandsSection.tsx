import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BRANDS } from "../../utils/constants";

gsap.registerPlugin(ScrollTrigger);

export function BrandsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".brand-item", {
        opacity: 0,
        y: 10,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.05,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 95%",
          once: true,
        },
      });
    }, sectionRef);

    // Fallback — if ScrollTrigger doesn't fire, show after 1s
    const fallbackTimer = setTimeout(() => {
      gsap.utils.toArray<HTMLElement>(".brand-item").forEach((el) => {
        gsap.set(el, { opacity: 1, y: 0 });
      });
    }, 1000);

    return () => {
      ctx.revert();
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: "60px 24px",
        borderTop: "1px solid var(--gold-line)",
        borderBottom: "1px solid var(--gold-line)",
        background: "var(--bg-primary)",
        overflow: "hidden",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-label)",
          fontSize: "10px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--gold-muted)",
          textAlign: "center",
          marginBottom: "32px",
        }}
      >
        ICONIC HOUSES
      </p>

      <div className="brands-grid">
        {BRANDS.map((brand) => (
          <Link
            key={brand}
            to={`/shop?brand=${encodeURIComponent(brand)}`}
            className="brand-item"
          >
            {brand}
          </Link>
        ))}
      </div>
    </section>
  );
}
