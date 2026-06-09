'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PencilSimple, Check } from '@phosphor-icons/react'

export default function EditableNameForm({ userId, initialName }: { userId: string; initialName: string }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(initialName)
  const [saving, setSaving] = useState(false)

  async function save() {
    if (!name.trim() || name === initialName) { setEditing(false); return }
    setSaving(true)
    const supabase = createClient()
    await supabase.from('user_profiles').update({ name: name.trim() }).eq('id', userId)
    setSaving(false)
    setEditing(false)
  }

  if (editing) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && save()}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '18px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            background: 'var(--bg-input)',
            border: '1px solid var(--gold-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '4px 8px',
            width: '100%',
          }}
        />
        <button onClick={save} disabled={saving} style={{ color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
          <Check size={20} weight="bold" />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setEditing(true)}
      style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
    >
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
        {name}
      </h1>
      <PencilSimple size={14} color="var(--text-muted)" />
    </button>
  )
}
