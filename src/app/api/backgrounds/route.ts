import { NextResponse } from 'next/server'

const QUERIES = [
  'nature landscape',
  'mountain sunrise',
  'ocean peaceful',
  'forest light',
  'desert stars',
  'lake reflection',
]

export async function GET() {
  const key = process.env.UNSPLASH_ACCESS_KEY ?? process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY

  if (!key) {
    return NextResponse.json({ images: [] })
  }

  try {
    const query = QUERIES[Math.floor(Math.random() * QUERIES.length)]
    const res = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=squarish&count=6`,
      {
        headers: { Authorization: `Client-ID ${key}` },
        next: { revalidate: 3600 },
      }
    )

    if (!res.ok) return NextResponse.json({ images: [] })

    const data = await res.json()
    const images = (data as Record<string, unknown>[]).map(img => {
      const urls = img.urls as Record<string, string>
      const user = img.user as Record<string, string>
      return {
        id: img.id as string,
        url: urls.regular,
        thumb: urls.thumb,
        credit: user.name,
      }
    })

    return NextResponse.json({ images })
  } catch {
    return NextResponse.json({ images: [] })
  }
}
