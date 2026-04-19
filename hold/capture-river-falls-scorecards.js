const { chromium } = require("C:/Users/kayrl/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe"
  });

  const shots = [
    {
      url: "https://images.squarespace-cdn.com/content/v1/65f42fd4e0bbe110cb5db6fd/a2524537-9cb3-439b-845d-0ed3c79d1786/scorecard1.PNG",
      path: "G:/webSites/MySites/GFG/hold/river-falls-scorecard-1.png"
    },
    {
      url: "https://images.squarespace-cdn.com/content/v1/65f42fd4e0bbe110cb5db6fd/63f7aea5-6aba-48cf-8a57-8fd133c608f8/scorecard2.PNG",
      path: "G:/webSites/MySites/GFG/hold/river-falls-scorecard-2.png"
    }
  ];

  try {
    for (const shot of shots) {
      const page = await browser.newPage({ viewport: { width: 1500, height: 900 } });
      await page.goto(shot.url, { waitUntil: "networkidle" });
      await page.screenshot({ path: shot.path, fullPage: true });
      await page.close();
    }
  } finally {
    await browser.close();
  }
})();
