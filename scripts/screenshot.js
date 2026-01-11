/**
 * Automated Screenshot Tool for Visual Design Review
 * Captures screenshots of key pages for Designer/Principal review
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');

const SCREENSHOTS_DIR = path.join(__dirname, '../screenshots');
const PUBLIC_DIR = path.join(__dirname, '../public');

// Pages to screenshot
const PAGES = [
  { name: 'homepage', path: '/', viewport: { width: 1280, height: 1024 } },
  { name: 'homepage-mobile', path: '/', viewport: { width: 375, height: 812 } },
  { name: 'post-page', path: '/posts/venerdi-di-lingua-davanti-all-onda-e-oltre-il-droplet/', viewport: { width: 1280, height: 1024 } },
  { name: 'archive-page', path: '/archivio/', viewport: { width: 1280, height: 1024 } },
  { name: 'category-page', path: '/categoria/uncategorized/', viewport: { width: 1280, height: 1024 } },
];

/**
 * Start a temporary HTTP server
 */
function startServer() {
  return new Promise((resolve, reject) => {
    const server = spawn('npx', ['http-server', PUBLIC_DIR, '-p', '0', '-s', '-c-1'], {
      stdio: 'pipe',
      detached: false
    });

    let resolved = false;

    let port = null;

    server.stdout.on('data', (data) => {
      const output = data.toString();
      // Extract port from output like "http://127.0.0.1:58243"
      const portMatch = output.match(/:(\d+)/);
      if (portMatch && !port) {
        port = portMatch[1];
      }
      if ((output.includes('Available on:') || output.includes('Hit CTRL-C')) && !resolved) {
        resolved = true;
        setTimeout(() => resolve({ server, port: port || '8081' }), 1500);
      }
    });

    server.stderr.on('data', (data) => {
      const err = data.toString();
      if (!err.includes('deprecated')) {
        console.error(`Server: ${err}`);
      }
    });

    server.on('error', (err) => {
      if (!resolved) {
        reject(err);
      }
    });

    setTimeout(() => {
      if (!resolved) {
        reject(new Error('Server failed to start within 10 seconds'));
      }
    }, 10000);
  });
}

/**
 * Take screenshots of all pages
 */
async function takeScreenshots() {
  console.log('📸 Starting screenshot capture...\n');

  // Create screenshots directory
  await fs.mkdir(SCREENSHOTS_DIR, { recursive: true });

  // Start HTTP server
  console.log('🚀 Starting local server...');
  const { server, port } = await startServer();

  try {
    console.log(`   Server running on port ${port}`);

    // Launch browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Take screenshots for each page
    for (const pageConfig of PAGES) {
      console.log(`  📷 Capturing: ${pageConfig.name}`);

      // Set viewport
      await page.setViewport(pageConfig.viewport);

      // Navigate to page
      await page.goto(`http://localhost:${port}${pageConfig.path}`, {
        waitUntil: 'networkidle0',
        timeout: 10000
      });

      // Wait a moment for fonts to load
      await page.waitForTimeout(500);

      // Take screenshot
      const screenshotPath = path.join(SCREENSHOTS_DIR, `${pageConfig.name}.png`);
      await page.screenshot({
        path: screenshotPath,
        fullPage: pageConfig.name.includes('homepage') || pageConfig.name.includes('archive')
      });

      console.log(`     ✓ Saved to: screenshots/${pageConfig.name}.png`);
    }

    await browser.close();
    console.log('\n✅ All screenshots captured!');

  } finally {
    // Kill server
    server.kill();
  }
}

// Run if called directly
if (require.main === module) {
  takeScreenshots().catch(error => {
    console.error('❌ Screenshot failed:', error);
    process.exit(1);
  });
}

module.exports = { takeScreenshots };
