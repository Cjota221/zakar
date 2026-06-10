export interface BibleEvent {
  year: string
  event: string
}

export interface BibleEra {
  id: string
  era: string
  period: string
  color: string
  books: string[]
  description: string
  events: BibleEvent[]
}

export const BIBLE_TIMELINE: BibleEra[] = [
  {
    id: 'criacao',
    era: 'Criação e Patriarcas',
    period: '~4000–1800 a.C.',
    color: '#D4AF37',
    books: ['gn', 'jó'],
    description: 'Da criação do mundo à história de Abraão, Isaque, Jacó e José.',
    events: [
      { year: '~4000 a.C.', event: 'A Criação' },
      { year: '~2350 a.C.', event: 'O Dilúvio — Noé' },
      { year: '~2000 a.C.', event: 'A Chamada de Abraão' },
      { year: '~1876 a.C.', event: 'José e Israel no Egito' },
    ],
  },
  {
    id: 'exodo',
    era: 'Escravidão e Êxodo',
    period: '~1800–1400 a.C.',
    color: '#C97D4E',
    books: ['ex', 'lv', 'nm', 'dt'],
    description: 'Israel escravizado no Egito, Moisés, as pragas e a travessia do Mar Vermelho.',
    events: [
      { year: '~1526 a.C.', event: 'Nascimento de Moisés' },
      { year: '~1446 a.C.', event: 'O Êxodo do Egito' },
      { year: '~1446 a.C.', event: 'A Lei no Monte Sinai' },
    ],
  },
  {
    id: 'conquista',
    era: 'Conquista e Juízes',
    period: '~1400–1000 a.C.',
    color: '#4A5D23',
    books: ['js', 'jz', 'rt'],
    description: 'Josué conquista Canaã. Israel vive ciclos de apostasia e resgate pelos Juízes.',
    events: [
      { year: '~1406 a.C.', event: 'Conquista de Canaã — Josué' },
      { year: '~1375–1050 a.C.', event: 'Período dos Juízes' },
      { year: '~1100 a.C.', event: 'Sansão e os Filisteus' },
    ],
  },
  {
    id: 'monarquia',
    era: 'Monarquia Unida e Dividida',
    period: '~1050–586 a.C.',
    color: '#3B82F6',
    books: [
      '1sm', '2sm', '1rs', '2rs', '1cr', '2cr',
      'sl', 'pv', 'ec', 'ct',
      'is', 'jr', 'lm', 'ez', 'dn',
      'os', 'jl', 'am', 'ob', 'jn', 'mq', 'na', 'hc', 'sf', 'ag', 'zc', 'ml',
    ],
    description: 'Saul, Davi e Salomão. Divisão do Reino. Os Profetas falam ao povo.',
    events: [
      { year: '~1050 a.C.', event: 'Saul — Primeiro Rei de Israel' },
      { year: '~1010 a.C.', event: 'Davi se torna Rei' },
      { year: '~970 a.C.', event: 'Salomão e o Templo' },
      { year: '~930 a.C.', event: 'Divisão do Reino' },
      { year: '~740 a.C.', event: 'Ministério de Isaías' },
      { year: '~722 a.C.', event: 'Queda do Reino do Norte' },
      { year: '~627 a.C.', event: 'Ministério de Jeremias' },
      { year: '~605 a.C.', event: 'Daniel levado à Babilônia' },
    ],
  },
  {
    id: 'exilio',
    era: 'Exílio e Retorno',
    period: '~586–400 a.C.',
    color: '#8B5CF6',
    books: ['ed', 'ne', 'et'],
    description: 'Queda de Jerusalém. Exílio na Babilônia. Esdras e Neemias lideram o retorno.',
    events: [
      { year: '586 a.C.', event: 'Destruição de Jerusalém' },
      { year: '~538 a.C.', event: 'Édito de Ciro — Retorno' },
      { year: '~444 a.C.', event: 'Neemias reconstrói o muro' },
    ],
  },
  {
    id: 'intertestamental',
    era: 'Período Intertestamental',
    period: '~400–4 a.C.',
    color: '#64748B',
    books: [],
    description: '400 anos de silêncio profético. O povo aguarda o Messias prometido.',
    events: [
      { year: '~330 a.C.', event: 'Conquista de Alexandre o Grande' },
      { year: '~165 a.C.', event: 'Revolta dos Macabeus' },
      { year: '~63 a.C.', event: 'Roma ocupa Jerusalém' },
    ],
  },
  {
    id: 'novo_testamento',
    era: 'Novo Testamento e Igreja',
    period: '~4 a.C.–100 d.C.',
    color: '#D4AF37',
    books: [
      'mt', 'mc', 'lc', 'jo', 'at',
      'rm', '1co', '2co', 'gl', 'ef', 'fp', 'cl',
      '1ts', '2ts', '1tm', '2tm', 'tt', 'fm',
      'hb', 'tg', '1pe', '2pe', '1jo', '2jo', '3jo', 'jd', 'ap',
    ],
    description: 'O nascimento, ministério, morte e ressurreição de Jesus. A fundação da Igreja.',
    events: [
      { year: '~4 a.C.', event: 'Nascimento de Jesus' },
      { year: '~27 d.C.', event: 'Batismo e início do ministério' },
      { year: '~30 d.C.', event: 'Crucificação e Ressurreição' },
      { year: '~30 d.C.', event: 'Pentecostes — fundação da Igreja' },
      { year: '~48–65 d.C.', event: 'Cartas de Paulo' },
      { year: '~95 d.C.', event: 'Apocalipse — João em Patmos' },
    ],
  },
]

export function getEraForBook(bookAbbr: string): BibleEra | undefined {
  return BIBLE_TIMELINE.find(era =>
    era.books.includes(bookAbbr.toLowerCase())
  )
}
