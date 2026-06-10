-- Anotações de estudo do usuário
CREATE TABLE IF NOT EXISTS study_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  era_id TEXT NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  verse_reference TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE study_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "study_notes_own" ON study_notes;
CREATE POLICY "study_notes_own" ON study_notes FOR ALL USING (auth.uid() = user_id);

-- Histórico de chat com o Professor
CREATE TABLE IF NOT EXISTS theology_chat (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  era_id TEXT,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE theology_chat ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "theology_chat_own" ON theology_chat;
CREATE POLICY "theology_chat_own" ON theology_chat FOR ALL USING (auth.uid() = user_id);

-- Progresso de estudo por era
CREATE TABLE IF NOT EXISTS era_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  era_id TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_studied_at TIMESTAMPTZ DEFAULT NOW(),
  notes_count INTEGER DEFAULT 0,
  messages_count INTEGER DEFAULT 0,
  UNIQUE(user_id, era_id)
);

ALTER TABLE era_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "era_progress_own" ON era_progress;
CREATE POLICY "era_progress_own" ON era_progress FOR ALL USING (auth.uid() = user_id);
