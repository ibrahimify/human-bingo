import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cqyrkbpuaclhrphpezka.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.log("Error: Need SUPABASE_SERVICE_ROLE_KEY to run test.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  console.log("🎯 SMOKE TEST: Admin & Player Perspective");
  console.log("-----------------------------------------");
  
  // 1. ADMIN creates session
  console.log("[Admin] Creating new game session...");
  const join_code = Math.random().toString(36).substring(2, 8).toUpperCase();
  const { data: session, error: sErr } = await supabase
    .from('game_sessions')
    .insert({ join_code, status: 'active', name: 'Smoke Test Session' })
    .select()
    .single();
    
  if (sErr) throw sErr;
  console.log(`[Admin] ✅ Session created successfully! Code: ${session.join_code}`);

  // 2. PLAYER joins
  console.log(`\n[Player] Joining session ${session.join_code}...`);
  const playerId = crypto.randomUUID();
  const { data: participant, error: pErr } = await supabase
    .from('participants')
    .insert({
      id: playerId,
      session_id: session.id,
      name: "Agent Smoke Tester"
    })
    .select()
    .single();

  if (pErr) throw pErr;
  console.log(`[Player] ✅ Successfully joined as "Agent Smoke Tester"`);

  // 3. ADMIN verifies player
  console.log(`\n[Admin] Checking dashboard for players...`);
  const { data: verifyPlayer } = await supabase
    .from('participants')
    .select('*')
    .eq('session_id', session.id);
  console.log(`[Admin] ✅ Dashboard sees: ${verifyPlayer[0].name}`);

  // 4. PLAYER receives & submits missions
  console.log(`\n[Player] Fetching missions...`);
  const { data: mission, error: mErr } = await supabase
    .from('participant_missions')
    .insert({
      participant_id: playerId,
      mission_id: 'FIND_LEFT_HANDED',
      category: 'ICEBREAKER',
      position: 1,
      completed: false
    })
    .select()
    .single();

  if (mErr) throw mErr;
  
  console.log(`[Player] Submitting mission...`);
  // This is where the UPDATE policy bug was! 
  // RLS was rejecting UPDATE because it didn't have WITH CHECK
  // (We use a client with anon key to simulate player hitting RLS, wait, I'm using service_role! 
  //  Service role bypasses RLS. I must use anon key to test RLS!)
  
  const supabaseAnon = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  
  const { data: updateRes, error: uErr } = await supabaseAnon
    .from('participant_missions')
    .update({ 
      completed: true, 
      submitted_at: new Date().toISOString(),
      answers: { name: "John Doe" }
    })
    .eq('id', mission.id)
    .select();

  if (uErr) {
    console.log(`[Player] ❌ FAILED to submit mission! Bug is still present.`);
    console.error(uErr);
    return;
  }
  console.log(`[Player] ✅ Mission submitted successfully through RLS!`);

  // 5. ADMIN verifies progress
  console.log(`\n[Admin] Checking dashboard for updated progress...`);
  const { data: finalMission } = await supabase
    .from('participant_missions')
    .select('completed')
    .eq('id', mission.id)
    .single();

  if (finalMission.completed) {
    console.log(`[Admin] ✅ SUCCESS! Dashboard now shows mission is completed!`);
    console.log(`\n🎉 SMOKE TEST PASSED! The database RLS fix you ran works perfectly!`);
  }

})();
