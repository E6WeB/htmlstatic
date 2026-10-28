-- StaticStack forum schema for PostgreSQL. Run once in the Wasmer database console.
CREATE TABLE IF NOT EXISTS forum_users (
  id BIGSERIAL PRIMARY KEY,
  github_id BIGINT NOT NULL UNIQUE,
  login TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS forum_categories (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS forum_topics (
  id BIGSERIAL PRIMARY KEY,
  category_id BIGINT NOT NULL REFERENCES forum_categories(id),
  user_id BIGINT NOT NULL REFERENCES forum_users(id),
  title VARCHAR(180) NOT NULL,
  body TEXT NOT NULL,
  is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS forum_topics_category_created_idx ON forum_topics(category_id, created_at DESC);
CREATE INDEX IF NOT EXISTS forum_topics_created_idx ON forum_topics(created_at DESC);

CREATE TABLE IF NOT EXISTS forum_replies (
  id BIGSERIAL PRIMARY KEY,
  topic_id BIGINT NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES forum_users(id),
  body TEXT NOT NULL,
  is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS forum_replies_topic_created_idx ON forum_replies(topic_id, created_at ASC);

CREATE TABLE IF NOT EXISTS forum_votes (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES forum_users(id) ON DELETE CASCADE,
  topic_id BIGINT REFERENCES forum_topics(id) ON DELETE CASCADE,
  reply_id BIGINT REFERENCES forum_replies(id) ON DELETE CASCADE,
  value SMALLINT NOT NULL CHECK (value IN (-1, 1)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK ((topic_id IS NOT NULL AND reply_id IS NULL) OR (topic_id IS NULL AND reply_id IS NOT NULL))
);
CREATE UNIQUE INDEX IF NOT EXISTS forum_votes_topic_unique ON forum_votes(user_id, topic_id) WHERE topic_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS forum_votes_reply_unique ON forum_votes(user_id, reply_id) WHERE reply_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS forum_reports (
  id BIGSERIAL PRIMARY KEY,
  reporter_id BIGINT NOT NULL REFERENCES forum_users(id),
  topic_id BIGINT REFERENCES forum_topics(id) ON DELETE CASCADE,
  reply_id BIGINT REFERENCES forum_replies(id) ON DELETE CASCADE,
  reason VARCHAR(500) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  reviewed_by BIGINT REFERENCES forum_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  CHECK ((topic_id IS NOT NULL AND reply_id IS NULL) OR (topic_id IS NULL AND reply_id IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS forum_reports_status_created_idx ON forum_reports(status, created_at DESC);

INSERT INTO forum_categories (slug, name, description) VALUES
 ('help', 'Help and Questions', 'Ask questions about building and maintaining static websites.'),
 ('tools', 'Tools and Components', 'Share useful tools, scripts, libraries, and components.'),
 ('showcase', 'Show and Tell', 'Show the static websites and projects you are building.'),
 ('discussion', 'General Discussion', 'Talk about HTML, CSS, JavaScript, and the static web.')
ON CONFLICT (slug) DO NOTHING;
