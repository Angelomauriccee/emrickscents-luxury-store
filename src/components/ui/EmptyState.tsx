import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaPath?: string;
}

export function EmptyState({ icon, title, description, ctaLabel, ctaPath }: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 24px',
        textAlign: 'center',
        gap: '20px',
      }}
    >
      {icon && (
        <div style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '48px' }}>
          {icon}
        </div>
      )}
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '36px', color: 'var(--text-primary)' }}>
        {title}
      </h2>
      {description && (
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '360px', lineHeight: 1.7 }}>
          {description}
        </p>
      )}
      {ctaLabel && ctaPath && (
        <Link to={ctaPath} className="btn-secondary" style={{ marginTop: '8px' }}>
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
