-- Allow service_role (admin) to perform all operations on game_sessions
CREATE POLICY "Service role can manage game_sessions" ON game_sessions 
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Allow service_role to manage participants
CREATE POLICY "Service role can manage participants" ON participants 
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Allow service_role to manage participant_missions
CREATE POLICY "Service role can manage participant_missions" ON participant_missions 
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
