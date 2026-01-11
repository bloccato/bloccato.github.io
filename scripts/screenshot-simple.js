/**
 * Simple Screenshot Tool - Just capture from running dev server
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

const SCREENSHOTS_DIR = path.join(__dirname, '../screenshots');
const BASE_URL = 'http://localhost:8080'; // Assumes dev server is running

const PAGES = [
  { name: 'homepage', path: '/', viewport: { width: 1280, height: 1024 } },
  { name: 'homepage-mobile', path: '/', viewport: { width: 375, height: 812 } },
  { name: 'post-page', path: '/posts/venerdi-di-lingua-davanti-all-onda-e-oltre-il-droplet/', viewport: { width: 1280, height: 1024 } },
  { name: 'archive-page', path: '/archivio/', viewport: { width: 1280, height: 1024 } },
  { name: 'category-tecnico', path: '/categoria/tecnico/', viewport: { width: 1280, height: 1024 } },
];

async function takeScreenshots() {
  console.log('📸 Taking screenshots from http://localhost:8080\n');
  console.log('⚠️  Make sure dev server is running: npm run dev\n');

  await fs.mkdir(SCREENSHOTS_DIR, { recursive: true });

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  for (const pageConfig of PAGES) {
    try {
      console.log(`  📷 ${pageConfig.name}`);
      await page.setViewport(pageConfig.viewport);
      await page.goto(`${BASE_URL}${pageConfig.path}`, { waitUntil: 'networkidle0', timeout: 10000 });
      await new Promise(resolve => setTimeout(resolve, 500));

      const screenshotPath = path.join(SCREENSHOTS_DIR, `${pageConfig.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: pageConfig.name.includes('homepage') || pageConfig.name.includes('archive') });

      console.log(`     ✓ screenshots/${pageConfig.name}.png`);
    } catch (error) {
      console.log(`     ✗ Failed: ${error.message}`);
    }
  }

  await browser.close();
  console.log('\n✅ Screenshots complete!');
}

takeScreenshots().catch(error => {
  console.error('❌ Failed:', error.message);
  console.error('\n💡 Make sure dev server is running: npm run dev');
  process.exit(1);
});
