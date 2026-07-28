CREATE TABLE IF NOT EXISTS completion_feedback (
  proof_key TEXT PRIMARY KEY,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 3),
  note TEXT NOT NULL DEFAULT '',
  submitted_at TEXT NOT NULL,
  FOREIGN KEY (proof_key) REFERENCES completions (proof_key) ON DELETE CASCADE
);
