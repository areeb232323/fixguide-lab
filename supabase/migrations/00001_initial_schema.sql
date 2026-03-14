-- FixGuide Lab: Initial Database Schema
-- Roles: guest (anonymous), user, contributor, moderator, admin

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE testing_status AS ENUM ('Draft', 'InternallyTested', 'CommunityVerified');
CREATE TYPE difficulty     AS ENUM ('Beginner', 'Intermediate', 'Advanced');
CREATE TYPE user_role      AS ENUM ('guest', 'user', 'contributor', 'moderator', 'admin');
CREATE TYPE report_reason  AS ENUM ('inaccurate', 'unsafe', 'spam', 'harassment', 'other');
CREATE TYPE report_status  AS ENUM ('pending', 'reviewing', 'resolved', 'dismissed');
CREATE TYPE mod_action_type AS ENUM ('hide_content', 'warn_user', 'ban_user', 'dismiss_report', 'edit_content', 'restore_content');
CREATE TYPE content_type   AS ENUM ('guide', 'project', 'comment');
CREATE TYPE os_type        AS ENUM ('Windows', 'Linux', 'macOS', 'Any');

-- ============================================================
-- USER PROFILES
-- ============================================================

CREATE TABLE user_profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        TEXT NOT NULL,
  display_name TEXT NOT NULL DEFAULT '',
  role         user_role NOT NULL DEFAULT 'user',
  avatar_url   TEXT,
  bio          TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_profiles_role ON user_profiles(role);

-- ============================================================
-- GUIDES
-- ============================================================

CREATE TABLE guides (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                  TEXT NOT NULL UNIQUE,
  title                 TEXT NOT NULL,
  summary               TEXT NOT NULL DEFAULT '',
  content_markdown      TEXT NOT NULL DEFAULT '',
  difficulty            difficulty NOT NULL DEFAULT 'Beginner',
  time_estimate_minutes INTEGER NOT NULL DEFAULT 30,
  os                    os_type NOT NULL DEFAULT 'Any',
  tags                  TEXT[] NOT NULL DEFAULT '{}',
  testing_status        testing_status NOT NULL DEFAULT 'Draft',
  last_reviewed_date    TIMESTAMPTZ,
  author_id             UUID NOT NULL REFERENCES user_profiles(id),
  published             BOOLEAN NOT NULL DEFAULT false,
  hidden                BOOLEAN NOT NULL DEFAULT false,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_guides_slug       ON guides(slug);
CREATE INDEX idx_guides_published  ON guides(published, hidden);
CREATE INDEX idx_guides_created    ON guides(created_at DESC);
CREATE INDEX idx_guides_tags       ON guides USING GIN(tags);
CREATE INDEX idx_guides_search     ON guides USING GIN(
  (to_tsvector('english', title) || to_tsvector('english', summary))
);

-- ============================================================
-- PROJECTS
-- ============================================================

CREATE TABLE projects (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                  TEXT NOT NULL UNIQUE,
  title                 TEXT NOT NULL,
  summary               TEXT NOT NULL DEFAULT '',
  content_markdown      TEXT NOT NULL DEFAULT '',
  difficulty            difficulty NOT NULL DEFAULT 'Beginner',
  time_estimate_minutes INTEGER NOT NULL DEFAULT 60,
  cost_range_min        NUMERIC(10,2) NOT NULL DEFAULT 0,
  cost_range_max        NUMERIC(10,2) NOT NULL DEFAULT 0,
  tags                  TEXT[] NOT NULL DEFAULT '{}',
  testing_status        testing_status NOT NULL DEFAULT 'Draft',
  last_reviewed_date    TIMESTAMPTZ,
  author_id             UUID NOT NULL REFERENCES user_profiles(id),
  published             BOOLEAN NOT NULL DEFAULT false,
  hidden                BOOLEAN NOT NULL DEFAULT false,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_projects_slug      ON projects(slug);
CREATE INDEX idx_projects_published ON projects(published, hidden);
CREATE INDEX idx_projects_created   ON projects(created_at DESC);
CREATE INDEX idx_projects_tags      ON projects USING GIN(tags);
CREATE INDEX idx_projects_search    ON projects USING GIN(
  (to_tsvector('english', title) || to_tsvector('english', summary))
);

-- ============================================================
-- PARTS
-- ============================================================

CREATE TABLE parts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price_budget NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_best   NUMERIC(10,2) NOT NULL DEFAULT 0,
  url         TEXT,
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_parts_project ON parts(project_id);

-- ============================================================
-- COMMENTS / NOTES
-- ============================================================

CREATE TABLE comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  body        TEXT NOT NULL,
  author_id   UUID NOT NULL REFERENCES user_profiles(id),
  target_type content_type NOT NULL,
  target_id   UUID NOT NULL,
  hidden      BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_comments_target ON comments(target_type, target_id);
CREATE INDEX idx_comments_author ON comments(author_id);

-- ============================================================
-- VOTES
-- ============================================================

CREATE TABLE votes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES user_profiles(id),
  target_type content_type NOT NULL,
  target_id   UUID NOT NULL,
  value       SMALLINT NOT NULL CHECK (value IN (1, -1)),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, target_type, target_id)
);

CREATE INDEX idx_votes_target ON votes(target_type, target_id);

-- ============================================================
-- VERIFICATION LOGS
-- ============================================================

CREATE TABLE verification_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type content_type NOT NULL,
  target_id   UUID NOT NULL,
  author_id   UUID NOT NULL REFERENCES user_profiles(id),
  notes       TEXT NOT NULL DEFAULT '',
  photo_urls  TEXT[] NOT NULL DEFAULT '{}',
  verified    BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_verification_target ON verification_logs(target_type, target_id);

-- ============================================================
-- REPORTS
-- ============================================================

CREATE TABLE reports (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES user_profiles(id),
  target_type content_type NOT NULL,
  target_id   UUID NOT NULL,
  reason      report_reason NOT NULL,
  details     TEXT NOT NULL DEFAULT '',
  status      report_status NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reports_status  ON reports(status);
CREATE INDEX idx_reports_target  ON reports(target_type, target_id);
CREATE INDEX idx_reports_created ON reports(created_at DESC);

-- ============================================================
-- MODERATOR ACTIONS (audit log)
-- ============================================================

CREATE TABLE moderator_actions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  moderator_id  UUID NOT NULL REFERENCES user_profiles(id),
  report_id     UUID REFERENCES reports(id),
  action_type   mod_action_type NOT NULL,
  target_type   content_type NOT NULL,
  target_id     UUID NOT NULL,
  reason        TEXT NOT NULL DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_mod_actions_moderator ON moderator_actions(moderator_id);
CREATE INDEX idx_mod_actions_created   ON moderator_actions(created_at DESC);

-- ============================================================
-- AI ASSISTANT FEEDBACK
-- ============================================================

CREATE TABLE assistant_feedback (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES user_profiles(id),
  conversation_id UUID,
  thumbs_up       BOOLEAN NOT NULL,
  reason          TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- OFFICIAL SOURCES (for AI citation safety)
-- ============================================================

CREATE TABLE official_sources (
  id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url   TEXT NOT NULL,
  topic TEXT NOT NULL DEFAULT ''
);

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP (trigger)
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_guides_updated_at     BEFORE UPDATE ON guides     FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_projects_updated_at   BEFORE UPDATE ON projects   FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_comments_updated_at   BEFORE UPDATE ON comments   FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_reports_updated_at    BEFORE UPDATE ON reports    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_profiles_updated_at   BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
