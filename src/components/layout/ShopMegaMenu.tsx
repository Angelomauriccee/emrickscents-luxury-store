import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { slugify } from '../../utils/slugify';

interface ShopMegaMenuProps {
  products: Product[];
  loading: boolean;
  onNavigate?: () => void;
  variant?: 'desktop' | 'mobile';
}

interface Group {
  letter: string;
  items: Product[];
}

function groupByInitial(products: Product[]): Group[] {
  const map = new Map<string, Product[]>();
  for (const p of products) {
    const letter = p.name.trim().charAt(0).toUpperCase() || '#';
    const key = /[A-Z]/.test(letter) ? letter : '#';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(p);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letter, items]) => ({
      letter,
      items: items.sort((a, b) => a.name.localeCompare(b.name)),
    }));
}

export function ShopMegaMenu({ products, loading, onNavigate, variant = 'desktop' }: ShopMegaMenuProps) {
  const groups = useMemo(() => groupByInitial(products), [products]);
  const isMobile = variant === 'mobile';

  return (
    <div
      style={
        isMobile
          ? {
              maxHeight: '60vh',
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: '8px 4px 8px 12px',
              width: '100%',
            }
          : {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
              gap: '28px 32px',
              maxHeight: '70vh',
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: '28px 32px',
            }
      }
    >
      {loading && (
        <p className="text-ui" style={{ color: 'var(--text-secondary)' }}>
          Loading products…
        </p>
      )}
      {!loading && groups.length === 0 && (
        <p className="text-ui" style={{ color: 'var(--text-secondary)' }}>
          No products found.
        </p>
      )}
      {!loading &&
        groups.map((group) => (
          <div key={group.letter}>
            <div
              className="text-label"
              style={{
                color: 'var(--gold)',
                borderBottom: '1px solid var(--gold-line)',
                paddingBottom: '6px',
                marginBottom: '10px',
                letterSpacing: '0.1em',
              }}
            >
              {group.letter}
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {group.items.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/product/${p.id || slugify(p.name)}`}
                    onClick={onNavigate}
                    className="text-ui"
                    style={{
                      color: 'var(--text-secondary)',
                      transition: 'color 0.2s',
                      display: 'inline-block',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
}
