import { Link, useLocation } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { SITE_URL } from '../seo/SEO';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const location = useLocation();

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${SITE_URL}${item.path ?? location.pathname}`,
    })),
  };

  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
      <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      {items.map((item, index) => (
        <span key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {index > 0 && <FiChevronRight size={10} style={{ color: 'var(--text-muted)' }} />}
          {item.path && index < items.length - 1 ? (
            <Link
              to={item.path}
              className="text-label"
              style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}
            >
              {item.label.toUpperCase()}
            </Link>
          ) : (
            <span className="text-label" style={{ color: 'var(--text-secondary)' }}>
              {item.label.toUpperCase()}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
