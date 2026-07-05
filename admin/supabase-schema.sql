-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS songs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT DEFAULT '',
  key TEXT DEFAULT 'C',
  difficulty TEXT DEFAULT 'Beginner' CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  category TEXT DEFAULT 'Custom',
  gradient TEXT[] DEFAULT ARRAY['#5C1A00', '#1A0800'],
  lines JSONB DEFAULT '[]',
  chords TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER songs_updated_at
  BEFORE UPDATE ON songs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Allow public read/write (tighten later with RLS if needed)
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON songs FOR ALL USING (true) WITH CHECK (true);

-- Closed-testing access requests collected from the public download page.
-- Emails here get added by hand to the Play Console closed-testing tester list.
CREATE TABLE IF NOT EXISTS access_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;
-- No public policies: only the service-role key (used server-side in
-- request-access.post/get.ts) can read or write this table.
