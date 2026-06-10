'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BookOpen, ChatCircle, NotePencil, PaperPlaneRight, Trash, Plus, X } from '@phosphor-icons/react'
import { createClient } from '@/lib/supabase/client'
import type { EraContent } from '@/lib/bible/eras-content'

type Tab = 'conteudo' | 'chat' | 'notas'

interface ChatMessage {
  id: string
  role: string
  content: string
  created_at: string
}

interface StudyNote {
  id: string
  title: string | null
  content: string
  verse_reference: string | null
  created_at: string
}

interface Props {
  era: EraContent
  userId: string
  initialChat: ChatMessage[]
  initialNotes: StudyNote[]
}

export function StudyTabs({ era, userId, initialChat, initialNotes }: Props) {
  const [tab, setTab] = useState<Tab>('conteudo')
  const router = useRouter()

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', paddingBottom: 80 }}>
      {/* Header fixo */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-default)',
        padding: '10px 16px 0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <button
            onClick={() => router.back()}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 4 }}
          >
            <ArrowLeft size={20} />
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: era.color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {era.period}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {era.title}
            </div>
          </div>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: era.color + '18',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, color: era.color, fontFamily: 'var(--font-display)', fontWeight: 700,
          }}>
            {era.icon}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0 }}>
          {([
            { key: 'conteudo', label: 'Conteúdo', Icon: BookOpen },
            { key: 'chat', label: 'Professor', Icon: ChatCircle },
            { key: 'notas', label: 'Anotações', Icon: NotePencil },
          ] as const).map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                flex: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                padding: '8px 4px',
                background: 'none',
                border: 'none',
                borderBottom: tab === key ? `2px solid ${era.color}` : '2px solid transparent',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                fontWeight: tab === key ? 600 : 400,
                color: tab === key ? era.color : 'var(--text-muted)',
                transition: 'color 0.15s',
              }}
            >
              <Icon size={14} weight={tab === key ? 'fill' : 'regular'} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo das abas */}
      {tab === 'conteudo' && <ConteudoTab era={era} onAskProfessor={(q) => { setTab('chat') }} />}
      {tab === 'chat' && <ChatTab era={era} userId={userId} initialMessages={initialChat} />}
      {tab === 'notas' && <NotasTab era={era} userId={userId} initialNotes={initialNotes} />}
    </div>
  )
}

/* ─── ABA CONTEÚDO ─── */

function ConteudoTab({ era, onAskProfessor }: { era: EraContent; onAskProfessor: (q: string) => void }) {
  const [openTopic, setOpenTopic] = useState<number | null>(null)
  const router = useRouter()

  return (
    <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Descrição */}
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
        {era.coverDescription}
      </p>

      {/* Passagens Fundamentais */}
      <section>
        <SectionLabel>Passagens Fundamentais</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {era.keyVerses.map((v, i) => (
            <div key={i} style={{
              background: 'var(--bg-card)',
              border: `1px solid ${era.color}25`,
              borderRadius: 12,
              padding: 14,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: era.color, fontWeight: 600 }}>
                  {v.reference}
                </div>
                <button
                  onClick={() => router.push(`/biblia/${v.bookAbbr}/${v.chapter}?versiculo=${v.verse}&highlight=true`)}
                  style={{
                    background: 'none', border: `1px solid ${era.color}30`, borderRadius: 6,
                    padding: '2px 8px', cursor: 'pointer',
                    fontFamily: 'var(--font-mono)', fontSize: 9, color: era.color,
                  }}
                >
                  Ler no contexto
                </button>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>
                &ldquo;{v.text}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tópicos de Estudo */}
      <section>
        <SectionLabel>Tópicos de Estudo</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {era.mainTopics.map((t, i) => (
            <div key={i} style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-default)' }}>
              <button
                onClick={() => setOpenTopic(openTopic === i ? null : i)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '13px 14px',
                  background: openTopic === i ? era.color + '0D' : 'var(--bg-card)',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  transition: 'background 0.15s',
                }}
              >
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, color: openTopic === i ? era.color : 'var(--text-primary)' }}>
                  {t.title}
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)', transition: 'transform 0.2s', transform: openTopic === i ? 'rotate(90deg)' : 'none', flexShrink: 0 }}>›</span>
              </button>
              {openTopic === i && (
                <div style={{ padding: '0 14px 14px', background: era.color + '0D' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                    {t.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Arqueologia */}
      <section>
        <SectionLabel>O que a Arqueologia Descobriu</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {era.archaeologyFacts.map((fact, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12, alignItems: 'flex-start',
              padding: '12px 14px',
              background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 12,
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                background: era.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-mono)', fontSize: 10, color: era.color, fontWeight: 700,
              }}>
                {i + 1}
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {fact}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Teólogos */}
      <section>
        <SectionLabel>Grandes Teólogos desta Era</SectionLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {era.theologians.map((t, i) => (
            <div key={i} style={{
              padding: '6px 12px',
              background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 100,
              fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-secondary)',
            }}>
              {t}
            </div>
          ))}
        </div>
      </section>

      {/* Pergunta de Reflexão */}
      <section>
        <SectionLabel>Pergunta para Reflexão</SectionLabel>
        <div style={{
          padding: 16, background: era.color + '0A',
          border: `1px solid ${era.color}30`, borderRadius: 14,
        }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.7, marginBottom: 14 }}>
            {era.suggestedQuestion}
          </p>
          <button
            onClick={() => onAskProfessor(era.suggestedQuestion)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: era.color, color: '#0F172A',
              fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700,
              border: 'none', borderRadius: 10, padding: '10px 16px', cursor: 'pointer',
            }}
          >
            <ChatCircle size={14} weight="fill" />
            Perguntar ao Professor
          </button>
        </div>
      </section>
    </div>
  )
}

