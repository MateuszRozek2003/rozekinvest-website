const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://rozekinvest.pt/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: '/screenshot.png' });
  
  const logoSrc = await page.$eval('nav img', el => el.src).catch(() => 'no logo');
  console.log('Logo src:', logoSrc);
  
  await browser.close();
})();
