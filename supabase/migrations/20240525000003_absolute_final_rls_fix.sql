-- ABSOLUTE FINAL FIX: Dynamic drop of all policies to ensure clean slate

-- 1. Dynamic Drop of ALL Policies on teams and team_members
DO $$ 
DECLARE 
    pol record; 
BEGIN 
    -- Drop all policies on teams
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'teams' 
    LOOP 
        EXECUTE format('DROP POLICY "%s" ON teams', pol.policyname); 
    END LOOP; 

    -- Drop all policies on team_members
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'team_members' 
    LOOP 
        EXECUTE format('DROP POLICY "%s" ON team_members', pol.policyname); 
    END LOOP; 
END $$;

-- 2. Drop and Recreate Functions with strict search_path
DROP FUNCTION IF EXISTS get_my_team_ids();
DROP FUNCTION IF EXISTS is_team_creator(uuid);

CREATE OR REPLACE FUNCTION get_my_team_ids()
RETURNS setof uuid AS $$
BEGIN
  -- SECURITY DEFINER bypasses RLS
  RETURN QUERY SELECT team_id FROM team_members WHERE user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION is_team_creator(lookup_team_id uuid)
RETURNS boolean AS $$
BEGIN
  -- SECURITY DEFINER bypasses RLS
  RETURN EXISTS (
    SELECT 1 FROM teams
    WHERE id = lookup_team_id AND created_by = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Re-apply Policies (TEAMS)
CREATE POLICY "teams_select_policy"
  ON teams FOR SELECT
  USING (
    created_by = auth.uid() OR
    id IN (SELECT get_my_team_ids())
  );

CREATE POLICY "teams_insert_policy"
  ON teams FOR INSERT
  WITH CHECK ( created_by = auth.uid() );

CREATE POLICY "teams_update_policy"
  ON teams FOR UPDATE
  USING (
    created_by = auth.uid() OR
    id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "teams_delete_policy"
  ON teams FOR DELETE
  USING ( created_by = auth.uid() );

-- 4. Re-apply Policies (TEAM_MEMBERS)
CREATE POLICY "members_select_policy"
  ON team_members FOR SELECT
  USING (
    user_id = auth.uid() OR
    team_id IN (SELECT get_my_team_ids()) OR
    is_team_creator(team_id)
  );

CREATE POLICY "members_insert_policy"
  ON team_members FOR INSERT
  WITH CHECK (
    is_team_creator(team_id)
  );

CREATE POLICY "members_update_policy"
  ON team_members FOR UPDATE
  USING (
    is_team_creator(team_id) OR
    team_id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "members_delete_policy"
  ON team_members FOR DELETE
  USING (
    is_team_creator(team_id) OR
    user_id = auth.uid() -- Allow users to leave teams
  );
