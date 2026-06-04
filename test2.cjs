const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://portugal-silver-coast-apartments-612560834371.us-east1.run.app/', { waitUntil: 'networkidle' });
  
  const images = await page.$$eval('#apartments img, section:nth-of-type(2) img', els => els.map(img => img.src).slice(0, 5));
  console.log('Apartment Images:', images);
  
  const heroImage = await page.$eval('section.relative img, main > div > img, header + section img', el => el.src).catch(() => 'no hero img tag');
  const heroBg = await page.$eval('section.relative, main > div, header + section', el => window.getComputedStyle(el).backgroundImage).catch(() => 'no bg');
  
  console.log('HERO IMG:', heroImage);
  console.log('HERO BG:', heroBg);

  await browser.close();
})();
