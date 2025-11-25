-- Add missing RLS policies for invitations and other tables

-- 1. Helper function to check if user is admin of a team
CREATE OR REPLACE FUNCTION is_team_admin(lookup_team_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM team_members
    WHERE team_id = lookup_team_id 
    AND user_id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Invitations Policies
-- View: Admins can view all, Invitees can view their own (by email matching)
CREATE POLICY "Admins and invitees can view invitations"
  ON invitations FOR SELECT
  USING (
    is_team_admin(team_id) OR
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Insert: Only admins can invite
CREATE POLICY "Admins can create invitations"
  ON invitations FOR INSERT
  WITH CHECK ( is_team_admin(team_id) );

-- Delete: Only admins can revoke
CREATE POLICY "Admins can delete invitations"
  ON invitations FOR DELETE
  USING ( is_team_admin(team_id) );

-- 3. Folders Policies
CREATE POLICY "Team members can view folders"
  ON folders FOR SELECT
  USING ( team_id IN (SELECT get_my_team_ids()) );

CREATE POLICY "Team members can create folders"
  ON folders FOR INSERT
  WITH CHECK ( team_id IN (SELECT get_my_team_ids()) );

CREATE POLICY "Team members can update folders"
  ON folders FOR UPDATE
  USING ( team_id IN (SELECT get_my_team_ids()) );

CREATE POLICY "Team members can delete folders"
  ON folders FOR DELETE
  USING ( team_id IN (SELECT get_my_team_ids()) );

-- 4. Tags Policies
CREATE POLICY "Team members can view tags"
  ON tags FOR SELECT
  USING ( team_id IN (SELECT get_my_team_ids()) );

CREATE POLICY "Team members can create tags"
  ON tags FOR INSERT
  WITH CHECK ( team_id IN (SELECT get_my_team_ids()) );

CREATE POLICY "Team members can update tags"
  ON tags FOR UPDATE
  USING ( team_id IN (SELECT get_my_team_ids()) );

CREATE POLICY "Team members can delete tags"
  ON tags FOR DELETE
  USING ( team_id IN (SELECT get_my_team_ids()) );

-- 5. Comments Policies
CREATE POLICY "Team members can view comments"
  ON comments FOR SELECT
  USING ( 
    prompt_id IN (
      SELECT id FROM prompts WHERE team_id IN (SELECT get_my_team_ids())
    )
  );

CREATE POLICY "Team members can create comments"
  ON comments FOR INSERT
  WITH CHECK ( 
    prompt_id IN (
      SELECT id FROM prompts WHERE team_id IN (SELECT get_my_team_ids())
    )
  );

-- 6. Prompt Tags Policies
CREATE POLICY "Team members can view prompt tags"
  ON prompt_tags FOR SELECT
  USING ( 
    prompt_id IN (
      SELECT id FROM prompts WHERE team_id IN (SELECT get_my_team_ids())
    )
  );

CREATE POLICY "Team members can manage prompt tags"
  ON prompt_tags FOR ALL
  USING ( 
    prompt_id IN (
      SELECT id FROM prompts WHERE team_id IN (SELECT get_my_team_ids())
    )
  );

-- 7. Prompt Variables Policies
CREATE POLICY "Team members can view prompt variables"
  ON prompt_variables FOR SELECT
  USING ( 
    prompt_id IN (
      SELECT id FROM prompts WHERE team_id IN (SELECT get_my_team_ids())
    )
  );

CREATE POLICY "Team members can manage prompt variables"
  ON prompt_variables FOR ALL
  USING ( 
    prompt_id IN (
      SELECT id FROM prompts WHERE team_id IN (SELECT get_my_team_ids())
    )
  );

-- 8. Prompt Usage Policies
CREATE POLICY "Team members can view usage"
  ON prompt_usage FOR SELECT
  USING ( team_id IN (SELECT get_my_team_ids()) );

CREATE POLICY "Team members can record usage"
  ON prompt_usage FOR INSERT
  WITH CHECK ( team_id IN (SELECT get_my_team_ids()) );
