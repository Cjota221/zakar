import { BIBLE_TIMELINE } from '@/lib/bible/timeline'

export default function TimelinePage() {
  return (
    <div className="page-enter" style={{ padding: '24px 16px', paddingBottom: '100px' }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: '4px',
      }}>
        Modo Cronológico
      </div>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '26px',
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: '6px',
      }}>
        A Bíblia na História
      </h1>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '14px',
        color: 'var(--text-muted)',
        marginBottom: '28px',
      }}>
        7 eras que contam a história da redenção
      </p>

      <div style={{ position: 'relative', paddingLeft: '32px' }}>
        {/* Linha vertical */}
        <div style={{
          position: 'absolute',
          left: '9px',
          top: 0,
          bottom: 0,
          width: '2px',
          background: 'var(--border-default)',
          borderRadius: '2px',
        }} />

        {BIBLE_TIMELINE.map((era, i) => (
          <div key={era.id} style={{ position: 'relative', marginBottom: '20px' }}>
            {/* Dot */}
            <div style={{
              position: 'absolute',
              left: '-28px',
              top: '18px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: era.color,
              border: '2px solid var(--bg-primary)',
              boxShadow: `0 0 8px ${era.color}50`,
            }} />

            <div style={{
              background: 'var(--bg-card)',
              border: '0.5px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
            }}>
              {/* Era header */}
              <div style={{ marginBottom: '8px' }}>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '2px',
                }}>
                  {era.era}
                </p>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: era.color,
                  marginBottom: '4px',
                }}>
                  {era.period}
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  lineHeight: 1.5,
                  marginBottom: era.events.length > 0 ? '10px' : 0,
                }}>
                  {era.description}
                </p>
              </div>

              {/* Eventos */}
              {era.events.length > 0 && (
                <div style={{
                  borderTop: '0.5px solid var(--border-default)',
                  paddingTop: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}>
                  {era.events.map((ev, j) => (
                    <div key={j} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9px',
                        color: era.color,
                        flexShrink: 0,
                        minWidth: '72px',
                        paddingTop: '2px',
                      }}>
                        {ev.year}
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '11px',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.4,
                      }}>
                        {ev.event}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
