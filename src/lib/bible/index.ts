export interface BookMeta {
  abbrev: string
  name: string
  chapters: number
}

export interface BibleBook {
  abbrev: string
  name: string
  chapters: string[][]
}

export async function fetchBookIndex(): Promise<BookMeta[]> {
  const res = await fetch('/bible/index.json')
  return res.json()
}

export async function fetchBook(abbrev: string): Promise<BibleBook> {
  const res = await fetch(`/bible/${abbrev}.json`)
  return res.json()
}

export const TESTAMENT_SPLIT = 39 // AT: 0-38, NT: 39-65

export const BOOK_GROUPS: { label: string; range: [number, number] }[] = [
  { label: 'Pentateuco',      range: [0, 4] },
  { label: 'História',        range: [5, 16] },
  { label: 'Poesia',          range: [17, 21] },
  { label: 'Profetas Maiores',range: [22, 26] },
  { label: 'Profetas Menores',range: [27, 38] },
  { label: 'Evangelhos',      range: [39, 42] },
  { label: 'Atos',            range: [43, 43] },
  { label: 'Cartas de Paulo', range: [44, 56] },
  { label: 'Cartas Gerais',   range: [57, 64] },
  { label: 'Apocalipse',      range: [65, 65] },
]
