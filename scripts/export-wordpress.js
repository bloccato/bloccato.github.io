/**
 * WordPress Export Script
 * Converts WordPress XML export to Markdown files
 *
 * Usage:
 *   node scripts/export-wordpress.js path/to/wordpress-export.xml
 */

const fs = require('fs').promises;
const path = require('path');
const xml2js = require('xml2js');
const TurndownService = require('turndown');

const OUTPUT_DIR = path.join(__dirname, '../content/posts');

/**
 * Converts HTML to Markdown
 */
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

// Custom rules for better conversion
turndownService.addRule('removeComments', {
  filter: (node) => node.nodeName === '#comment',
  replacement: () => '',
});

/**
 * Extracts category from WordPress post
 */
function extractCategory(post) {
  if (!post.category) return 'Generale';

  const categories = Array.isArray(post.category) ? post.category : [post.category];

  // Find first category that looks like our blog categories
  for (const cat of categories) {
    if (!cat._) continue;

    const name = cat._;
    if (name.toLowerCase().includes('tecnico')) return 'Tecnico';
    if (name.toLowerCase().includes('salute')) return 'Salute';
    if (name.toLowerCase().includes('viaggio')) return 'Viaggio';
  }

  // Return first non-empty category or default
  const firstCat = categories.find(c => c._ && c.$ && c.$.domain === 'category');
  return firstCat?._ || 'Generale';
}

/**
 * Extracts tags from WordPress post
 */
function extractTags(post) {
  if (!post.category) return [];

  const categories = Array.isArray(post.category) ? post.category : [post.category];

  return categories
    .filter(c => c.$ && c.$.domain === 'post_tag' && c._)
    .map(c => c._)
    .slice(0, 5); // Limit to 5 tags
}

/**
 * Generates filename from date and title
 */
function generateFilename(date, title) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  // Slugify title
  const slug = title
    .toLowerCase()
    .replace(/[àá]/g, 'a')
    .replace(/[èé]/g, 'e')
    .replace(/[ìí]/g, 'i')
    .replace(/[òó]/g, 'o')
    .replace(/[ùú]/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `${year}-${month}-${day}-${slug}.md`;
}

/**
 * Converts a single WordPress post to Markdown
 */
function convertPost(post) {
  const title = post.title?.[0] || 'Untitled';
  const date = post['wp:post_date']?.[0] || post.pubDate?.[0];
  const content = post['content:encoded']?.[0] || '';

  // Skip drafts or private posts
  const status = post['wp:status']?.[0];
  if (status !== 'publish') {
    return null;
  }

  // Convert HTML to Markdown
  const markdown = turndownService.turndown(content);

  const category = extractCategory(post);
  const tags = extractTags(post);

  // Build frontmatter
  const frontmatter = [
    '---',
    `title: "${title.replace(/"/g, '\\"')}"`,
    `date: ${new Date(date).toISOString().split('T')[0]}`,
    `category: ${category}`,
  ];

  if (tags.length > 0) {
    frontmatter.push(`tags: [${tags.join(', ')}]`);
  }

  frontmatter.push('---');

  const fullContent = frontmatter.join('\n') + '\n\n' + markdown;

  const filename = generateFilename(date, title);

  return {
    filename,
    content: fullContent,
    title,
    date,
  };
}

/**
 * Main export function
 */
async function exportWordPress(xmlPath) {
  console.log('📥 Reading WordPress export file...');

  try {
    const xmlContent = await fs.readFile(xmlPath, 'utf-8');

    console.log('🔍 Parsing XML...');
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xmlContent);

    const items = result.rss?.channel?.[0]?.item || [];
    console.log(`📝 Found ${items.length} items in export`);

    const posts = items
      .map(convertPost)
      .filter(post => post !== null);

    console.log(`✅ ${posts.length} posts will be converted`);

    // Create output directory if it doesn't exist
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Write each post
    for (const post of posts) {
      const outputPath = path.join(OUTPUT_DIR, post.filename);
      await fs.writeFile(outputPath, post.content, 'utf-8');
      console.log(`  ✓ ${post.filename}`);
    }

    console.log(`\n✅ Export complete! ${posts.length} posts written to ${OUTPUT_DIR}`);
    console.log('\n📋 Next steps:');
    console.log('  1. Review converted posts in content/posts/');
    console.log('  2. Fix any formatting issues');
    console.log('  3. Run: npm run build');

  } catch (error) {
    console.error('❌ Export failed:', error.message);
    console.error('\nUsage: node scripts/export-wordpress.js path/to/wordpress-export.xml');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  const xmlPath = process.argv[2];

  if (!xmlPath) {
    console.error('❌ Please provide path to WordPress export XML file');
    console.error('Usage: node scripts/export-wordpress.js path/to/wordpress-export.xml');
    process.exit(1);
  }

  exportWordPress(xmlPath);
}

module.exports = { exportWordPress };
