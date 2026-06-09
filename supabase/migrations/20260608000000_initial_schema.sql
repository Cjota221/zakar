-- =============================================
-- ZAKAR APP — Schema completo do banco de dados
-- Executar no Supabase: SQL Editor > New query
-- =============================================

-- Extensão para busca vetorial (RAG)
CREATE EXTENSION IF NOT EXISTS vector;

-- ─── PERFIL DO USUÁRIO ───────────────────────────────────────────────
CREATE TABLE user_profiles (
  id                 UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name               TEXT,
  life_stage         TEXT CHECK (life_stage IN ('restarting','purpose','growing','struggling','stable')),
  reading_frequency  TEXT CHECK (reading_frequency IN ('daily','some_days','weekends')),
  bible_familiarity  TEXT CHECK (bible_familiarity IN ('beginner','casual','regular','advanced')),
  preferred_hour     TIME DEFAULT '07:00',
  timezone           TEXT DEFAULT 'America/Sao_Paulo',
  denomination       TEXT,
  xp                 INTEGER DEFAULT 0,
  level              INTEGER DEFAULT 1,
  streak_current     INTEGER DEFAULT 0,
  streak_best        INTEGER DEFAULT 0,
  streak_protected   BOOLEAN DEFAULT FALSE,
  last_read_at       TIMESTAMPTZ,
  plan               TEXT DEFAULT 'free' CHECK (plan IN ('free','pro')),
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

-- ─── FRAGMENTOS DE MEMÓRIA SEMÂNTICA (RAG) ───────────────────────────
CREATE TABLE memory_fragments (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  content        TEXT NOT NULL,
  embedding      VECTOR(1536),
  type           TEXT CHECK (type IN ('conversa','contexto_vida','favorito','reflexao')),
  source_book    TEXT,
  source_chapter INTEGER,
  source_verse   INTEGER,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX ON memory_fragments USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- ─── DEVOCIONAIS — DESPERTAR ZAKAR ───────────────────────────────────
CREATE TABLE devotionals (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  date                DATE NOT NULL,
  verse_reference     TEXT,
  verse_text          TEXT,
  content             TEXT,
  reflection_question TEXT,
  action_of_day       TEXT,
  agent_used          TEXT DEFAULT 'despertar',
  read_at             TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- ─── PROGRESSO DE LEITURA ─────────────────────────────────────────────
CREATE TABLE reading_progress (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  book_abbreviation   TEXT NOT NULL,
  chapter             INTEGER NOT NULL,
  completed_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, book_abbreviation, chapter)
);

-- ─── VERSÍCULOS FAVORITOS ─────────────────────────────────────────────
CREATE TABLE favorites (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  book_abbreviation TEXT NOT NULL,
  chapter           INTEGER NOT NULL,
  verse             INTEGER NOT NULL,
  verse_text        TEXT,
  note              TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, book_abbreviation, chapter, verse)
);

-- ─── JORNADAS ─────────────────────────────────────────────────────────
CREATE TABLE journeys (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  description     TEXT,
  theme           TEXT,
  cover_image_url TEXT,
  days_count      INTEGER DEFAULT 7,
  difficulty      TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner','intermediate','advanced')),
  is_pro          BOOLEAN DEFAULT FALSE,
  order_index     INTEGER,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── DIAS DE CADA JORNADA ─────────────────────────────────────────────
CREATE TABLE journey_days (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id        UUID NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,
  day_number        INTEGER NOT NULL,
  title             TEXT,
  book_abbreviation TEXT,
  chapter_start     INTEGER,
  verse_start       INTEGER,
  chapter_end       INTEGER,
  verse_end         INTEGER,
  context_prompt    TEXT,
  UNIQUE(journey_id, day_number)
);

-- ─── PROGRESSO DO USUÁRIO NAS JORNADAS ───────────────────────────────
CREATE TABLE user_journey_progress (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  journey_id   UUID NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,
  current_day  INTEGER DEFAULT 1,
  status       TEXT DEFAULT 'active' CHECK (status IN ('active','completed','abandoned')),
  started_at   TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, journey_id)
);

-- ─── RESULTADOS DE QUIZZES ────────────────────────────────────────────
CREATE TABLE quiz_results (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  journey_day_id  UUID REFERENCES journey_days(id),
  questions       JSONB,
  score           INTEGER CHECK (score >= 0 AND score <= 100),
  xp_earned       INTEGER DEFAULT 0,
  completed_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── BADGES CONQUISTADOS ──────────────────────────────────────────────
CREATE TABLE user_badges (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  badge_id  TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- ─── LOGS DE CONVERSA COM AGENTES ────────────────────────────────────
CREATE TABLE chat_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  agent           TEXT NOT NULL CHECK (agent IN ('historiador','conselheiro','doutrinador','especialista','despertar')),
  user_message    TEXT,
  agent_response  TEXT,
  context_book    TEXT,
  context_chapter INTEGER,
  context_verse   INTEGER,
  tokens_used     INTEGER,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────────────
ALTER TABLE user_profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_fragments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE devotionals           ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress      ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites             ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_journey_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results          ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges           ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_logs             ENABLE ROW LEVEL SECURITY;
ALTER TABLE journeys              ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_days          ENABLE ROW LEVEL SECURITY;

-- Usuário acessa apenas seus próprios dados
CREATE POLICY "own_data" ON user_profiles         FOR ALL USING (auth.uid() = id);
CREATE POLICY "own_data" ON memory_fragments      FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_data" ON devotionals           FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_data" ON reading_progress      FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_data" ON favorites             FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_data" ON user_journey_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_data" ON quiz_results          FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_data" ON user_badges           FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_data" ON chat_logs             FOR ALL USING (auth.uid() = user_id);

-- Jornadas são públicas (qualquer usuário autenticado pode ver)
CREATE POLICY "public_read" ON journeys     FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "public_read" ON journey_days FOR SELECT USING (auth.role() = 'authenticated');

-- ─── FUNÇÃO: atualizar updated_at automaticamente ────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── FUNÇÃO: criar perfil automaticamente após signup ────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── SEED: jornadas iniciais do MVP ──────────────────────────────────
INSERT INTO journeys (title, description, theme, days_count, difficulty, is_pro, order_index) VALUES
  ('Fundamentos da Fé',          'Para quem está começando a jornada bíblica',      'fundamentos',   7, 'beginner',     FALSE, 1),
  ('Quando a Vida Dói',          'Salmos e Jó para momentos de dificuldade',         'sofrimento',    7, 'beginner',     FALSE, 2),
  ('Mulheres que Mudaram a História', 'Rute, Ester, Maria e Madalena',               'mulheres',      7, 'intermediate', FALSE, 3),
  ('Jesus: Quem é Esse Homem?',  'Os 4 evangelhos em perspectiva',                  'jesus',         7, 'beginner',     FALSE, 4),
  ('Coragem para Agir',          'Josué, Neemias e Paulo sobre ação e fé',           'coragem',       7, 'intermediate', TRUE,  5);

-- ─── FUNÇÃO: busca semântica por similaridade (RAG) ──────────────────
CREATE OR REPLACE FUNCTION search_memory(
  p_user_id    UUID,
  p_embedding  VECTOR(1536),
  p_limit      INT DEFAULT 5
)
RETURNS TABLE (
  id          UUID,
  content     TEXT,
  type        TEXT,
  similarity  FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    mf.id,
    mf.content,
    mf.type,
    1 - (mf.embedding <=> p_embedding) AS similarity
  FROM memory_fragments mf
  WHERE mf.user_id = p_user_id
    AND mf.embedding IS NOT NULL
  ORDER BY mf.embedding <=> p_embedding
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;
