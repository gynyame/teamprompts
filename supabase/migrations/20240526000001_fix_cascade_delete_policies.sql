-- Fix RLS policies to allow cascade deletes
-- When a prompt is deleted, related comments and usage must also be deleted.
-- RLS checks these deletes, so we need to allow them.

-- 1. Comments: Allow team members to delete comments (needed for cascade)
CREATE POLICY "Team members can delete comments"
  ON comments FOR DELETE
  USING ( 
    prompt_id IN (
      SELECT id FROM prompts WHERE team_id IN (SELECT get_my_team_ids())
    )
  );

-- 2. Prompt Usage: Allow team members to delete usage logs (needed for cascade)
CREATE POLICY "Team members can delete usage"
  ON prompt_usage FOR DELETE
  USING ( 
    team_id IN (SELECT get_my_team_ids())
  );

-- 3. Ensure Update is also allowed for comments (good practice)
CREATE POLICY "Team members can update comments"
  ON comments FOR UPDATE
  USING ( 
    prompt_id IN (
      SELECT id FROM prompts WHERE team_id IN (SELECT get_my_team_ids())
    )
  );
