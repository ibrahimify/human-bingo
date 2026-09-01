-- Drop existing UPDATE policies and create new ones with WITH CHECK
DROP POLICY IF EXISTS "Participants can update their missions" ON participant_missions;
DROP POLICY IF EXISTS "Participants can update themselves" ON participants;

-- Fix participant_missions UPDATE policy
CREATE POLICY "Participants can update their missions" ON participant_missions 
  FOR UPDATE 
  USING (true)
  WITH CHECK (true);

-- Fix participants UPDATE policy
CREATE POLICY "Participants can update themselves" ON participants 
  FOR UPDATE 
  USING (true)
  WITH CHECK (true);
