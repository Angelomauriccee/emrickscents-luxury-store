export function SkeletonCard() {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="skeleton" style={{ aspectRatio: '3/4', width: '100%' }} />
      <div style={{ padding: '16px' }}>
        <div className="skeleton" style={{ height: '11px', width: '60px', marginBottom: '10px', borderRadius: '2px' }} />
        <div className="skeleton" style={{ height: '22px', width: '85%', marginBottom: '8px', borderRadius: '2px' }} />
        <div className="skeleton" style={{ height: '12px', width: '55%', marginBottom: '12px', borderRadius: '2px' }} />
        <div className="skeleton" style={{ height: '18px', width: '40%', borderRadius: '2px' }} />
      </div>
    </div>
  );
}
