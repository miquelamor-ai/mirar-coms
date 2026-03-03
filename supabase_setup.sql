-- ==========================================
-- COMS Interactive Presentation Setup
-- ==========================================

-- 1. Taula per sincronitzar el flux de la presentació
CREATE TABLE IF NOT EXISTS coms_session_state (
  id integer PRIMARY KEY DEFAULT 1,
  current_slide_id text NOT NULL DEFAULT 'mirada-fora',
  is_voting_open boolean DEFAULT false,
  updated_at timestamptz DEFAULT now()
);

-- Inserir estat inicial (només un registre permès)
INSERT INTO coms_session_state (id, current_slide_id) 
VALUES (1, 'mirada-fora') 
ON CONFLICT (id) DO NOTHING;

-- 2. Taula per recollir vots i decisions estratègiques
CREATE TABLE IF NOT EXISTS coms_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slide_id text NOT NULL,
  proposal_id text NOT NULL, -- 'general' o l'ID del COMS específic
  choice text NOT NULL, -- 'confirmar', 'dubtar', 'denegar' O 'activar', 'pilotar', 'preparar', etc.
  created_at timestamptz DEFAULT now()
);

-- 3. Taula per a les aportacions noves de l'audiència
CREATE TABLE IF NOT EXISTS coms_contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slide_id text NOT NULL,
  content text NOT NULL,
  status text DEFAULT 'pending', -- 'pending', 'approved'
  created_at timestamptz DEFAULT now()
);

-- 4. Habilitar Realtime (Imprescindible per a la sincronització en temps real)
-- Nota: Hauràs d'activar el broadcast per a aquestes taules al Dashboard de Supabase
-- o executar això si la publicació existeix:
ALTER PUBLICATION supabase_realtime ADD TABLE coms_session_state;
ALTER PUBLICATION supabase_realtime ADD TABLE coms_votes;
ALTER PUBLICATION supabase_realtime ADD TABLE coms_contributions;
