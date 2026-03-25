import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BRANDS } from "../../utils/constants";

gsap.registerPlugin(ScrollTrigger);

export function BrandsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

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
          start: "top 85%",
          once: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: "80px 0",
        borderTop: "1px solid var(--bg-border)",
        borderBottom: "1px solid var(--bg-border)",
      }}
    >
      <div className="container-content">
        <p
          className="text-label"
          style={{
            color: "var(--text-muted)",
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          ICONIC HOUSES
        </p>
        <div
          className="brands-scroll"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "nowrap",
            gap: "0",
            overflowX: "auto",
            scrollbarWidth: "none",
            paddingBottom: "8px",
          }}
        >
          {BRANDS.map((brand, index) => (
            <span
              key={brand}
              style={{ display: "flex", alignItems: "center", flexShrink: 0 }}
            >
              {index > 0 && (
                <span
                  style={{
                    width: "-10px",
                    height: "12px",
                    background: "var(--bg-border)",
                    margin: "0 24px",
                  }}
                />
              )}
              <button
                className="brand-item"
                onClick={() =>
                  navigate(`/shop?brand=${encodeURIComponent(brand)}`)
                }
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 300,
                  fontSize: "20px",
                  color: "var(--text-muted)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "color 0.25s ease",
                  padding: "4px 0",
                  whiteSpace: "nowrap",
                  minWidth: "max-content",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--text-primary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--text-muted)")
                }
              >
                {brand}
              </button>
            </span>
          ))}
          {/* Spacer to ensure the last item is never clipped by the edge of the scroll container */}
          <span style={{ width: "24px", flexShrink: 0 }} />
        </div>
      </div>
      <style>{`
        .brands-scroll::-webkit-scrollbar { display: none; }
        @media (max-width: 1200px) {
          .brands-scroll { justify-content: flex-start !important; }
        }
      `}</style>
    </section>
  );
}
