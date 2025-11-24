-- Allow team creators to add themselves as members
CREATE POLICY "Team creators can add themselves"
  ON team_members FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    team_id IN (
      SELECT id FROM teams WHERE created_by = auth.uid()
    )
  );
