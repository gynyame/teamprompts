-- NUCLEAR FIX: Drop everything and recreate to ensure no lingering recursive policies

-- 1. Drop Policies (All potential names used previously)
DROP POLICY IF EXISTS "Team members can view team details" ON teams;
DROP POLICY IF EXISTS "Users can create teams" ON teams;
DROP POLICY IF EXISTS "Creators can view their own teams" ON teams;
DROP POLICY IF EXISTS "Users can view their teams" ON teams;
DROP POLICY IF EXISTS "Team admins can update team" ON teams;

DROP POLICY IF EXISTS "Team members can view other members" ON team_members;
DROP POLICY IF EXISTS "Team creators can add themselves" ON team_members;
DROP POLICY IF EXISTS "Team admins can manage members" ON team_members;
DROP POLICY IF EXISTS "Users can view team members" ON team_members;
DROP POLICY IF EXISTS "Team creators can add members" ON team_members;

-- 2. Drop Functions
DROP FUNCTION IF EXISTS get_my_team_ids();
DROP FUNCTION IF EXISTS is_team_creator(uuid);

-- 3. Re-create Functions (SECURITY DEFINER is CRITICAL)
CREATE OR REPLACE FUNCTION get_my_team_ids()
RETURNS setof uuid AS $$
BEGIN
  -- This runs as the database owner, bypassing RLS on team_members
  RETURN QUERY SELECT team_id FROM team_members WHERE user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_team_creator(lookup_team_id uuid)
RETURNS boolean AS $$
BEGIN
  -- This runs as the database owner, bypassing RLS on teams
  RETURN EXISTS (
    SELECT 1 FROM teams
    WHERE id = lookup_team_id AND created_by = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Re-create Policies (TEAMS)
CREATE POLICY "Users can view their teams"
  ON teams FOR SELECT
  USING (
    created_by = auth.uid() OR
    id IN (SELECT get_my_team_ids())
  );

CREATE POLICY "Users can create teams"
  ON teams FOR INSERT
  WITH CHECK ( created_by = auth.uid() );

CREATE POLICY "Team admins can update team"
  ON teams FOR UPDATE
  USING (
    created_by = auth.uid() OR
    id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- 5. Re-create Policies (TEAM_MEMBERS)
CREATE POLICY "Users can view team members"
  ON team_members FOR SELECT
  USING (
    user_id = auth.uid() OR
    team_id IN (SELECT get_my_team_ids()) OR
    is_team_creator(team_id)
  );

CREATE POLICY "Team creators can add members"
  ON team_members FOR INSERT
  WITH CHECK (
    is_team_creator(team_id)
  );

CREATE POLICY "Team admins can manage members"
  ON team_members FOR ALL
  USING (
    is_team_creator(team_id) OR
    team_id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
