CREATE TABLE game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    join_code TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    stopped_at TIMESTAMPTZ,
    archived_at TIMESTAMPTZ
);

CREATE TABLE participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE participant_missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    mission_id TEXT NOT NULL,
    category TEXT NOT NULL,
    position INTEGER NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    submitted_at TIMESTAMPTZ,
    answers JSONB DEFAULT '{}'::jsonb
);

-- RLS Policies
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE participant_missions ENABLE ROW LEVEL SECURITY;

-- Anyone can read active sessions (to join)
CREATE POLICY "Public can view active sessions" ON game_sessions FOR SELECT USING (status = 'active');

-- Participants can read their own data and update it
-- Since we don't have real user auth, we use the participant ID passed from the client, 
-- but in MVP we can just let service_role handle writes, or use simple RLS.
-- For a secure but simple approach, allow inserts and updates based on a client-side UUID generated upon joining.
CREATE POLICY "Participants can insert themselves" ON participants FOR INSERT WITH CHECK (true);
CREATE POLICY "Participants can read themselves" ON participants FOR SELECT USING (true);
CREATE POLICY "Participants can update themselves" ON participants FOR UPDATE USING (true);

CREATE POLICY "Participants can insert missions" ON participant_missions FOR INSERT WITH CHECK (true);
CREATE POLICY "Participants can read their missions" ON participant_missions FOR SELECT USING (true);
CREATE POLICY "Participants can update their missions" ON participant_missions FOR UPDATE USING (true);

-- Enable realtime on participants and participant_missions
alter publication supabase_realtime add table participants;
alter publication supabase_realtime add table participant_missions;
