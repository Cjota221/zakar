'use client'

import { useState, useEffect, useRef } from 'react'
import { CaretLeft, CaretRight, MagnifyingGlass, X, ArrowLeft, ClockCounterClockwise } from '@phosphor-icons/react'
import { fetchBookIndex, fetchBook, BOOK_GROUPS, type BookMeta, type BibleBook } from '@/lib/bible'
import { BibleTimeline } from '@/components/biblia/BibleTimeline'
import { getEraForBook } from '@/lib/bible/timeline'

type View = 'index' | 'timeline' | 'chapters' | 'reader'

export default function BibliaPage() {
  const [view, setView] = useState<View>('index')
  const [books, setBooks] = useState<BookMeta[]>([])
  const [selectedBook, setSelectedBook] = useState<BookMeta | null>(null)
  const [loadedBook, setLoadedBook] = useState<BibleBook | null>(null)
  const [selectedChapter, setSelectedChapter] = useState(0)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingChapter, setLoadingChapter] = useState(false)
  const verseRefs = useRef<(HTMLParagraphElement | null)[]>([])

  useEffect(() => {
    fetchBookIndex().then(data => {
      setBooks(data)
      setLoading(false)
    })
  }, [])

  async function openBook(book: BookMeta) {
    setSelectedBook(book)
    setView('chapters')
  }

  async function openChapter(chapterIndex: number) {
    if (!selectedBook) return
    setLoadingChapter(true)
    setView('reader')
    setSelectedChapter(chapterIndex)
    if (!loadedBook || loadedBook.abbrev !== selectedBook.abbrev) {
      const data = await fetchBook(selectedBook.abbrev)
      setLoadedBook(data)
    }
    setLoadingChapter(false)
    verseRefs.current = []
    window.scrollTo({ top: 0 })
  }

  const filteredBooks = search.trim()
    ? books.filter(b => b.name.toLowerCase().includes(search.toLowerCase()))
    : books

  const verses = loadedBook?.chapters[selectedChapter] ?? []

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-default)',
        padding: '12px 16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {view !== 'index' && view !== 'timeline' && (
            <button
              onClick={() => {
                if (view === 'reader') setView('chapters')
                else setView('index')
              }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-muted)', display: 'flex' }}
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div style={{ flex: 1 }}>
            {(view === 'index' || view === 'timeline') && (
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--text-primary)' }}>
                Bíblia NVI
              </h1>
            )}
            {view === 'chapters' && selectedBook && (
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-md)', fontWeight: 700, color: 'var(--text-primary)' }}>
                {selectedBook.name}
              </h1>
            )}
            {view === 'reader' && selectedBook && (
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--text-primary)' }}>
                {selectedBook.name} {selectedChapter + 1}
              </h1>
            )}
          </div>
          {(view === 'index' || view === 'timeline') && (
            <button
              onClick={() => setView(view === 'timeline' ? 'index' : 'timeline')}
              title="Linha do tempo"
              style={{
                background: view === 'timeline' ? 'rgba(212,175,55,0.12)' : 'none',
                border: view === 'timeline' ? '1px solid rgba(212,175,55,0.3)' : 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                padding: '6px',
                color: view === 'timeline' ? 'var(--gold)' : 'var(--text-muted)',
                display: 'flex',
              }}
            >
              <ClockCounterClockwise size={20} />
            </button>
          )}
          {view === 'index' && (
            <button
              onClick={() => {}}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-muted)', display: 'flex' }}
            >
              <MagnifyingGlass size={20} />
            </button>
          )}
        </div>

        {/* Busca */}
        {view === 'index' && (
          <div style={{ marginTop: '10px', position: 'relative' }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar livro..."
              style={{
                width: '100%',
                padding: '8px 36px 8px 12px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--text-primary)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}

        {/* Nav capítulo */}
        {view === 'reader' && selectedBook && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
            <button
              disabled={selectedChapter === 0}
              onClick={() => openChapter(selectedChapter - 1)}
              style={{
                background: 'none', border: 'none', cursor: selectedChapter === 0 ? 'default' : 'pointer',
                color: selectedChapter === 0 ? 'var(--border-default)' : 'var(--text-muted)',
                display: 'flex', alignItems: 'center', gap: '4px',
                fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-xs)', padding: '4px 0',
              }}
            >
              <CaretLeft size={14} /> Anterior
            </button>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
              {selectedChapter + 1} / {selectedBook.chapters}
            </span>
            <button
              disabled={selectedChapter >= selectedBook.chapters - 1}
              onClick={() => openChapter(selectedChapter + 1)}
              style={{
                background: 'none', border: 'none',
                cursor: selectedChapter >= selectedBook.chapters - 1 ? 'default' : 'pointer',
                color: selectedChapter >= selectedBook.chapters - 1 ? 'var(--border-default)' : 'var(--text-muted)',
                display: 'flex', alignItems: 'center', gap: '4px',
                fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-xs)', padding: '4px 0',
              }}
            >
              Próximo <CaretRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* ── TIMELINE: linha do tempo ── */}
      {view === 'timeline' && (
        <BibleTimeline currentBook={selectedBook?.abbrev} />
      )}

      {/* ── INDEX: lista de livros ── */}
      {view === 'index' && (
        <div style={{ padding: '16px' }}>
          {loading ? (
            <BookListSkeleton />
          ) : search.trim() ? (
            <div>
              {filteredBooks.length === 0 ? (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', textAlign: 'center', paddingTop: '32px' }}>
                  Nenhum livro encontrado
                </p>
              ) : (
                filteredBooks.map(book => (
                  <BookRow key={book.abbrev} book={book} onSelect={() => openBook(book)} />
                ))
              )}
            </div>
          ) : (
            BOOK_GROUPS.map(group => {
              const groupBooks = books.slice(group.range[0], group.range[1] + 1)
              return (
                <div key={group.label} style={{ marginBottom: '24px' }}>
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    marginBottom: '8px',
                  }}>
                    {group.label}
                  </p>
                  <div style={{
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    background: 'var(--bg-card)',
                  }}>
                    {groupBooks.map((book, i) => (
                      <BookRow
                        key={book.abbrev}
                        book={book}
                        onSelect={() => openBook(book)}
                        divider={i < groupBooks.length - 1}
                      />
                    ))}
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* ── CHAPTERS: grade de capítulos ── */}
      {view === 'chapters' && selectedBook && (
        <div style={{ padding: '20px 16px' }}>
          {/* Abbrev decorativo */}
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            marginBottom: '4px',
            opacity: 0.7,
          }}>
            {selectedBook.abbrev} · {selectedBook.chapters} capítulos
          </p>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--text-muted)',
            marginBottom: '14px',
          }}>
            Escolha onde começar a leitura
          </p>

          {/* Banner de era cronológica */}
          {(() => {
            const era = getEraForBook(selectedBook.abbrev)
            if (!era) return null
            return (
              <button
                onClick={() => setView('timeline')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  background: `${era.color}0D`,
                  border: `1px solid ${era.color}35`,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  marginBottom: '20px',
                  textAlign: 'left',
                }}
              >
                <ClockCounterClockwise size={16} color={era.color} weight="bold" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 600, color: era.color }}>
                    {era.era}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px' }}>
                    {era.period} · Ver linha do tempo
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>›</span>
              </button>
            )
          })()}

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
          }}>
            {Array.from({ length: selectedBook.chapters }, (_, i) => (
              <button
                key={i}
                onClick={() => openChapter(i)}
                style={{
                  padding: '16px 8px 14px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--gold-border)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-default)')}
              >
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: 'var(--gold)',
                  lineHeight: 1,
                }}>
                  {i + 1}
                </span>
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '9px',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}>
                  cap
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── READER: versículos ── */}
      {view === 'reader' && (
        <div style={{ padding: '20px 16px 16px' }}>
          {loadingChapter ? (
            <ReaderSkeleton />
          ) : (
            verses.map((text, i) => (
              <div
                key={i}
                style={{ display: 'flex', gap: '10px', marginBottom: '16px', alignItems: 'flex-start' }}
              >
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--gold)',
                  minWidth: '18px',
                  paddingTop: '4px',
                  textAlign: 'right',
                  flexShrink: 0,
                }}>
                  {i + 1}
                </span>
                <p
                  ref={el => { verseRefs.current[i] = el }}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--font-size-base)',
                    lineHeight: 1.8,
                    color: 'var(--text-secondary)',
                    margin: 0,
                    flex: 1,
                  }}
                >
                  {text}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

function BookRow({ book, onSelect, divider = false }: { book: BookMeta; onSelect: () => void; divider?: boolean }) {
  return (
    <button
      onClick={onSelect}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 14px',
        background: 'none',
        border: 'none',
        borderBottom: divider ? '1px solid var(--border-default)' : 'none',
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
        {book.name}
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
        {book.chapters} cap
      </span>
    </button>
  )
}

function BookListSkeleton() {
  return (
    <div>
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="skeleton" style={{ height: '42px', borderRadius: 'var(--radius-sm)', marginBottom: '8px' }} />
      ))}
    </div>
  )
}

function ReaderSkeleton() {
  return (
    <div>
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <div className="skeleton" style={{ width: '18px', height: '12px', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ height: '15px', width: '100%', marginBottom: '4px' }} />
            <div className="skeleton" style={{ height: '15px', width: `${60 + (i % 3) * 15}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}
