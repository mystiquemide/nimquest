CREATE TABLE IF NOT EXISTS learning_funnel_daily (
  metric_date TEXT NOT NULL,
  quest_id TEXT NOT NULL,
  quiz_attempts INTEGER NOT NULL DEFAULT 0 CHECK (quiz_attempts >= 0),
  quiz_passes INTEGER NOT NULL DEFAULT 0 CHECK (quiz_passes >= 0),
  proof_starts INTEGER NOT NULL DEFAULT 0 CHECK (proof_starts >= 0),
  verified_completions INTEGER NOT NULL DEFAULT 0 CHECK (verified_completions >= 0),
  PRIMARY KEY (metric_date, quest_id)
);
