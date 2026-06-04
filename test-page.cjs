const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`Console error: ${msg.text()}`);
    }
  });
  page.on('pageerror', err => {
    errors.push(`Page error: ${err.message}`);
  });
  page.on('requestfailed', request => {
    errors.push(`Failed URL: ${request.url()} - ${request.failure()?.errorText}`);
  });
  
  await page.goto('http://rozekinvest.pt/', { waitUntil: 'networkidle' });
  
  for (const err of errors) console.log(err);
  await browser.close();
})();
