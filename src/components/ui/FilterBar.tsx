import { FiChevronDown, FiFilter, FiGrid, FiList } from 'react-icons/fi';
import { useFilters } from '../../context/FilterContext';
import { FILTER_PILLS, SORT_OPTIONS } from '../../utils/constants';

interface FilterBarProps {
  totalCount?: number;
  viewMode: 'grid' | 'list';
  onViewChange: (mode: 'grid' | 'list') => void;
  onOpenDrawer: () => void;
}

export function FilterBar({ totalCount, viewMode, onViewChange, onOpenDrawer }: FilterBarProps) {
  const { activeFilters, setFilter } = useFilters();

  const getActivePill = () => {
    if (activeFilters.isNew) return 'isNew';
    if (activeFilters.collection) return activeFilters.collection;
    if (activeFilters.category) return activeFilters.category;
    return null;
  };
  const activePill = getActivePill();

  const handlePillClick = (pill: typeof FILTER_PILLS[0]) => {
    if (!pill.param) {
      setFilter('category', null);
      setFilter('collection', null);
      setFilter('isNew', null);
      return;
    }
    if (pill.param === 'category') {
      setFilter('category', pill.value as string);
      setFilter('collection', null);
      setFilter('isNew', null);
    } else if (pill.param === 'collection') {
      setFilter('collection', pill.value as string);
      setFilter('category', null);
      setFilter('isNew', null);
    } else if (pill.param === 'isNew') {
      setFilter('isNew', true);
      setFilter('category', null);
      setFilter('collection', null);
    }
  };

  const isAllActive = !activeFilters.category && !activeFilters.collection && !activeFilters.isNew;

  return (
    <div
      style={{
        position: 'sticky',
        top: 'var(--nav-height)',
        zIndex: 50,
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--bg-border)',
        padding: '14px 0',
      }}
    >
      <div className="container-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          {/* Pill strip */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px', flexShrink: 0 }}>
            <button
              onClick={() => handlePillClick(FILTER_PILLS[0])}
              className={`filter-pill ${isAllActive ? 'active' : ''}`}
            >
              ALL
            </button>
            {FILTER_PILLS.slice(1).map((pill) => {
              const isActive = pill.value === activePill;
              return (
                <button
                  key={String(pill.value)}
                  onClick={() => handlePillClick(pill)}
                  className={`filter-pill ${isActive ? 'active' : ''}`}
                >
                  {pill.label.toUpperCase()}
                </button>
              );
            })}
          </div>

          {/* Controls */}
          <div className="filter-bar-controls" style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
            {totalCount !== undefined && (
              <span className="text-label" style={{ color: 'var(--text-muted)' }}>
                {totalCount} FRAGRANCES
              </span>
            )}

            {/* Sort */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
              <span className="text-label" style={{ color: 'var(--text-muted)' }}>SORT BY:</span>
              <select
                value={activeFilters.sortBy}
                onChange={(e) => setFilter('sortBy', e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-label)',
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  appearance: 'none',
                  paddingRight: '16px',
                }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} style={{ background: 'var(--bg-elevated)' }}>
                    {opt.label.toUpperCase()}
                  </option>
                ))}
              </select>
              <FiChevronDown size={12} style={{ color: 'var(--text-muted)', position: 'absolute', right: 0 }} />
            </div>

            {/* View toggle */}
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={() => onViewChange('grid')}
                style={{
                  color: viewMode === 'grid' ? 'var(--gold)' : 'var(--text-muted)',
                  padding: '6px',
                  transition: 'color 0.2s',
                  background: viewMode === 'grid' ? 'var(--gold-glow)' : 'transparent',
                  border: `1px solid ${viewMode === 'grid' ? 'var(--gold-border)' : 'transparent'}`,
                  borderRadius: 0,
                }}
                aria-label="Grid view"
              >
                <FiGrid size={15} />
              </button>
              <button
                onClick={() => onViewChange('list')}
                style={{
                  color: viewMode === 'list' ? 'var(--gold)' : 'var(--text-muted)',
                  padding: '6px',
                  transition: 'color 0.2s',
                  background: viewMode === 'list' ? 'var(--gold-glow)' : 'transparent',
                  border: `1px solid ${viewMode === 'list' ? 'var(--gold-border)' : 'transparent'}`,
                  borderRadius: 0,
                }}
                aria-label="List view"
              >
                <FiList size={15} />
              </button>
            </div>

            {/* Filter drawer button */}
            <button
              className="btn-secondary btn-sm"
              onClick={onOpenDrawer}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FiFilter size={12} /> FILTER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
