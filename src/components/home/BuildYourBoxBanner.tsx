import { Link } from 'react-router-dom';

export function BuildYourBoxBanner() {
  return (
    <section
      style={{
        background: 'var(--bg-elevated)',
        padding: 'clamp(60px, 10vw, 120px) 24px',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      {/* Diamond pattern overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.04,
          backgroundImage: `repeating-linear-gradient(
            45deg,
            var(--gold) 0px,
            var(--gold) 1px,
            transparent 1px,
            transparent 20px
          ), repeating-linear-gradient(
            -45deg,
            var(--gold) 0px,
            var(--gold) 1px,
            transparent 1px,
            transparent 20px
          )`,
          pointerEvents: 'none',
        }}
      />
      <div className="container-content" style={{ position: 'relative', zIndex: 1 }}>
        <p className="text-label" style={{ color: 'var(--gold-muted)', marginBottom: '24px' }}>
          CURATED COLLECTIONS
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 300,
            fontSize: 'clamp(40px, 5vw, 72px)',
            lineHeight: 1.1,
            color: 'var(--text-primary)',
            marginBottom: '40px',
          }}
        >
          Your Fragrance Wardrobe,
          <br />
          <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Defined by You.</em>
        </h2>
        <Link to="/build-your-box" className="btn-primary" style={{ display: 'inline-flex' }}>
          CREATE YOUR BOX
        </Link>
      </div>
    </section>
  );
}
