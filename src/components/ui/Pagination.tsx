import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages: (number | '...')[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-label)',
    fontSize: '11px',
    fontWeight: 400,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '8px 12px',
    transition: 'color 0.2s',
    border: 'none',
    background: 'none',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '60px 0 40px' }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{ ...labelStyle, opacity: currentPage === 1 ? 0.3 : 1 }}
      >
        <FiChevronLeft size={12} style={{ verticalAlign: 'middle' }} /> PREVIOUS
      </button>

      {pages.map((page, idx) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${idx}`} style={{ ...labelStyle, cursor: 'default' }}>…</span>
          );
        }
        const isActive = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            style={{
              ...labelStyle,
              color: isActive ? 'var(--gold)' : 'var(--text-muted)',
              borderBottom: isActive ? '1px solid var(--gold)' : '1px solid transparent',
            }}
          >
            {String(page).padStart(2, '0')}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{ ...labelStyle, opacity: currentPage === totalPages ? 0.3 : 1 }}
      >
        NEXT <FiChevronRight size={12} style={{ verticalAlign: 'middle' }} />
      </button>
    </div>
  );
}
