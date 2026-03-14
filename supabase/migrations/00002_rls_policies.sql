-- FixGuide Lab: Row Level Security Policies

-- ============================================================
-- ENABLE RLS
-- ============================================================

ALTER TABLE user_profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides            ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects          ENABLE ROW LEVEL SECURITY;
ALTER TABLE parts             ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes             ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports           ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderator_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistant_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE official_sources  ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- HELPER: check role
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role AS $$
  SELECT COALESCE(
    (SELECT role FROM public.user_profiles WHERE id = auth.uid()),
    'guest'::user_role
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_moderator_or_admin()
RETURNS BOOLEAN AS $$
  SELECT public.get_user_role() IN ('moderator', 'admin');
$$ LANGUAGE sql STABLE;

-- ============================================================
-- USER PROFILES
-- ============================================================

CREATE POLICY "Profiles are viewable by everyone"
  ON user_profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- GUIDES
-- ============================================================

CREATE POLICY "Published non-hidden guides are viewable by everyone"
  ON guides FOR SELECT USING (
    (published = true AND hidden = false)
    OR author_id = auth.uid()
    OR public.is_moderator_or_admin()
  );

CREATE POLICY "Contributors can create guides"
  ON guides FOR INSERT WITH CHECK (
    auth.uid() = author_id
    AND public.get_user_role() IN ('contributor', 'moderator', 'admin')
  );

CREATE POLICY "Authors can update own guides"
  ON guides FOR UPDATE USING (
    author_id = auth.uid() OR public.is_moderator_or_admin()
  );

-- ============================================================
-- PROJECTS
-- ============================================================

CREATE POLICY "Published non-hidden projects are viewable by everyone"
  ON projects FOR SELECT USING (
    (published = true AND hidden = false)
    OR author_id = auth.uid()
    OR public.is_moderator_or_admin()
  );

CREATE POLICY "Contributors can create projects"
  ON projects FOR INSERT WITH CHECK (
    auth.uid() = author_id
    AND public.get_user_role() IN ('contributor', 'moderator', 'admin')
  );

CREATE POLICY "Authors can update own projects"
  ON projects FOR UPDATE USING (
    author_id = auth.uid() OR public.is_moderator_or_admin()
  );

-- ============================================================
-- PARTS
-- ============================================================

CREATE POLICY "Parts are viewable with their project"
  ON parts FOR SELECT USING (true);

CREATE POLICY "Contributors can manage parts for their projects"
  ON parts FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = parts.project_id
      AND (projects.author_id = auth.uid() OR public.is_moderator_or_admin())
    )
  );

-- ============================================================
-- COMMENTS
-- ============================================================

CREATE POLICY "Non-hidden comments are viewable"
  ON comments FOR SELECT USING (
    hidden = false OR author_id = auth.uid() OR public.is_moderator_or_admin()
  );

CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT WITH CHECK (
    auth.uid() = author_id AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Authors can update own comments"
  ON comments FOR UPDATE USING (
    author_id = auth.uid() OR public.is_moderator_or_admin()
  );

-- ============================================================
-- VOTES
-- ============================================================

CREATE POLICY "Votes are viewable"
  ON votes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote"
  ON votes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can change own votes"
  ON votes FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can remove own votes"
  ON votes FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- VERIFICATION LOGS
-- ============================================================

CREATE POLICY "Verification logs are viewable"
  ON verification_logs FOR SELECT USING (true);

CREATE POLICY "Authenticated users can submit verification"
  ON verification_logs FOR INSERT WITH CHECK (auth.uid() = author_id);

-- ============================================================
-- REPORTS
-- ============================================================

CREATE POLICY "Users can see own reports"
  ON reports FOR SELECT USING (
    reporter_id = auth.uid() OR public.is_moderator_or_admin()
  );

CREATE POLICY "Authenticated users can create reports"
  ON reports FOR INSERT WITH CHECK (
    auth.uid() = reporter_id AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Moderators can update reports"
  ON reports FOR UPDATE USING (public.is_moderator_or_admin());

-- ============================================================
-- MODERATOR ACTIONS
-- ============================================================

CREATE POLICY "Moderators can view actions"
  ON moderator_actions FOR SELECT USING (public.is_moderator_or_admin());

CREATE POLICY "Moderators can create actions"
  ON moderator_actions FOR INSERT WITH CHECK (
    auth.uid() = moderator_id AND public.is_moderator_or_admin()
  );

-- ============================================================
-- ASSISTANT FEEDBACK
-- ============================================================

CREATE POLICY "Users can insert feedback"
  ON assistant_feedback FOR INSERT WITH CHECK (
    user_id IS NULL OR auth.uid() = user_id
  );

CREATE POLICY "Admins can read feedback"
  ON assistant_feedback FOR SELECT USING (public.is_moderator_or_admin());

-- ============================================================
-- OFFICIAL SOURCES
-- ============================================================

CREATE POLICY "Official sources are viewable by everyone"
  ON official_sources FOR SELECT USING (true);

CREATE POLICY "Only admins can manage official sources"
  ON official_sources FOR ALL USING (
    public.get_user_role() = 'admin'
  );
