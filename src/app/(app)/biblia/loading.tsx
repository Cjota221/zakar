export default function BibliaLoading() {
  return (
    <div style={{ padding: '16px' }}>
      <div className="skeleton skeleton-title" style={{ width: '40%' }} />
      <div className="skeleton skeleton-text-sm" style={{ width: '20%', marginBottom: '16px' }} />
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="skeleton" style={{ height: '42px', borderRadius: 'var(--radius-sm)', marginBottom: '8px' }} />
      ))}
    </div>
  )
}