/* ─── ABA CHAT ─── */

function ChatTab({ era, userId, initialMessages }: { era: EraContent; userId: string; initialMessages: ChatMessage[] }) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setLoading(true)

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text, created_at: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])

    // Salvar mensagem do usuário
    await supabase.from('theology_chat').insert({ user_id: userId, era_id: era.id, role: 'user', content: text })

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, agent: 'professor', era_id: era.id }),
      })
      const data = await res.json()
      const reply = data.response ?? 'Não foi possível obter resposta.'

      const profMsg: ChatMessage = { id: crypto.randomUUID(), role: 'professor', content: reply, created_at: new Date().toISOString() }
      setMessages(prev => [...prev, profMsg])

      // Salvar resposta do professor
      await supabase.from('theology_chat').insert({ user_id: userId, era_id: era.id, role: 'professor', content: reply })

      // Incrementar contador
      await supabase.rpc('increment_messages_count', { p_user_id: userId, p_era_id: era.id }).maybeSingle()
    } catch {
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'professor', content: 'Erro ao conectar com o Professor. Tente novamente.', created_at: new Date().toISOString() }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      {/* Mensagens */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 16px' }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🎓</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
              O Professor está pronto
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Pergunte qualquer coisa sobre {era.title}. Teologia, arqueologia, história, interpretação — sem limites.
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '86%',
              padding: '10px 14px',
              borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
              background: msg.role === 'user' ? era.color : 'var(--bg-card)',
              border: msg.role === 'user' ? 'none' : '1px solid var(--border-default)',
            }}>
              {msg.role === 'professor' && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: era.color, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Professor
                </div>
              )}
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                color: msg.role === 'user' ? '#0F172A' : 'var(--text-primary)',
                lineHeight: 1.65,
                margin: 0,
                whiteSpace: 'pre-wrap',
              }}>
                {msg.content}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ padding: '12px 16px', borderRadius: '4px 16px 16px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-default)', display: 'flex', gap: 5, alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: '50%', background: era.color,
                  animation: 'pulse 1.2s ease-in-out infinite',
                  animationDelay: `${i * 0.2}s`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '10px 16px 16px',
        borderTop: '1px solid var(--border-default)',
        display: 'flex', gap: 10, alignItems: 'flex-end',
      }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          placeholder="Pergunte ao Professor..."
          rows={1}
          style={{
            flex: 1, resize: 'none', overflowY: 'auto', maxHeight: 120,
            background: 'var(--bg-card)', border: '1px solid var(--border-default)',
            borderRadius: 14, padding: '10px 14px',
            fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-primary)',
            outline: 'none', lineHeight: 1.5,
          }}
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          style={{
            width: 40, height: 40, borderRadius: 12, flexShrink: 0,
            background: input.trim() && !loading ? era.color : 'var(--border-default)',
            border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s',
          }}
        >
          <PaperPlaneRight size={18} color={input.trim() && !loading ? '#0F172A' : 'var(--text-muted)'} weight="fill" />
        </button>
      </div>
    </div>
  )
}

/* ─── ABA NOTAS ─── */

