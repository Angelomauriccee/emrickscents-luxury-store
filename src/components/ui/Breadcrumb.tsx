import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
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
