-- Fix infinite recursion by using a security definer function
CREATE OR REPLACE FUNCTION is_team_creator(lookup_team_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM teams
    WHERE id = lookup_team_id AND created_by = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the problematic policy
DROP POLICY IF EXISTS "Team creators can add themselves" ON team_members;

-- Re-create it using the function
CREATE POLICY "Team creators can add themselves"
  ON team_members FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    is_team_creator(team_id)
  );

-- Also ensure creators can view their teams (needed for the initial insert return)
-- Check if policy exists first to avoid error? 
-- Postgres doesn't have "CREATE POLICY IF NOT EXISTS".
-- We'll drop it first just in case, or assume it doesn't exist.
DROP POLICY IF EXISTS "Creators can view their own teams" ON teams;

CREATE POLICY "Creators can view their own teams"
  ON teams FOR SELECT
  USING ( created_by = auth.uid() );
