import puppeteer from 'puppeteer';

(async () => {
  console.log("🚀 Starting Live Verification: https://human-bingo-phi.vercel.app/admin");
  const browser = await puppeteer.launch({ headless: true });
  
  try {
    const adminPage = await browser.newPage();
    
    // We can intercept dialogs (prompts/alerts)
    adminPage.on('dialog', async dialog => {
      console.log(`[Dialog] ${dialog.type()}: "${dialog.message()}"`);
      if (dialog.type() === 'prompt') {
        if (dialog.message().includes('name for this session')) {
          await dialog.accept('Test Custom Session');
        } else if (dialog.message().includes('Join Code')) {
          await dialog.accept('111111');
        } else {
          await dialog.accept('unknown');
        }
      } else if (dialog.type() === 'confirm') {
        await dialog.accept(); // Yes, delete session
      } else {
        await dialog.accept(); // dismiss alerts
      }
    });

    console.log("[1] Navigating to Admin Login...");
    await adminPage.goto('https://human-bingo-phi.vercel.app/admin', { waitUntil: 'networkidle0' });
    
    // Check if we need to login
    const isLogin = await adminPage.$('input[type="password"]');
    if (isLogin) {
      console.log("[2] Logging in...");
      await adminPage.type('input[type="password"]', 'blueprint');
      await adminPage.click('button[type="submit"]');
      await adminPage.waitForNavigation({ waitUntil: 'networkidle0' });
    }

    // Wait for page to load
    await new Promise(r => setTimeout(r, 2000));
    
    // Click Create Session
    console.log("[3] Clicking Create Session...");
    const buttons = await adminPage.$$('button');
    for (let btn of buttons) {
        const text = await adminPage.evaluate(el => el.textContent, btn);
        if (text && text.includes('Create Session')) {
            await btn.click();
            break;
        }
    }
    
    // Wait for fetch to complete
    await new Promise(r => setTimeout(r, 3000));

    // Verify Session Code
    const text = await adminPage.evaluate(() => document.body.innerText);
    if (text.includes('111111') && text.includes('Test Custom Session')) {
       console.log("✅ SUCCESS! Successfully created a session with custom name and join code 111111!");
    } else {
       console.log("❌ FAILED! Could not find '111111' or 'Test Custom Session' on the page. (Maybe Vercel is still deploying?)");
    }

    // Click Delete Session
    console.log("[4] Deleting Session...");
    const deleteBtn = await adminPage.$('button[title="Delete session"]');
    if (deleteBtn) {
        await deleteBtn.click();
        await new Promise(r => setTimeout(r, 2000));
        const afterDeleteText = await adminPage.evaluate(() => document.body.innerText);
        if (!afterDeleteText.includes('Test Custom Session')) {
           console.log("✅ SUCCESS! Session successfully deleted from UI!");
        } else {
           console.log("❌ FAILED! Session is still on screen.");
        }
    } else {
        console.log("❌ Could not find Delete button.");
    }

  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    await browser.close();
  }
})();
