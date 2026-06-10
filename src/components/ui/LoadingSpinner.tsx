export default function LoadingSpinner() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '60vh', flexDirection: 'column', gap: 12,
    }}>
      <div style={{
        width: 32, height: 32,
        border: '3px solid var(--border-default)',
        borderTop: '3px solid #D4AF37',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
        Carregando...
      </span>
    </div>
  )
}
