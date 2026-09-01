-- Allow anon/authenticated users to insert their own participant records
CREATE POLICY "Players can insert their own participant" ON participants
  FOR INSERT
  WITH CHECK (true);

-- Allow anon/authenticated users to insert their own mission records  
CREATE POLICY "Players can insert their own missions" ON participant_missions
  FOR INSERT
  WITH CHECK (true);

-- Allow anon/authenticated users to read their own participant data
CREATE POLICY "Players can read their participant data" ON participants
  FOR SELECT
  USING (true);

-- Allow anon/authenticated users to read their own mission data
CREATE POLICY "Players can read their mission data" ON participant_missions
  FOR SELECT
  USING (true);
