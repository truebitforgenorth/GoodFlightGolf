const { chromium } = require("C:/Users/kayrl/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
  const consoleMessages = [];
  const pageErrors = [];

  page.on("console", (msg) => {
    consoleMessages.push(`${msg.type()}: ${msg.text()}`);
  });

  page.on("pageerror", (error) => {
    pageErrors.push(String(error));
  });

  try {
    await page.goto("http://127.0.0.1:4173/rounds/scorecard.html", { waitUntil: "networkidle" });

    await page.click("#openRoundSessionModalBtn");
    await page.click('[data-session-choice="roundGame"]');
    await page.click('[data-linked-game="wolf"]');
    await page.click("#saveRoundSessionBtn");

    await page.waitForSelector("#inlineGameSetupCard:not(.hidden)");
    await page.selectOption("#inlineGameTrackedPlayer", "0");
    await page.selectOption("#inlineWolfHoleSetup", "partner-1");
    await page.click('[data-inline-wolf-result="wolfTeam"]');

    for (let i = 0; i < 18; i += 1) {
      await page.click("#nextHoleBtn");
      await page.waitForTimeout(25);
    }

    await page.waitForSelector("#resultsCard:not(.hidden)");

    const before = await page.evaluate(() => ({
      holeTitle: document.getElementById("holeTitle")?.textContent?.trim() || "",
      note: document.querySelector(".round-linked-game-note")?.textContent?.trim() || "",
      saveDisabled: document.getElementById("resultsSaveRoundBtn")?.hasAttribute("disabled") || false,
      lockerDisabled: document.getElementById("resultsBackToLockerRoomBtn")?.hasAttribute("disabled") || false,
      saveText: document.getElementById("resultsSaveRoundBtn")?.textContent?.trim() || "",
      lockerText: document.getElementById("resultsBackToLockerRoomBtn")?.textContent?.trim() || ""
    }));

    await page.click("#resultsSaveRoundBtn");
    await page.waitForFunction(() => {
      const el = document.getElementById("resultsSaveRoundStatus");
      return !!el && !!el.textContent && el.textContent.trim().length > 0;
    });

    const after = await page.evaluate(() => ({
      status: document.getElementById("resultsSaveRoundStatus")?.textContent?.trim() || "",
      saveDisabled: document.getElementById("resultsSaveRoundBtn")?.hasAttribute("disabled") || false,
      lockerDisabled: document.getElementById("resultsBackToLockerRoomBtn")?.hasAttribute("disabled") || false
    }));

    console.log(JSON.stringify({
      ok: true,
      before,
      after,
      pageErrors,
      consoleMessages
    }, null, 2));
  } catch (error) {
    console.log(JSON.stringify({
      ok: false,
      error: String(error),
      pageErrors,
      consoleMessages
    }, null, 2));
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
