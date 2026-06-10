'use client'

import { use, useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, CaretLeft, CaretRight } from '@phosphor-icons/react'
import { fetchBook, fetchBookIndex, type BookMeta, type BibleBook } from '@/lib/bible'

interface Props {
  params: Promise<{ livro: string; capitulo: string }>
}

function ChapterReader({ livro, capitulo }: { livro: string; capitulo: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const highlightVerse = Number(searchParams.get('versiculo') ?? 0)

  const chapterIndex = Number(capitulo) - 1
  const [book, setBook] = useState<BibleBook | null>(null)
  const [bookMeta, setBookMeta] = useState<BookMeta | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [data, index] = await Promise.all([
        fetchBook(livro),
        fetchBookIndex(),
      ])
      setBook(data)
      setBookMeta(index.find(b => b.abbrev.toLowerCase() === livro.toLowerCase()) ?? null)
      setLoading(false)
    }
    load()
  }, [livro])

  useEffect(() => {
    if (!loading && highlightVerse) {
      setTimeout(() => {
        const el = document.getElementById(`verse-${highlightVerse}`)
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 300)
    }
  }, [loading, highlightVerse])

  const verses = book?.chapters[chapterIndex] ?? []
  const totalChapters = bookMeta?.chapters ?? 0

  function goChapter(delta: number) {
    const next = chapterIndex + 1 + delta
    router.push(`/biblia/${livro}/${next}`)
  }

  return (
    <div style={{ minHeight: '100dvh', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-default)',
        padding: '10px 16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <button
            onClick={() => router.back()}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 4 }}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--text-primary)', flex: 1 }}>
            {bookMeta?.name ?? livro} {chapterIndex + 1}
          </h1>
        </div>

        {/* Nav capítulo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            disabled={chapterIndex <= 0}
            onClick={() => goChapter(-1)}
            style={{
              background: 'none', border: 'none',
              cursor: chapterIndex <= 0 ? 'default' : 'pointer',
              color: chapterIndex <= 0 ? 'var(--border-default)' : 'var(--text-muted)',
              display: 'flex', alignItems: 'center', gap: 4,
              fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-xs)', padding: '4px 0',
            }}
          >
            <CaretLeft size={14} /> Anterior
          </button>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
            {chapterIndex + 1} / {totalChapters}
          </span>
          <button
            disabled={chapterIndex >= totalChapters - 1}
            onClick={() => goChapter(1)}
            style={{
              background: 'none', border: 'none',
              cursor: chapterIndex >= totalChapters - 1 ? 'default' : 'pointer',
              color: chapterIndex >= totalChapters - 1 ? 'var(--border-default)' : 'var(--text-muted)',
              display: 'flex', alignItems: 'center', gap: 4,
              fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-xs)', padding: '4px 0',
            }}
          >
            Próximo <CaretRight size={14} />
          </button>
        </div>
      </div>

      {/* Versículos */}
      <div style={{ padding: '20px 16px 16px' }}>
        {loading ? (
          <ReaderSkeleton />
        ) : (
          verses.map((text, i) => {
            const vNum = i + 1
            const isHighlighted = highlightVerse === vNum
            return (
              <div
                key={i}
                id={`verse-${vNum}`}
                style={{
                  display: 'flex',
                  gap: 10,
                  marginBottom: 4,
                  padding: '8px 10px',
                  borderRadius: 8,
                  background: isHighlighted ? 'rgba(212,175,55,0.10)' : 'transparent',
                  borderLeft: isHighlighted ? '3px solid #D4AF37' : '3px solid transparent',
                  transition: 'background 0.3s ease, border-color 0.3s ease',
                  alignItems: 'flex-start',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: '#D4AF37',
                  minWidth: 18,
                  paddingTop: 5,
                  textAlign: 'right',
                  flexShrink: 0,
                }}>
                  {vNum}
                </span>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 18,
                  lineHeight: 1.85,
                  letterSpacing: '0.01em',
                  color: isHighlighted ? 'var(--text-primary)' : 'var(--text-secondary)',
                  margin: 0,
                  flex: 1,
                }}>
                  {text}
                </p>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

function ReaderSkeleton() {
  return (
    <div>
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <div className="skeleton" style={{ width: 18, height: 12, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ height: 16, width: '100%', marginBottom: 5 }} />
            <div className="skeleton" style={{ height: 16, width: `${65 + (i % 3) * 12}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function BibliaChapterPage({ params }: Props) {
  const { livro, capitulo } = use(params)
  return (
    <Suspense fallback={<ReaderSkeleton />}>
      <ChapterReader livro={livro} capitulo={capitulo} />
    </Suspense>
  )
}
