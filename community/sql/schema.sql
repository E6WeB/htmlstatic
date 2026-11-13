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
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  is_locked BOOLEAN NOT NULL DEFAULT FALSE,
  is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS forum_topics_category_created_idx ON forum_topics(category_id, created_at DESC);
CREATE INDEX IF NOT EXISTS forum_topics_created_idx ON forum_topics(created_at DESC);
CREATE INDEX IF NOT EXISTS forum_topics_pinned_updated_idx ON forum_topics(is_pinned DESC, updated_at DESC);
CREATE INDEX IF NOT EXISTS forum_topics_visible_updated_idx ON forum_topics(updated_at DESC) WHERE is_hidden = FALSE;

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
CREATE INDEX IF NOT EXISTS forum_replies_visible_topic_idx ON forum_replies(topic_id, created_at ASC) WHERE is_hidden = FALSE;
ALTER TABLE forum_topics ADD COLUMN IF NOT EXISTS accepted_reply_id INTEGER REFERENCES forum_replies(id) ON DELETE SET NULL;

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
CREATE INDEX IF NOT EXISTS idx_forum_votes_topic_id ON forum_votes(topic_id) WHERE topic_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_forum_votes_reply_id ON forum_votes(reply_id) WHERE reply_id IS NOT NULL;

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
 ('announcements', 'Announcements', 'Official news, platform updates, and announcements from StaticStack.'),
 ('help', 'Help and Questions', 'Ask questions about building and maintaining static websites.'),
 ('tools', 'Tools and Components', 'Share useful tools, scripts, libraries, and components.'),
 ('showcase', 'Show and Tell', 'Show the static websites and projects you are building.'),
 ('discussion', 'General Discussion', 'Talk about HTML, CSS, JavaScript, and the static web.'),
 ('support', 'StaticStack Support', 'Question and answer only about the StaticStack website.')
ON CONFLICT (slug) DO NOTHING;

CREATE TABLE IF NOT EXISTS tool_view_ips (
  ip VARCHAR(64) NOT NULL,
  tool_key VARCHAR(128) NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (ip, tool_key)
);
CREATE INDEX IF NOT EXISTS idx_tool_view_ips_time ON tool_view_ips (viewed_at);
CREATE INDEX IF NOT EXISTS idx_tool_view_ips_key ON tool_view_ips (tool_key);

CREATE TABLE IF NOT EXISTS tool_likes (
  tool_slug VARCHAR(160) PRIMARY KEY,
  likes INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tool_like_ips (
  ip VARCHAR(64) NOT NULL,
  tool_slug VARCHAR(160) NOT NULL,
  liked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (ip, tool_slug)
);

CREATE TABLE IF NOT EXISTS user_stack_bookmarks (
  user_id INTEGER NOT NULL,
  tool_slug VARCHAR(160) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, tool_slug)
);

CREATE TABLE IF NOT EXISTS tool_comments (
  id SERIAL PRIMARY KEY,
  tool_slug VARCHAR(160) NOT NULL,
  user_id INTEGER NOT NULL REFERENCES forum_users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tool_comments_slug ON tool_comments (tool_slug, created_at DESC);
