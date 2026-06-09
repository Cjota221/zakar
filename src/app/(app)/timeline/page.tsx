export default function TimelinePage() {
  const eras = [
    { label: 'Criação e Patriarcas', period: 'aprox. 4000–1800 a.C.', emoji: '🌅', books: 'Gênesis, Jó' },
    { label: 'Escravidão e Êxodo', period: 'aprox. 1800–1400 a.C.', emoji: '🏜️', books: 'Êxodo, Levítico, Números, Deuteronômio' },
    { label: 'Conquista e Juízes', period: 'aprox. 1400–1000 a.C.', emoji: '⚔️', books: 'Josué, Juízes, Rute' },
    { label: 'Monarquia', period: 'aprox. 1000–586 a.C.', emoji: '👑', books: 'Samuel, Reis, Crônicas, Salmos, Provérbios...' },
    { label: 'Exílio e Retorno', period: 'aprox. 586–400 a.C.', emoji: '🕍', books: 'Esdras, Neemias, Daniel, Profetas Menores' },
    { label: 'Período Intertestamentário', period: 'aprox. 400–4 a.C.', emoji: '⏳', books: '(sem livros canônicos)' },
    { label: 'NT e Igreja Primitiva', period: 'aprox. 4 a.C.–100 d.C.', emoji: '✝️', books: 'Evangelhos, Atos, Epístolas, Apocalipse' },
  ]

  return (
    <div className="page-enter" style={{ padding: '24px 16px' }}>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '26px',
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: '6px',
      }}>
        Linha do Tempo
      </h1>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '14px',
        color: 'var(--text-muted)',
        marginBottom: '28px',
      }}>
        A história bíblica em 7 eras
      </p>

      <div style={{ position: 'relative', paddingLeft: '28px' }}>
        {/* Linha vertical */}
        <div style={{
          position: 'absolute',
          left: '9px',
          top: 0,
          bottom: 0,
          width: '2px',
          background: 'var(--border-default)',
        }} />

        {eras.map((era, i) => (
          <div key={i} style={{ position: 'relative', marginBottom: '20px' }}>
            {/* Dot */}
            <div style={{
              position: 'absolute',
              left: '-24px',
              top: '14px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: 'var(--gold)',
              border: '2px solid var(--bg-primary)',
            }} />

            <div style={{
              background: 'var(--bg-card)',
              border: '0.5px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
            }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '20px', lineHeight: 1.2, flexShrink: 0 }}>{era.emoji}</span>
                <div>
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: '2px',
                  }}>
                    {era.label}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--gold)',
                    marginBottom: '4px',
                  }}>
                    {era.period}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    lineHeight: 1.5,
                  }}>
                    {era.books}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
