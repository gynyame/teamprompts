-- Final fix for RLS recursion using Security Definer functions

-- 1. Function to get team IDs the user belongs to (bypasses RLS)
CREATE OR REPLACE FUNCTION get_my_team_ids()
RETURNS setof uuid AS $$
BEGIN
  RETURN QUERY SELECT team_id FROM team_members WHERE user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Function to check if user is creator of a team (bypasses RLS)
CREATE OR REPLACE FUNCTION is_team_creator(lookup_team_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM teams
    WHERE id = lookup_team_id AND created_by = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Reset policies for TEAMS
DROP POLICY IF EXISTS "Team members can view team details" ON teams;
DROP POLICY IF EXISTS "Users can create teams" ON teams;
DROP POLICY IF EXISTS "Team admins can update team" ON teams;
DROP POLICY IF EXISTS "Creators can view their own teams" ON teams;

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

-- 4. Reset policies for TEAM_MEMBERS
DROP POLICY IF EXISTS "Team members can view other members" ON team_members;
DROP POLICY IF EXISTS "Team admins can manage members" ON team_members;
DROP POLICY IF EXISTS "Team creators can add themselves" ON team_members;
DROP POLICY IF EXISTS "View own memberships" ON team_members;
DROP POLICY IF EXISTS "View team members" ON team_members;

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
