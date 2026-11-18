-- One row per page view. No IP addresses or cookies are stored.
CREATE TABLE IF NOT EXISTS views (
  pid TEXT PRIMARY KEY,      -- random id per page view
  sid TEXT NOT NULL,         -- random id per browser tab session (sessionStorage)
  ts INTEGER NOT NULL,       -- unix ms
  path TEXT, title TEXT, ref TEXT,
  country TEXT, region TEXT, city TEXT, device TEXT,
  dur INTEGER NOT NULL DEFAULT 0  -- visible seconds on the page
);
CREATE INDEX IF NOT EXISTS views_ts ON views(ts);
CREATE INDEX IF NOT EXISTS views_sid ON views(sid);
