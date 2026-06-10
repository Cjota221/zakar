export interface KeyVerse {
  reference: string
  text: string
  bookAbbr: string
  chapter: number
  verse: number
}

export interface MainTopic {
  title: string
  description: string
}

export interface EraContent {
  id: string
  title: string
  subtitle: string
  period: string
  color: string
  icon: string
  coverDescription: string
  keyVerses: KeyVerse[]
  mainTopics: MainTopic[]
  theologians: string[]
  archaeologyFacts: string[]
  suggestedQuestion: string
}

export const ERAS_CONTENT: EraContent[] = [
  {
    id: 'criacao',
    title: 'Criação e Patriarcas',
    subtitle: 'O início de tudo',
    period: '~4000–1800 a.C.',
    color: '#D4AF37',
    icon: '✦',
    coverDescription: 'Da criação do cosmos à formação do povo escolhido. Aqui nascem as promessas fundamentais que moldam toda a narrativa bíblica.',
    keyVerses: [
      { reference: 'Gênesis 1:1', text: 'No princípio Deus criou os céus e a terra.', bookAbbr: 'gn', chapter: 1, verse: 1 },
      { reference: 'Gênesis 12:1-3', text: 'O SENHOR disse a Abrão: Saia da sua terra, do seu povo e da casa de seu pai e vá para a terra que eu lhe mostrarei.', bookAbbr: 'gn', chapter: 12, verse: 1 },
      { reference: 'Gênesis 15:6', text: 'Abrão creu no SENHOR, e isso lhe foi creditado como justiça.', bookAbbr: 'gn', chapter: 15, verse: 6 },
      { reference: 'Gênesis 50:20', text: 'Vocês planejaram o mal contra mim, mas Deus planejou isso para o bem.', bookAbbr: 'gn', chapter: 50, verse: 20 },
    ],
    mainTopics: [
      { title: 'A Criação em 6 Dias', description: 'O debate entre criacionismo literal, criacionismo progressivo e teísmo evolucionista — o que os hebraístas dizem sobre o texto original e o gênero literário de Gênesis 1.' },
      { title: 'A Queda e suas Consequências', description: 'O que Gênesis 3 significa para a teologia do pecado original, a natureza humana e a necessidade de redenção. O proto-evangelho em Gênesis 3:15.' },
      { title: 'O Pacto com Abraão', description: 'A Berith (aliança) de Deus com Abraão e como ela estrutura toda a narrativa bíblica até o Novo Testamento. O que os documentos do Antigo Oriente revelam sobre pactos de suserania.' },
      { title: 'José e a Providência Divina', description: 'Como a história de José revela a soberania de Deus operando através das escolhas humanas — mesmo as mais dolorosas — e o que isso ensina sobre fé em meio ao sofrimento.' },
    ],
    theologians: ['Agostinho de Hipona', 'John Walton', 'Walter Brueggemann', 'Gordon Wenham', 'Derek Kidner'],
    archaeologyFacts: [
      'As tábuas de Ebla (descobertas em 1975) confirmam nomes e práticas culturais do período patriarcal com precisão histórica notável.',
      'O Épico de Gilgamesh, encontrado em Nínive, apresenta paralelos com a narrativa do Dilúvio — mas com diferenças teológicas cruciais que revelam a singularidade do Deus bíblico.',
      'Escavações em Ur dos Caldeus (atual Iraque) revelaram a cidade de onde Abraão partiu — uma metrópole sofisticada com ziggurat dedicada ao deus-lua Nanna.',
    ],
    suggestedQuestion: 'Por que Deus escolheu fazer uma aliança com Abraão, e o que isso revela sobre o caráter de Deus e sua maneira de agir na história?',
  },
  {
    id: 'exodo',
    title: 'Escravidão e Êxodo',
    subtitle: 'A libertação que define um povo',
    period: '~1800–1400 a.C.',
    color: '#C97D4E',
    icon: '◈',
    coverDescription: 'Israel escravizado. Um pastor fugitivo chamado por Deus numa sarça ardente. Dez pragas. O Mar Vermelho. O Monte Sinai. Aqui nasce a identidade de Israel como nação.',
    keyVerses: [
      { reference: 'Êxodo 3:14', text: 'EU SOU O QUE SOU. É isso que você dirá aos israelitas: EU SOU me enviou a vocês.', bookAbbr: 'ex', chapter: 3, verse: 14 },
      { reference: 'Êxodo 12:13', text: 'O sangue servirá de sinal nas casas onde vocês estiverem. Quando eu vir o sangue, passarei por cima de vocês.', bookAbbr: 'ex', chapter: 12, verse: 13 },
      { reference: 'Êxodo 20:2-3', text: 'Eu sou o SENHOR, o seu Deus, que os tirei do Egito, da terra da escravidão. Não tenha outros deuses além de mim.', bookAbbr: 'ex', chapter: 20, verse: 2 },
      { reference: 'Deuteronômio 6:4', text: 'Ouça, ó Israel: O SENHOR nosso Deus, o SENHOR é único.', bookAbbr: 'dt', chapter: 6, verse: 4 },
    ],
    mainTopics: [
      { title: 'O Nome Divino — YHWH', description: 'A profundidade do nome "EU SOU" (Ehyeh Asher Ehyeh) e o que ele revela sobre a natureza eterna e auto-existente de Deus. Como o Tetragrammaton é entendido na tradição judaica e cristã.' },
      { title: 'A Páscoa como Tipologia', description: 'Como o cordeiro pascal, o sangue nas ombreiras e a libertação do Egito prefiguram a obra redentora de Jesus Cristo no Novo Testamento. João 1:29 e 1 Coríntios 5:7.' },
      { title: 'Os Dez Mandamentos e a Lei', description: 'A Torah não como um conjunto de regras para ganhar favor divino, mas como a constituição de um povo que já foi salvo pela graça. A sequência graça-lei em Êxodo 20:2.' },
      { title: 'O Tabernáculo e a Presença de Deus', description: 'Cada elemento do Tabernáculo — o véu, o propiciatório, o pão da proposição, o candelabro — e seu significado teológico e tipológico apontando para Cristo.' },
    ],
    theologians: ['John Durham', 'Umberto Cassuto', 'Brevard Childs', 'Douglas Stuart', 'Alec Motyer'],
    archaeologyFacts: [
      'A Estela de Merneptah (1208 a.C.) é a primeira referência extrabiblica ao nome Israel — uma menção egípcia que confirma a existência do povo.',
      'Escavações em Tell el-Borg revelaram fortalezas egípcias na rota do Êxodo, ajudando a reconstruir os possíveis caminhos percorridos por Moisés e o povo.',
      'Os documentos de Nuzi (século XV a.C.) confirmam práticas legais e sociais descritas no Pentateuco como historicamente precisas para o período patriarcal.',
    ],
    suggestedQuestion: 'Se Deus já havia libertado Israel antes de dar a Lei, o que isso nos ensina sobre a relação entre graça e obediência na vida cristã?',
  },
  {
    id: 'conquista',
    title: 'Conquista e Juízes',
    subtitle: 'Fé, guerra e ciclos de apostasia',
    period: '~1400–1000 a.C.',
    color: '#4A5D23',
    icon: '⬟',
    coverDescription: 'Josué conquista Canaã. Israel vive ciclos de apostasia e resgate pelos Juízes. Uma nação aprendendo — com dificuldade — que depende de Deus.',
    keyVerses: [
      { reference: 'Josué 1:9', text: 'Não fui eu quem ordenei a você? Seja forte e corajoso! Não se apavore nem desanime, pois o SENHOR, o seu Deus, estará com você por onde você andar.', bookAbbr: 'js', chapter: 1, verse: 9 },
      { reference: 'Juízes 2:18', text: 'Sempre que o SENHOR levantava um juiz para eles, o SENHOR estava com o juiz e os livrava das mãos dos inimigos durante toda a vida do juiz.', bookAbbr: 'jz', chapter: 2, verse: 18 },
      { reference: 'Rute 1:16', text: 'Onde você for, eu irei; onde você se hospedar, eu me hospedarei. O seu povo será o meu povo, e o seu Deus, o meu Deus.', bookAbbr: 'rt', chapter: 1, verse: 16 },
    ],
    mainTopics: [
      { title: 'A Conquista de Canaã — Guerra Santa?', description: 'Uma das passagens mais difíceis da Bíblia: o genocídio dos cananeus. O que estudiosos como Christopher Wright e Paul Copan dizem sobre a ética divina nesses textos.' },
      { title: 'O Ciclo dos Juízes', description: 'Apostasia → Opressão → Clamor → Resgate → Paz → Apostasia. O que esse ciclo revela sobre a natureza humana, a paciência de Deus e a necessidade de um rei.' },
      { title: 'Rute — Graça no Meio do Caos', description: 'Como o livro de Rute, situado no período mais sombrio dos Juízes, apresenta uma teologia de hesed (amor leal) e redenção que aponta diretamente para o evangelho.' },
    ],
    theologians: ['Tremper Longman III', 'Daniel Block', 'K. Lawson Younger', 'Robert Hubbard'],
    archaeologyFacts: [
      'Escavações em Hazor (Josué 11) revelaram camadas de destruição datadas do século XIII a.C., consistentes com a narrativa bíblica da conquista.',
      'O sítio de Jericó (Tell es-Sultan) continua sendo debatido — John Garstang e Kathleen Kenyon chegaram a conclusões diferentes sobre a cronologia das ruínas.',
      'Evidências arqueológicas de Laquis (2 Crônicas 32) mostram destruição em camadas consecutivas, confirmando narrativas bíblicas de batalhas.',
    ],
    suggestedQuestion: 'Como reconciliar a imagem de um Deus de amor com as ordens de conquista em Josué? O que os estudiosos contemporâneos dizem sobre isso?',
  },
  {
    id: 'monarquia',
    title: 'Monarquia e Profetas',
    subtitle: 'Reis, guerras e a voz de Deus',
    period: '~1050–586 a.C.',
    color: '#3B82F6',
    icon: '⬡',
    coverDescription: 'Saul, Davi, Salomão. O esplendor do templo. A divisão do reino. E enquanto os reis falham, Deus levanta profetas — Elias, Isaías, Jeremias — que falam palavras que ecoam até hoje.',
    keyVerses: [
      { reference: '2 Samuel 7:12-13', text: 'Quando os seus dias se completarem e você descansar com seus antepassados, estabelecerei o seu descendente depois de você... e estabelecerei o trono do seu reino para sempre.', bookAbbr: '2sm', chapter: 7, verse: 12 },
      { reference: 'Isaías 53:5', text: 'Mas ele foi transpassado por causa das nossas transgressões, foi esmagado por causa das nossas iniquidades.', bookAbbr: 'is', chapter: 53, verse: 5 },
      { reference: 'Jeremias 31:31', text: 'Dias virão, diz o SENHOR, em que farei uma nova aliança com a casa de Israel e com a casa de Judá.', bookAbbr: 'jr', chapter: 31, verse: 31 },
      { reference: 'Miquéias 5:2', text: 'Mas você, Belém Efratá, embora pequena entre os clãs de Judá, de você sairá aquele que será governante em Israel.', bookAbbr: 'mq', chapter: 5, verse: 2 },
    ],
    mainTopics: [
      { title: 'O Pacto Davídico', description: 'A promessa de Deus a Davi de um trono eterno (2 Samuel 7) e como isso estrutura toda a expectativa messiânica do Antigo Testamento até sua realização em Jesus.' },
      { title: 'Por que Deus Permitiu a Divisão do Reino?', description: 'A teologia por trás da divisão após Salomão e o que os livros dos Reis ensinam sobre as consequências da idolatria, da desobediência e da fidelidade da aliança.' },
      { title: 'Isaías 53 — O Servo Sofredor', description: 'O capítulo mais debatido de toda a profecia bíblica. O que ele significa no contexto histórico de Isaías e como o Novo Testamento — e Jesus mesmo — o aplica.' },
      { title: 'Os Profetas e sua Mensagem Urgente', description: 'Por que Amós, Oséias, Miquéias e os outros profetas não são menores em importância — apenas em extensão. Sua crítica social e sua visão de justiça continuam radicalmente relevantes.' },
    ],
    theologians: ['John Oswalt', 'Walter Kaiser', 'Christopher Wright', 'Alec Motyer', 'Klaus Koch'],
    archaeologyFacts: [
      'A Estela da Casa de Davi, descoberta em Tel Dan em 1993, é a primeira referência arqueológica fora da Bíblia ao rei Davi — confirmando definitivamente sua historicidade.',
      'Os Prismas de Senaqueribe (conservados no Museu Britânico) descrevem o cerco de Jerusalém no reinado de Ezequias, confirmando com detalhes 2 Reis 18-19.',
      'O Túnel de Ezequias, escavado sob Jerusalém para garantir água durante o cerco assírio, ainda pode ser visitado hoje — uma prova arqueológica viva de 2 Reis 20:20.',
    ],
    suggestedQuestion: 'Por que Deus escolheu Davi — um adúltero e homicida — para ser o rei segundo seu coração? O que isso revela sobre como Deus avalia e usa pessoas imperfeitas?',
  },
  {
    id: 'exilio',
    title: 'Exílio e Retorno',
    subtitle: 'Na escuridão, a esperança persiste',
    period: '~586–400 a.C.',
    color: '#8B5CF6',
    icon: '◉',
    coverDescription: 'Jerusalém destruída. O Templo em cinzas. Israel levado para a Babilônia. Mas nos escombros, os profetas ainda cantam promessas. E Deus cumpre — Israel retorna.',
    keyVerses: [
      { reference: 'Lamentações 3:22-23', text: 'As misericórdias do SENHOR nunca se acabam! Suas compaixões jamais têm fim. Renovam-se cada manhã; grande é a sua fidelidade!', bookAbbr: 'lm', chapter: 3, verse: 22 },
      { reference: 'Ezequiel 37:4', text: 'Profetize sobre esses ossos e diga-lhes: Ossos secos, ouçam a palavra do SENHOR!', bookAbbr: 'ez', chapter: 37, verse: 4 },
      { reference: 'Daniel 1:8', text: 'Daniel, porém, propôs em seu coração que não se contaminaria com a comida e o vinho do rei.', bookAbbr: 'dn', chapter: 1, verse: 8 },
      { reference: 'Esdras 1:2', text: 'Assim diz Ciro, rei da Pérsia: O SENHOR, o Deus dos céus, me deu todos os reinos da terra e me encarregou de construir um templo para ele em Jerusalém.', bookAbbr: 'ed', chapter: 1, verse: 2 },
    ],
    mainTopics: [
      { title: 'Por que Deus Permitiu a Destruição do Templo?', description: 'A teologia do exílio — como os profetas interpretam o evento mais traumático da história de Israel e o que ele revela sobre a santidade e a misericórdia de Deus.' },
      { title: 'Daniel na Babilônia — Fé sob Pressão', description: 'Como Daniel e seus companheiros mantiveram a identidade de fé em uma cultura que os pressionava a se conformar — e o que isso ensina sobre vida cristã em culturas seculares hoje.' },
      { title: 'A Visão dos Ossos Secos — Ezequiel 37', description: 'Uma das visões mais poderosas da Bíblia. O que ela significou para Israel no exílio e o que ela continua dizendo para situações de morte aparente e esperança improvável.' },
      { title: 'O Édito de Ciro — Deus Usa Pagãos?', description: 'Como Deus usou um rei persa não-israelita para cumprir suas promessas, e o que isso diz sobre a soberania divina sobre toda a história humana — inclusive hoje.' },
    ],
    theologians: ['Daniel Block', 'John Goldingay', 'Iain Duguid', 'Joyce Baldwin', 'Derek Kidner'],
    archaeologyFacts: [
      'O Cilindro de Ciro (Museu Britânico) confirma a política de Ciro de devolver povos deportados às suas terras — exatamente o que Esdras 1 descreve com precisão histórica.',
      'Tábuas babilônicas mencionam rações alimentares distribuídas a "Yaukin, rei de Judá" — confirmando o exílio do rei Joaquim registrado em 2 Reis 25:27-30.',
      'Escavações em Nippur (Babilônia) revelaram documentos de negócios com nomes hebraicos, mostrando que os exilados israelitas prosperaram economicamente na Babilônia.',
    ],
    suggestedQuestion: 'Quando tudo parece destruído e as promessas de Deus parecem ter falhado, o que o exílio de Israel nos ensina sobre como atravessar momentos de trevas na fé?',
  },
  {
    id: 'novo_testamento',
    title: 'Jesus e a Igreja Primitiva',
    subtitle: 'O cumprimento de tudo',
    period: '~4 a.C.–100 d.C.',
    color: '#D4AF37',
    icon: '✦',
    coverDescription: 'Um carpinteiro da Galileia que afirmou ser Deus. Doze discípulos que mudaram o mundo. Cartas escritas em prisões que ainda transformam vidas. O clímax de toda a história bíblica.',
    keyVerses: [
      { reference: 'João 1:14', text: 'O Verbo se fez carne e habitou entre nós. Vimos a sua glória, glória como do Unigênito vindo do Pai, cheio de graça e de verdade.', bookAbbr: 'jo', chapter: 1, verse: 14 },
      { reference: 'Romanos 3:23-24', text: 'Pois todos pecaram e estão destituídos da glória de Deus, sendo justificados gratuitamente por sua graça, por meio da redenção que há em Cristo Jesus.', bookAbbr: 'rm', chapter: 3, verse: 23 },
      { reference: 'Filipenses 2:6-7', text: 'O qual, sendo em forma de Deus, não considerou o ser igual a Deus algo a ser explorado, mas esvaziou-se a si mesmo, assumindo a forma de servo.', bookAbbr: 'fp', chapter: 2, verse: 6 },
      { reference: 'Apocalipse 21:5', text: 'Aquele que estava assentado no trono disse: Estou fazendo novas todas as coisas!', bookAbbr: 'ap', chapter: 21, verse: 5 },
    ],
    mainTopics: [
      { title: 'Quem Jesus Afirmou Ser?', description: 'As afirmações explícitas e implícitas de divindade de Jesus nos Evangelhos — os Sete "EU SOU" em João e o que eles significam no contexto do Êxodo e da identidade divina.' },
      { title: 'A Ressurreição — Fato ou Fé?', description: 'Os argumentos históricos para a ressurreição de Jesus. O que N.T. Wright (em "The Resurrection of the Son of God"), Gary Habermas e outros descobriram analisando as evidências.' },
      { title: 'Paulo e a Justificação pela Fé', description: 'O coração da teologia paulina em Romanos e Gálatas. O debate entre a visão tradicional da Reforma (Lutero, Calvino) e a Nova Perspectiva sobre Paulo (Sanders, Wright, Dunn).' },
      { title: 'O Apocalipse — Terror ou Esperança?', description: 'Como ler Apocalipse corretamente: o gênero apocalíptico, o contexto da perseguição sob Domiciano, e as quatro principais abordagens interpretativas (preterismo, historicismo, idealismo, futurismo).' },
    ],
    theologians: ['N.T. Wright', 'John Stott', 'D.A. Carson', 'Gordon Fee', 'Thomas Schreiner', 'Leon Morris'],
    archaeologyFacts: [
      'O Ossuário de Caifás, descoberto em Jerusalém em 1990, contém os ossos do sumo sacerdote que julgou Jesus — uma confirmação arqueológica direta dos Evangelhos.',
      'Os Manuscritos do Mar Morto (descobertos em 1947) confirmam a integridade do texto do Antigo Testamento usado por Jesus e pelos apóstolos por mais de mil anos.',
      'Inscrições em Corinto mencionam o "açougue" (makellon) e o "tribunal" (bema) — exatamente os locais que Paulo descreve em 1 Coríntios 8 e Atos 18.',
    ],
    suggestedQuestion: 'Se você tivesse que explicar em suas próprias palavras por que a ressurreição de Jesus muda tudo — para a teologia, para a história e para a sua vida — o que diria?',
  },
]
