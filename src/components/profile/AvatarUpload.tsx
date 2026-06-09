'use client'

import { useRef, useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Camera } from '@phosphor-icons/react'

interface Props {
  userId: string
  name: string
  avatarUrl: string | null
  onUpdate?: (url: string) => void
}

export function AvatarUpload({ userId, name, avatarUrl, onUpdate }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(avatarUrl)
  const [uploading, setUploading] = useState(false)
  const [, startTransition] = useTransition()

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)
    setUploading(true)

    try {
      const supabase = createClient()
      const path = `${userId}/avatar.${file.name.split('.').pop()}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      const publicUrl = data.publicUrl + `?t=${Date.now()}`

      await supabase
        .from('user_profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId)

      startTransition(() => onUpdate?.(publicUrl))
    } catch (err) {
      console.error('Erro no upload:', err)
      setPreview(avatarUrl)
    } finally {
      setUploading(false)
    }
  }

  return (
    <button
      onClick={() => inputRef.current?.click()}
      disabled={uploading}
      style={{
        position: 'relative',
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        background: 'var(--gold-dim)',
        border: '2px solid var(--gold-border)',
        cursor: 'pointer',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {preview ? (
        <img
          src={preview}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '26px',
          fontWeight: 700,
          color: 'var(--gold)',
        }}>
          {name?.[0]?.toUpperCase() ?? '?'}
        </span>
      )}

      {/* overlay de câmera */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: uploading ? 1 : 0,
        transition: 'opacity 0.2s',
      }}
        className="avatar-hover-overlay"
      >
        <Camera size={20} color="#fff" weight="fill" />
      </div>

      <style>{`.avatar-hover-overlay { opacity: 0 } button:hover .avatar-hover-overlay { opacity: 1 }`}</style>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFile}
      />
    </button>
  )
}
