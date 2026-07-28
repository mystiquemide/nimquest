ALTER TABLE completions ADD COLUMN public_id TEXT;
ALTER TABLE completions ADD COLUMN feedback_token_hash TEXT;

UPDATE completions
SET public_id = lower(hex(randomblob(16)))
WHERE public_id IS NULL;

UPDATE completion_challenges
SET device_id = 'removed';

UPDATE completions
SET device_id = 'removed';

CREATE UNIQUE INDEX IF NOT EXISTS idx_completions_public_id
  ON completions (public_id);

CREATE TABLE IF NOT EXISTS request_limits (
  key_hash TEXT PRIMARY KEY,
  route TEXT NOT NULL,
  window_start INTEGER NOT NULL,
  request_count INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_request_limits_window_start
  ON request_limits (window_start);
