export default function HomeLoading() {
  return (
    <div style={{ padding: '16px 16px 80px' }}>
      {/* Header skeleton */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ flex: 1 }}>
          <div className="skeleton skeleton-text-sm" style={{ width: '30%' }} />
          <div className="skeleton skeleton-title" style={{ width: '60%', marginTop: '8px' }} />
        </div>
        <div className="skeleton skeleton-avatar" />
      </div>

      {/* Streak skeleton */}
      <div className="skeleton" style={{ height: '28px', width: '40%', borderRadius: '100px', marginBottom: '16px' }} />

      {/* Devocional card skeleton */}
      <div className="skeleton skeleton-card" style={{ height: '200px', marginBottom: '16px', borderRadius: 'var(--radius-lg)' }} />

      {/* Salmo skeleton */}
      <div className="skeleton" style={{ height: '68px', borderRadius: '14px', marginBottom: '16px' }} />

      {/* Eras skeleton */}
      <div className="skeleton skeleton-title" style={{ width: '30%', marginBottom: '12px' }} />
      <div style={{ display: 'flex', gap: '12px', overflow: 'hidden' }}>
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="skeleton" style={{ height: '160px', width: '188px', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
        ))}
      </div>
    </div>
  )
}