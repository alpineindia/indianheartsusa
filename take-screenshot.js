const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 2000 } });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'C:\\Users\\shrey\\matrimonial-usa\\screenshot.png', fullPage: true });
  await browser.close();
  console.log('Screenshot saved to C:\\Users\\shrey\\matrimonial-usa\\screenshot.png');
})();
