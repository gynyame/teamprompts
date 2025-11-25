-- Fix permission denied error by using auth.jwt() instead of querying auth.users table directly

-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins and invitees can view invitations" ON invitations;

-- Re-create with auth.jwt() ->> 'email'
CREATE POLICY "Admins and invitees can view invitations"
  ON invitations FOR SELECT
  USING (
    is_team_admin(team_id) OR
    email = (auth.jwt() ->> 'email')
  );
