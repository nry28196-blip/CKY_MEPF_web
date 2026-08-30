import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Browser Error:', msg.text());
    }
  });
  page.on('pageerror', err => {
    console.log('Page Error:', err.message);
  });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    // try clicking the fire tab
    const tabs = Array.from(document.querySelectorAll('button'));
    const fireTab = tabs.find(t => t.textContent.toLowerCase().includes('fire'));
    if (fireTab) fireTab.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
