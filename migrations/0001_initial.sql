CREATE TABLE IF NOT EXISTS completion_challenges (
  id TEXT PRIMARY KEY,
  quest_id TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  device_id TEXT NOT NULL,
  message TEXT NOT NULL,
  issued_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_completion_challenges_expires_at
  ON completion_challenges (expires_at);

CREATE TABLE IF NOT EXISTS completions (
  proof_key TEXT PRIMARY KEY,
  quest_id TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  device_id TEXT NOT NULL,
  public_key TEXT NOT NULL,
  verification_method TEXT NOT NULL,
  completed_at TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status = 'verified'),
  reward_status TEXT NOT NULL CHECK (reward_status = 'unavailable'),
  UNIQUE (quest_id, wallet_address)
);

CREATE INDEX IF NOT EXISTS idx_completions_wallet_completed_at
  ON completions (wallet_address, completed_at DESC);
