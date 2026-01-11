/**
 * Scrapes blog posts from bloccato.xyz
 * Converts to Markdown with proper frontmatter
 */

const https = require('https');
const fs = require('fs').promises;
const path = require('path');
const TurndownService = require('turndown');

const OUTPUT_DIR = path.join(__dirname, '../content/posts');

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

// Post URLs to scrape
const POSTS = [
  { url: 'https://bloccato.xyz/?p=84', expectedDate: '2026-01-07' },
  { url: 'https://bloccato.xyz/?p=82', expectedDate: '2026-01-06' },
  { url: 'https://bloccato.xyz/?p=80', expectedDate: '2026-01-05' },
  { url: 'https://bloccato.xyz/?p=76', expectedDate: '2026-01-04' },
  { url: 'https://bloccato.xyz/?p=72', expectedDate: '2026-01-02' },
  { url: 'https://bloccato.xyz/?p=70', expectedDate: '2026-01-01' },
  { url: 'https://bloccato.xyz/?p=68', expectedDate: '2025-12-31' },
  { url: 'https://bloccato.xyz/?p=66', expectedDate: '2025-12-30' },
  { url: 'https://bloccato.xyz/?p=61', expectedDate: '2025-12-29' },
  { url: 'https://bloccato.xyz/?p=59', expectedDate: '2025-12-29' },
  { url: 'https://bloccato.xyz/?p=56', expectedDate: '2025-06-26' },
  { url: 'https://bloccato.xyz/?p=53', expectedDate: '2025-06-21' },
  { url: 'https://bloccato.xyz/?p=48', expectedDate: '2025-05-31' },
  { url: 'https://bloccato.xyz/?p=43', expectedDate: '2025-05-28' },
  { url: 'https://bloccato.xyz/?p=35', expectedDate: '2025-05-20' },
  { url: 'https://bloccato.xyz/?p=32', expectedDate: '2025-05-16' },
  { url: 'https://bloccato.xyz/?p=27', expectedDate: '2025-05-12' },
  { url: 'https://bloccato.xyz/?p=22', expectedDate: '2025-04-27' },
  { url: 'https://bloccato.xyz/?p=18', expectedDate: '2025-04-22' },
  { url: 'https://bloccato.xyz/?p=15', expectedDate: '2024-02-21' },
];

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractPostData(html, expectedDate) {
  // Extract title
  const titleMatch = html.match(/<h1[^>]*class="entry-title"[^>]*>(.*?)<\/h1>/i) ||
                     html.match(/<title>(.*?)<\/title>/i);
  let title = titleMatch ? titleMatch[1].replace(/–.*$/, '').trim() : 'Untitled';
  title = title.replace(/&#8211;/g, '–').replace(/&#8217;/g, "'").replace(/&#8220;/g, '"').replace(/&#8221;/g, '"');

  // Extract content
  const contentMatch = html.match(/<div[^>]*class="entry-content"[^>]*>([\s\S]*?)<\/div>/i);
  let content = contentMatch ? contentMatch[1] : '';

  // Clean up WordPress artifacts
  content = content.replace(/<script[\s\S]*?<\/script>/gi, '');
  content = content.replace(/<!--[\s\S]*?-->/g, '');
  content = content.trim();

  // Extract date from meta or use expected
  const dateMatch = html.match(/<time[^>]*datetime="([^"]+)"/i);
  const date = dateMatch ? dateMatch[1].split('T')[0] : expectedDate;

  // Determine category from title
  let category = 'Generale';
  if (title.toLowerCase().includes('tecnico')) category = 'Tecnico';
  else if (title.toLowerCase().includes('salute')) category = 'Salute';
  else if (title.toLowerCase().includes('mercato')) category = 'Mercato';
  else if (title.toLowerCase().includes('viaggio')) category = 'Viaggio';

  // Extract tags (if any)
  const tags = [];
  if (category !== 'Generale') tags.push(category.toLowerCase());

  return { title, content, date, category, tags };
}

function generateFilename(date, title) {
  const slug = title
    .toLowerCase()
    .replace(/[àá]/g, 'a')
    .replace(/[èé]/g, 'e')
    .replace(/[ìí]/g, 'i')
    .replace(/[òó]/g, 'o')
    .replace(/[ùú]/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);

  return `${date}-${slug}.md`;
}

async function scrapePost(postInfo) {
  try {
    console.log(`Fetching: ${postInfo.url}`);
    const html = await fetchUrl(postInfo.url);
    const data = extractPostData(html, postInfo.expectedDate);

    // Convert HTML to Markdown
    const markdown = turndownService.turndown(data.content);

    // Build frontmatter
    const frontmatter = [
      '---',
      `title: "${data.title.replace(/"/g, '\\"')}"`,
      `date: ${data.date}`,
      `category: ${data.category}`,
    ];

    if (data.tags.length > 0) {
      frontmatter.push(`tags: [${data.tags.join(', ')}]`);
    }

    frontmatter.push('---');

    const fullContent = frontmatter.join('\n') + '\n\n' + markdown;
    const filename = generateFilename(data.date, data.title);

    await fs.writeFile(path.join(OUTPUT_DIR, filename), fullContent, 'utf-8');
    console.log(`  ✓ ${filename}`);

    return { filename, title: data.title, date: data.date };
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('🕷️  Scraping bloccato.xyz...\n');

  // Create output directory
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Scrape all posts
  const results = [];
  for (const post of POSTS) {
    const result = await scrapePost(post);
    if (result) results.push(result);
    // Small delay to be polite
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n✅ Scraped ${results.length} posts`);
  console.log('\nNext steps:');
  console.log('  1. Review posts in content/posts/');
  console.log('  2. Run: npm run build');
  console.log('  3. Run: npm run dev');
}

main();
