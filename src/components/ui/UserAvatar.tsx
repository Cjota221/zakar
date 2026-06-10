interface UserAvatarProps {
  avatarUrl?: string | null
  name?: string | null
  size?: number
}

export function UserAvatar({ avatarUrl, name, size = 36 }: UserAvatarProps) {
  const initials = (() => {
    if (!name) return '?'
    const parts = name.trim().split(' ')
    return (parts.length > 1
      ? parts[0][0] + parts[parts.length - 1][0]
      : parts[0][0]
    ).toUpperCase()
  })()

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: avatarUrl ? 'transparent' : 'rgba(212,175,55,0.12)',
        border: '2px solid rgba(212,175,55,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt={name ?? 'Avatar'}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: size * 0.36,
            fontWeight: 700,
            color: '#D4AF37',
            lineHeight: 1,
          }}
        >
          {initials}
        </span>
      )}
    </div>
  )
}