function NotasTab({ era, userId, initialNotes }: { era: EraContent; userId: string; initialNotes: StudyNote[] }) {
  const [notes, setNotes] = useState<StudyNote[]>(initialNotes)
  const [showModal, setShowModal] = useState(false)
  const [editNote, setEditNote] = useState<StudyNote | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [reference, setReference] = useState('')
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const supabase = createClient()

  function openNew() {
    setEditNote(null); setTitle(''); setContent(''); setReference(''); setShowModal(true)
  }

  function openEdit(note: StudyNote) {
    setEditNote(note); setTitle(note.title ?? ''); setContent(note.content); setReference(note.verse_reference ?? ''); setShowModal(true)
  }

  async function save() {
    if (!content.trim()) return
    setSaving(true)
    try {
      if (editNote) {
        const { data } = await supabase
          .from('study_notes')
          .update({ title: title.trim() || null, content: content.trim(), verse_reference: reference.trim() || null, updated_at: new Date().toISOString() })
          .eq('id', editNote.id)
          .select()
          .single()
        if (data) setNotes(prev => prev.map(n => n.id === editNote.id ? data : n))
      } else {
        const { data } = await supabase
          .from('study_notes')
          .insert({ user_id: userId, era_id: era.id, title: title.trim() || null, content: content.trim(), verse_reference: reference.trim() || null })
          .select()
          .single()
        if (data) setNotes(prev => [data, ...prev])
      }
      setShowModal(false)
    } finally {
      setSaving(false)
    }
  }

  async function deleteNote(id: string) {
    await supabase.from('study_notes').delete().eq('id', id)
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  const filtered = search.trim()
    ? notes.filter(n => n.content.toLowerCase().includes(search.toLowerCase()) || (n.title ?? '').toLowerCase().includes(search.toLowerCase()))
    : notes

  return (
    <div style={{ padding: '16px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Barra de ações */}
      <div style={{ display: 'flex', gap: 10 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar anotações..."
          style={{
            flex: 1, padding: '9px 12px',
            background: 'var(--bg-card)', border: '1px solid var(--border-default)',
            borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-primary)', outline: 'none',
          }}
        />
        <button
          onClick={openNew}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '9px 14px', background: era.color, color: '#0F172A',
            border: 'none', borderRadius: 10, cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700, flexShrink: 0,
          }}
        >
          <Plus size={14} weight="bold" /> Nova
        </button>
      </div>

      {/* Lista de notas */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>📝</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-muted)' }}>
            {search ? 'Nenhuma anotação encontrada' : 'Comece a registrar seus insights sobre esta era'}
          </div>
        </div>
      ) : (
        filtered.map(note => (
          <div
            key={note.id}
            onClick={() => openEdit(note)}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-default)',
              borderRadius: 12, padding: 14, cursor: 'pointer', position: 'relative',
            }}
          >
            {note.title && (
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                {note.title}
              </div>
            )}
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0,
              display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
            }}>
              {note.content}
            </p>
            {note.verse_reference && (
              <div style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 10, color: era.color }}>{note.verse_reference}</div>
            )}
            <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>
                {new Date(note.created_at).toLocaleDateString('pt-BR')}
              </div>
              <button
                onClick={e => { e.stopPropagation(); deleteNote(note.id) }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 4 }}
              >
                <Trash size={14} />
              </button>
            </div>
          </div>
        ))
      )}

      {/* Modal de edição */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.85)', zIndex: 100,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0 0 0',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 480,
              background: 'var(--bg-card)', borderRadius: '20px 20px 0 0',
              padding: '20px 16px 36px', maxHeight: '85dvh', overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                {editNote ? 'Editar anotação' : 'Nova anotação'}
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                <X size={20} />
              </button>
            </div>

            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Título (opcional)"
              style={{
                width: '100%', padding: '10px 12px', marginBottom: 10, boxSizing: 'border-box',
                background: 'var(--bg-primary)', border: '1px solid var(--border-default)',
                borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-primary)', outline: 'none',
              }}
            />
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Sua anotação..."
              rows={6}
              style={{
                width: '100%', padding: '10px 12px', marginBottom: 10, boxSizing: 'border-box',
                background: 'var(--bg-primary)', border: '1px solid var(--border-default)',
                borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-primary)',
                outline: 'none', resize: 'vertical', lineHeight: 1.6,
              }}
            />
            <input
              value={reference}
              onChange={e => setReference(e.target.value)}
              placeholder="Referência bíblica (ex: João 3:16)"
              style={{
                width: '100%', padding: '10px 12px', marginBottom: 16, boxSizing: 'border-box',
                background: 'var(--bg-primary)', border: '1px solid var(--border-default)',
                borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-primary)', outline: 'none',
              }}
            />
            <button
              onClick={save}
              disabled={!content.trim() || saving}
              style={{
                width: '100%', padding: '13px', background: era.color, color: '#0F172A',
                fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700,
                border: 'none', borderRadius: 12, cursor: !content.trim() || saving ? 'not-allowed' : 'pointer',
                opacity: !content.trim() || saving ? 0.6 : 1,
              }}
            >
              {saving ? 'Salvando...' : 'Salvar anotação'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>
      {children}
    </div>
  )
}
