-- ─── Helper: reads profiles as postgres to avoid RLS recursion
CREATE OR REPLACE FUNCTION auth_is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  )
$$;


-- ════════════════════════════════
-- profiles
-- ════════════════════════════════
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users read their own profile; admins read all
CREATE POLICY "profiles_select" ON profiles
  FOR SELECT USING (
    auth.uid() = id OR auth_is_admin()
  );

-- Only admin can update profiles
-- (payment verify uses service role and bypasses RLS)
CREATE POLICY "profiles_update" ON profiles
  FOR UPDATE USING (auth_is_admin());

-- Only admin can delete profiles
CREATE POLICY "profiles_delete" ON profiles
  FOR DELETE USING (auth_is_admin());

-- No INSERT policy: client inserts blocked; DB trigger runs as postgres and bypasses RLS


-- ════════════════════════════════
-- missing_persons
-- ════════════════════════════════
ALTER TABLE missing_persons ENABLE ROW LEVEL SECURITY;

-- Public can read active records (search page); owner sees their own; admin sees all
CREATE POLICY "missing_persons_select" ON missing_persons
  FOR SELECT USING (
    status = 'active'
    OR reported_by = auth.uid()
    OR auth_is_admin()
  );

-- Only paid family members can insert reports
CREATE POLICY "missing_persons_insert" ON missing_persons
  FOR INSERT WITH CHECK (
    reported_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'family'
      AND payment_done = true
    )
  );

-- Owner or admin can update
CREATE POLICY "missing_persons_update" ON missing_persons
  FOR UPDATE USING (
    reported_by = auth.uid() OR auth_is_admin()
  );

-- Admin only
CREATE POLICY "missing_persons_delete" ON missing_persons
  FOR DELETE USING (auth_is_admin());


-- ════════════════════════════════
-- unidentified_bodies
-- ════════════════════════════════
ALTER TABLE unidentified_bodies ENABLE ROW LEVEL SECURITY;

-- Paid family members see all; contributors see their own; admins see all
CREATE POLICY "bodies_select" ON unidentified_bodies
  FOR SELECT USING (
    auth_is_admin()
    OR added_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'family'
      AND payment_done = true
    )
  );

-- Only verified contributors can insert body records
CREATE POLICY "bodies_insert" ON unidentified_bodies
  FOR INSERT WITH CHECK (
    added_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'contributor'
      AND is_verified = true
    )
  );

-- Owner or admin can update
CREATE POLICY "bodies_update" ON unidentified_bodies
  FOR UPDATE USING (
    added_by = auth.uid() OR auth_is_admin()
  );

-- Admin only
CREATE POLICY "bodies_delete" ON unidentified_bodies
  FOR DELETE USING (auth_is_admin());


-- ════════════════════════════════
-- matches
-- ════════════════════════════════
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Family sees matches tied to their own missing person; admin sees all
CREATE POLICY "matches_select" ON matches
  FOR SELECT USING (
    auth_is_admin()
    OR EXISTS (
      SELECT 1 FROM missing_persons
      WHERE id = matches.missing_person_id
      AND reported_by = auth.uid()
    )
  );

-- Family can only insert matches for their own missing person
CREATE POLICY "matches_insert" ON matches
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM missing_persons
      WHERE id = missing_person_id
      AND reported_by = auth.uid()
    )
  );

-- Family can update status on their own matches; admin updates any
CREATE POLICY "matches_update" ON matches
  FOR UPDATE USING (
    auth_is_admin()
    OR EXISTS (
      SELECT 1 FROM missing_persons
      WHERE id = matches.missing_person_id
      AND reported_by = auth.uid()
    )
  );

-- Admin only
CREATE POLICY "matches_delete" ON matches
  FOR DELETE USING (auth_is_admin());


-- ════════════════════════════════
-- payments
-- ════════════════════════════════
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users read their own payment records; admin reads all
CREATE POLICY "payments_select" ON payments
  FOR SELECT USING (
    user_id = auth.uid() OR auth_is_admin()
  );

-- No INSERT policy: only service role (verify API) can insert

-- Admin only
CREATE POLICY "payments_update" ON payments
  FOR UPDATE USING (auth_is_admin());

CREATE POLICY "payments_delete" ON payments
  FOR DELETE USING (auth_is_admin());
