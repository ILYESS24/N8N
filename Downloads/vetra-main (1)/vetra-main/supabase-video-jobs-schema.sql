-- Schema pour les jobs de génération vidéo IA
-- À exécuter dans Supabase SQL Editor après supabase-schema.sql et supabase-schema-extended.sql

-- Table pour les jobs de génération vidéo
CREATE TABLE IF NOT EXISTS video_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool VARCHAR(50) NOT NULL CHECK (tool IN ('mochi', 'open-sora', 'wan')),
  prompt TEXT NOT NULL,
  config JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
  result_url TEXT,
  thumbnail_url TEXT,
  metadata JSONB DEFAULT '{}',
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes pour performance
CREATE INDEX IF NOT EXISTS idx_video_jobs_user_id ON video_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_video_jobs_status ON video_jobs(status);
CREATE INDEX IF NOT EXISTS idx_video_jobs_tool ON video_jobs(tool);
CREATE INDEX IF NOT EXISTS idx_video_jobs_created_at ON video_jobs(created_at DESC);

-- RLS Policies
ALTER TABLE video_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own video jobs" ON video_jobs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own video jobs" ON video_jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own video jobs" ON video_jobs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own video jobs" ON video_jobs
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger pour updated_at
CREATE TRIGGER update_video_jobs_updated_at BEFORE UPDATE ON video_jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour nettoyer les jobs anciens (plus de 90 jours)
CREATE OR REPLACE FUNCTION cleanup_old_video_jobs()
RETURNS void AS $$
BEGIN
  DELETE FROM video_jobs 
  WHERE created_at < NOW() - INTERVAL '90 days' 
    AND status IN ('completed', 'failed');
END;
$$ LANGUAGE plpgsql;

