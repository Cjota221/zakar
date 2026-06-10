'use client'

import { useState, useRef, useEffect } from 'react'
import html2canvas from 'html2canvas'
import { ShareNetwork, X, DownloadSimple } from '@phosphor-icons/react'

interface ShareVerseProps {
  verseReference: string
  verseText: string
}

interface UnsplashImage {
  id: string
  url: string
  thumb: string
  credit: string
}

const GRADIENT_BACKGROUNDS = [
  'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
  'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  'linear-gradient(135deg, #2d1b69 0%, #11998e 100%)',
  'linear-gradient(135deg, #1a472a 0%, #2d6a4f 50%, #1a472a 100%)',
  'linear-gradient(135deg, #4a1942 0%, #c4162a 100%)',
]

export function ShareVerse({ verseReference, verseText }: ShareVerseProps) {
  const [showModal, setShowModal] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedGradient, setSelectedGradient] = useState(0)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [unsplashImages, setUnsplashImages] = useState<UnsplashImage[]>([])
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showModal) return
    fetch('/api/backgrounds')
      .then(r => r.json())
      .then(data => setUnsplashImages(data.images ?? []))
      .catch(() => {})
  }, [showModal])

  const activeBackground = selectedImage
    ? `url(${selectedImage}) center/cover no-repeat`
    : GRADIENT_BACKGROUNDS[selectedGradient]

  async function generateAndShare() {
    if (!cardRef.current) return
    setIsGenerating(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
        allowTaint: true,
      })

      canvas.toBlob(async blob => {
        if (!blob) return
        if (navigator.share) {
          const file = new File([blob], 'zakar-versiculo.png', { type: 'image/png' })
          try {
            await navigator.share({
              title: `Zakar — ${verseReference}`,
              text: verseText,
              files: [file],
            })
          } catch {
            downloadBlob(blob)
          }
        } else {
          downloadBlob(blob)
        }
      }, 'image/png')
    } finally {
      setIsGenerating(false)
    }
  }

  function downloadBlob(blob: Blob) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'zakar-versiculo.png'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          background: 'transparent',
          border: '1px solid var(--border-default)',
          borderRadius: 8,
          padding: '5px 10px',
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
          fontSize: 11,
          color: 'var(--text-secondary)',
        }}
      >
        <ShareNetwork size={13} />
        Compartilhar
      </button>

      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.88)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 0 0',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 480,
              background: 'var(--bg-card)',
              borderRadius: '20px 20px 0 0',
              padding: '20px 16px 36px',
              maxHeight: '92dvh',
              overflowY: 'auto',
            }}
          >
            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                Compartilhar versículo
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Card de preview */}
            <div
              ref={cardRef}
              style={{
                width: '100%',
                aspectRatio: '1 / 1',
                borderRadius: 16,
                background: activeBackground,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 32,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.48)' }} />
              <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: 'rgba(212,175,55,0.75)',
                  letterSpacing: '0.25em',
                  marginBottom: 20,
                  textTransform: 'uppercase',
                }}>
                  ZAKAR
                </div>
                <p style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: 17,
                  color: '#F1F5F9',
                  lineHeight: 1.75,
                  fontStyle: 'italic',
                  textAlign: 'center',
                  marginBottom: 18,
                }}>
                  &ldquo;{verseText}&rdquo;
                </p>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: '#D4AF37',
                  textAlign: 'center',
                  letterSpacing: '0.05em',
                }}>
                  {verseReference}
                </div>
              </div>
            </div>

            {/* Seletor de fundo */}
            <div style={{ marginTop: 14 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                Fundo
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {/* Gradientes */}
                {GRADIENT_BACKGROUNDS.map((bg, i) => (
                  <button
                    key={`g-${i}`}
                    onClick={() => { setSelectedGradient(i); setSelectedImage(null) }}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: bg,
                      border: (!selectedImage && selectedGradient === i)
                        ? '2px solid #D4AF37'
                        : '2px solid transparent',
                      cursor: 'pointer',
                      flexShrink: 0,
                      outline: 'none',
                    }}
                  />
                ))}
                {/* Imagens Unsplash */}
                {unsplashImages.map(img => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.url)}
                    title={`Foto por ${img.credit}`}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      backgroundImage: `url(${img.thumb})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      border: selectedImage === img.url
                        ? '2px solid #D4AF37'
                        : '2px solid transparent',
                      cursor: 'pointer',
                      flexShrink: 0,
                      outline: 'none',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Botão de compartilhar */}
            <button
              onClick={generateAndShare}
              disabled={isGenerating}
              style={{
                width: '100%',
                marginTop: 16,
                background: '#D4AF37',
                color: '#0F172A',
                fontFamily: 'var(--font-display)',
                fontSize: 15,
                fontWeight: 700,
                border: 'none',
                borderRadius: 12,
                padding: '14px',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                opacity: isGenerating ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <DownloadSimple size={18} />
              {isGenerating ? 'Gerando...' : 'Compartilhar'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
