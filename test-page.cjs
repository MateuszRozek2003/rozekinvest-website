const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://portugal-silver-coast-apartments-612560834371.us-east1.run.app/', { waitUntil: 'networkidle' });
  const logo = await page.$eval('nav img', el => el.src);
  const logoClasses = await page.$eval('nav img', el => el.className);
  
  const heroImage = await page.$eval('#home, section.relative', el => {
    const img = el.querySelector('img');
    return img ? img.src : (el.style.backgroundImage || window.getComputedStyle(el).backgroundImage);
  }).catch(() => null);

  console.log('LOGO SRC:', logo);
  console.log('LOGO CLASSES:', logoClasses);
  console.log('HERO:', heroImage);
  await browser.close();
})();
