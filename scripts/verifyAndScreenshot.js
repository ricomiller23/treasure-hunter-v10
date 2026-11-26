import { chromium } from 'playwright-core';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const DOWNLOADS_DIR = '/Users/ericmiller/Downloads';
const SCREENSHOTS_DIR = '/Users/ericmiller/.gemini/antigravity/scratch/treasure-hunter/screenshots';

async function run() {
  console.log('Building app before preview...');
  const build = spawn('npm', ['run', 'build'], {
    cwd: '/Users/ericmiller/.gemini/antigravity/scratch/treasure-hunter',
    stdio: 'inherit',
  });
  await new Promise((r) => build.on('close', r));

  console.log('Starting preview server on port 4174...');
  const server = spawn('npx', ['vite', 'preview', '--port', '4174', '--strictPort'], {
    cwd: '/Users/ericmiller/.gemini/antigravity/scratch/treasure-hunter',
    stdio: 'inherit',
  });

  await new Promise((r) => setTimeout(r, 2000));

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 800 });

    console.log('Navigating to http://localhost:4174...');
    await page.goto('http://localhost:4174', { waitUntil: 'networkidle' });

    // 1. Title Screen Screenshot
    console.log('Capturing Title Screen...');
    const titlePath = path.join(SCREENSHOTS_DIR, 'treasure_hunter_01_title_screen.png');
    await page.screenshot({ path: titlePath, fullPage: true });

    // Test Rules modal
    console.log('Testing Rules modal click...');
    await page.click("button:has-text('Rules')");
    await page.waitForTimeout(600);
    await page.click("button[aria-label='Close']");
    await page.waitForTimeout(400);

    // Test Settings modal
    console.log('Testing Settings modal click...');
    await page.click("button:has-text('Options')");
    await page.waitForTimeout(600);
    await page.click("button:has-text('Done')");
    await page.waitForTimeout(400);

    // 2. Mobile Viewport Test (390x844 iPhone dimensions per Rule 20)
    console.log('Testing Mobile Viewport (390x844)...');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(600);
    const mobilePath = path.join(SCREENSHOTS_DIR, 'treasure_hunter_04_mobile_viewport.png');
    await page.screenshot({ path: mobilePath, fullPage: true });

    // Return to desktop
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(400);

    // 3. Start Explorer Game
    console.log('Starting Explorer Game...');
    await page.click("button:has-text('EMBARK ON EXPEDITION')");
    await page.waitForTimeout(1000);

    // Capture Mid-Game
    console.log('Capturing Mid-Game Table...');
    const midgamePath = path.join(SCREENSHOTS_DIR, 'treasure_hunter_02_midgame.png');
    await page.screenshot({ path: midgamePath, fullPage: true });

    // 4. Capture Peril Event Screen
    console.log('Simulating Peril state...');
    await page.evaluate(() => {
      const store = window.__gameStore;
      if (store) {
        store.setState((prev) => ({
          ...prev,
          gameState: {
            ...prev.gameState,
            perilActive: true,
            boonsInPlay: [],
            history: [
              {
                round: prev.gameState.roundNumber,
                description: 'PERIL! Four Skull Caves dealt. Boons in play destroyed!',
                timestamp: Date.now(),
              },
              ...prev.gameState.history,
            ],
          },
        }));
      }
    });
    await page.waitForTimeout(600);
    const perilPath = path.join(SCREENSHOTS_DIR, 'treasure_hunter_03_peril_event.png');
    await page.screenshot({ path: perilPath, fullPage: true });

    // 5. Play game through to conclusion and capture End Screen
    console.log('Concluding expedition for End Screen...');
    await page.evaluate(() => {
      const store = window.__gameStore;
      if (store) {
        store.getState().endGameManually();
      }
    });
    await page.waitForTimeout(800);
    const endPath = path.join(SCREENSHOTS_DIR, 'treasure_hunter_05_end_screen.png');
    await page.screenshot({ path: endPath, fullPage: true });

    // Copy all screenshots to ~/Downloads (Rule 6)
    console.log('Exporting all screenshots to ~/Downloads as per Rule 6...');
    const files = fs.readdirSync(SCREENSHOTS_DIR);
    for (const f of files) {
      if (f.endsWith('.png')) {
        const src = path.join(SCREENSHOTS_DIR, f);
        const dest = path.join(DOWNLOADS_DIR, f);
        fs.copyFileSync(src, dest);
        console.log(`Exported: ${f} -> ${dest}`);
      }
    }

    console.log('Automated verification and screenshot capture finished successfully!');
  } finally {
    await browser.close();
    server.kill();
  }
}

run().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
