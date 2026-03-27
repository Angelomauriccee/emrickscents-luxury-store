import { Link } from "react-router-dom";
import { BRANDS } from "../../utils/constants";

export function BrandsSection() {
  return (
    <section
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
