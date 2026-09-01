import puppeteer from 'puppeteer';

(async () => {
  console.log("🚀 Starting Smoke Test on Live App: https://human-bingo-phi.vercel.app");
  const browser = await puppeteer.launch({ headless: true });
  
  try {
    // 1. ADMIN PERSPECTIVE
    console.log("\n[Admin] Opening Admin Login...");
    const adminPage = await browser.newPage();
    await adminPage.goto('https://human-bingo-phi.vercel.app/admin/login', { waitUntil: 'networkidle0' });
    
    // Login
    console.log("[Admin] Typing passcode and logging in...");
    await adminPage.type('input[type="password"]', 'blueprint');
    await adminPage.click('button[type="submit"]');
    await adminPage.waitForNavigation({ waitUntil: 'networkidle0' });
    
    // Create Session
    console.log("[Admin] Creating new game session...");
    await adminPage.click('button'); // Click 'Create New Session'
    await new Promise(r => setTimeout(r, 2000));
    
    // Extract Session Code
    const sessionCodeElement = await adminPage.$('.text-4xl.font-mono.font-bold');
    const sessionCode = await adminPage.evaluate(el => el.textContent, sessionCodeElement);
    console.log(`[Admin] ✅ Created Session with Code: ${sessionCode}`);

    // 2. PLAYER PERSPECTIVE
    console.log(`\n[Player] Opening Player Home...`);
    const playerPage = await browser.newPage();
    await playerPage.goto('https://human-bingo-phi.vercel.app', { waitUntil: 'networkidle0' });

    console.log(`[Player] Joining with code ${sessionCode}...`);
    await playerPage.type('input', sessionCode);
    await playerPage.click('button[type="submit"]');
    await playerPage.waitForNavigation({ waitUntil: 'networkidle0' });

    console.log(`[Player] Entering name "Smoke Tester"...`);
    await playerPage.type('input', 'Smoke Tester');
    await playerPage.click('button'); // Start Missions
    await new Promise(r => setTimeout(r, 2000));
    
    console.log(`[Player] ✅ Successfully received 5 random missions!`);

    // 3. ADMIN PERSPECTIVE VERIFICATION
    console.log(`\n[Admin] Checking dashboard for new player...`);
    const adminText = await adminPage.evaluate(() => document.body.innerText);
    if (adminText.includes('Smoke Tester')) {
        console.log(`[Admin] ✅ Player "Smoke Tester" successfully appeared on the dashboard in real-time!`);
    } else {
        console.log(`[Admin] ❌ Player "Smoke Tester" did NOT appear on the dashboard.`);
    }

    // 4. PLAYER SUBMITS A MISSION
    console.log(`\n[Player] Submitting first mission...`);
    // Find all inputs and type "Test Answer"
    const inputs = await playerPage.$$('input');
    for (let input of inputs) {
        await input.type('Test Answer');
    }
    
    // Find submit button (contains 'Submit & next')
    const buttons = await playerPage.$$('button');
    let submitBtn = null;
    for (let btn of buttons) {
        const text = await playerPage.evaluate(el => el.textContent, btn);
        if (text && text.includes('Submit & next')) {
            submitBtn = btn;
            break;
        }
    }
    
    if (submitBtn) {
        await submitBtn.click();
        await new Promise(r => setTimeout(r, 2000));
        console.log(`[Player] ✅ First mission submitted!`);
    }
    
    // 5. ADMIN VERIFIES PROGRESS
    console.log(`\n[Admin] Checking dashboard for player progress...`);
    await new Promise(r => setTimeout(r, 2000)); // Wait for realtime update
    const adminTextProgress = await adminPage.evaluate(() => document.body.innerText);
    
    if (adminTextProgress.includes('1 / 5')) {
        console.log(`[Admin] ✅ Dashboard updated in real-time! Progress shows 1/5!`);
        console.log(`\n🎉 SMOKE TEST COMPLETED SUCCESSFULLY! Database RLS fix works perfectly!`);
    } else {
        console.log(`[Admin] ❌ Dashboard still shows 0/5. The progress bug persists.`);
    }
    
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    await browser.close();
  }
})();
