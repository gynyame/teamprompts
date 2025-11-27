-- COMPREHENSIVE FIX for Admin Permissions
-- This script ensures admins can see, edit, and delete ALL prompts in their team, regardless of visibility.
-- It also ensures all related tables (variables, tags, comments) can be deleted by admins.

-- 1. Update Prompts SELECT Policy to explicitly allow Admins to see EVERYTHING
DROP POLICY IF EXISTS "Users can view team prompts" ON prompts;
CREATE POLICY "Users can view team prompts"
  ON prompts FOR SELECT
  USING (
    -- Standard check: Member of team
    (
      team_id IN (SELECT get_my_team_ids())
      AND
      (
        -- Public or Team visibility
        visibility IN ('public', 'team')
        OR
        -- Private but I am the creator
        (visibility = 'private' AND created_by = auth.uid())
        OR
        -- I am an ADMIN of this team (can see private prompts of others)
        is_team_admin(team_id)
      )
    )
  );

-- 2. Update Prompts UPDATE Policy (Ensure admins can update everything)
DROP POLICY IF EXISTS "Users can update their own prompts or team admins" ON prompts;
CREATE POLICY "Users can update their own prompts or team admins"
  ON prompts FOR UPDATE
  USING (
    created_by = auth.uid()
    OR 
    is_team_admin(team_id)
  );

-- 3. Update Prompts DELETE Policy (Ensure admins can delete everything)
DROP POLICY IF EXISTS "Users can delete their own prompts or team admins" ON prompts;
CREATE POLICY "Users can delete their own prompts or team admins"
  ON prompts FOR DELETE
  USING (
    created_by = auth.uid()
    OR 
    is_team_admin(team_id)
  );

-- 4. Ensure Prompt Variables can be deleted by Admins (and creators)
-- We use a simpler policy that trusts the prompt ownership/admin check
DROP POLICY IF EXISTS "Team members can manage prompt variables" ON prompt_variables;
CREATE POLICY "Team members can manage prompt variables"
  ON prompt_variables FOR ALL
  USING (
    prompt_id IN (
      SELECT id FROM prompts WHERE 
        -- If I can see/edit the prompt, I can manage its variables
        -- This relies on the prompts policies above being correct
        team_id IN (SELECT get_my_team_ids())
    )
  );

-- 5. Ensure Prompt Tags can be deleted
DROP POLICY IF EXISTS "Team members can manage prompt tags" ON prompt_tags;
CREATE POLICY "Team members can manage prompt tags"
  ON prompt_tags FOR ALL
  USING (
    prompt_id IN (
      SELECT id FROM prompts WHERE team_id IN (SELECT get_my_team_ids())
    )
  );

-- 6. Ensure Comments can be deleted (Cascade)
DROP POLICY IF EXISTS "Team members can delete comments" ON comments;
CREATE POLICY "Team members can delete comments"
  ON comments FOR DELETE
  USING (
    prompt_id IN (
      SELECT id FROM prompts WHERE team_id IN (SELECT get_my_team_ids())
    )
  );

-- 7. Ensure Usage can be deleted (Cascade)
DROP POLICY IF EXISTS "Team members can delete usage" ON prompt_usage;
CREATE POLICY "Team members can delete usage"
  ON prompt_usage FOR DELETE
  USING (
    team_id IN (SELECT get_my_team_ids())
  );
