/**
 * Main build script
 * Orchestrates the static site generation
 */

const fs = require('fs').promises;
const path = require('path');
const { parseFrontmatter } = require('./parsers/frontmatter');
const { parseMarkdown } = require('./parsers/markdown');
const { slugify } = require('./utils/slugify');
const { generateExcerpt } = require('./utils/excerpt');
const { postTemplate } = require('./templates/post');
const { listTemplate } = require('./templates/list');
const { archiveTemplate } = require('./templates/archive');

const CONTENT_DIR = path.join(__dirname, '../content/posts');
const PUBLIC_DIR = path.join(__dirname, '../docs');
const STATIC_DIR = path.join(__dirname, '../static');
const POSTS_PER_PAGE = 20;

/**
 * Cleans the public directory
 */
async function cleanPublicDir() {
  try {
    await fs.rm(PUBLIC_DIR, { recursive: true, force: true });
    await fs.mkdir(PUBLIC_DIR, { recursive: true });
  } catch (error) {
    console.error('Error cleaning public directory:', error);
    throw error;
  }
}

/**
 * Loads all markdown files from content directory
 * @returns {Array<Object>} Array of {filename, content}
 */
async function loadAllPosts() {
  try {
    const files = await fs.readdir(CONTENT_DIR);
    const markdownFiles = files.filter(f => f.endsWith('.md'));

    const posts = await Promise.all(
      markdownFiles.map(async (filename) => {
        const content = await fs.readFile(path.join(CONTENT_DIR, filename), 'utf-8');
        return { filename, content };
      })
    );

    return posts;
  } catch (error) {
    console.error('Error loading posts:', error);
    throw error;
  }
}

/**
 * Parses a single post
 * @param {Object} post - {filename, content}
 * @returns {Object} Parsed post with metadata
 */
function parsePost(post) {
  const parsed = parseFrontmatter(post.content);
  const htmlContent = parseMarkdown(parsed.content);

  // Generate slug from filename (YYYY-MM-DD-slug.md)
  const slug = post.filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');

  // Generate excerpt if not provided
  const excerpt = parsed.data.excerpt || generateExcerpt(parsed.content);

  return {
    ...parsed.data,
    slug,
    content: htmlContent,
    excerpt,
    filename: post.filename,
  };
}

/**
 * Sorts posts by date (newest first)
 */
function sortByDate(posts) {
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Writes a file to the public directory
 */
async function writeFile(relativePath, content) {
  const fullPath = path.join(PUBLIC_DIR, relativePath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, content, 'utf-8');
}

/**
 * Generates individual post pages
 */
async function generatePostPages(posts) {
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];

    // Add prev/next navigation
    const prev = i > 0 ? { title: posts[i - 1].title, slug: posts[i - 1].slug } : null;
    const next = i < posts.length - 1 ? { title: posts[i + 1].title, slug: posts[i + 1].slug } : null;

    const html = postTemplate({ ...post, prev, next });
    await writeFile(`posts/${post.slug}/index.html`, html);
  }

  console.log(`✓ Generated ${posts.length} post pages`);
}

/**
 * Generates paginated index pages
 */
async function generateIndexPages(posts) {
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  for (let page = 1; page <= totalPages; page++) {
    const start = (page - 1) * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;
    const pagePosts = posts.slice(start, end);

    const html = listTemplate({
      posts: pagePosts,
      title: page === 1 ? 'Bloccato' : `Bloccato - Pagina ${page}`,
      currentPage: page,
      totalPages,
      baseUrl: '/',
    });

    const outputPath = page === 1 ? 'index.html' : `page/${page}/index.html`;
    await writeFile(outputPath, html);
  }

  console.log(`✓ Generated ${totalPages} index pages`);
}

/**
 * Generates category pages
 */
async function generateCategoryPages(posts) {
  const categories = {};

  // Group posts by category
  posts.forEach(post => {
    if (!categories[post.category]) {
      categories[post.category] = [];
    }
    categories[post.category].push(post);
  });

  // Generate page for each category
  for (const [category, categoryPosts] of Object.entries(categories)) {
    const categorySlug = slugify(category);
    const totalPages = Math.ceil(categoryPosts.length / POSTS_PER_PAGE);

    for (let page = 1; page <= totalPages; page++) {
      const start = (page - 1) * POSTS_PER_PAGE;
      const end = start + POSTS_PER_PAGE;
      const pagePosts = categoryPosts.slice(start, end);

      const html = listTemplate({
        posts: pagePosts,
        title: `${category} - Bloccato`,
        heading: category,
        currentPage: page,
        totalPages,
        baseUrl: `/categoria/${categorySlug}/`,
      });

      const outputPath = page === 1
        ? `categoria/${categorySlug}/index.html`
        : `categoria/${categorySlug}/page/${page}/index.html`;

      await writeFile(outputPath, html);
    }
  }

  console.log(`✓ Generated ${Object.keys(categories).length} category pages`);
}

/**
 * Generates archive page
 */
async function generateArchivePage(posts) {
  const html = archiveTemplate(posts);
  await writeFile('archivio/index.html', html);
  console.log('✓ Generated archive page');
}

/**
 * Generates RSS feed
 */
async function generateRSSFeed(posts) {
  const RSS = require('rss');

  const feed = new RSS({
    title: 'Bloccato',
    description: 'Blog minimalista italiano',
    feed_url: 'https://bloccato.xyz/feed.xml',
    site_url: 'https://bloccato.xyz',
    language: 'it',
    pubDate: new Date(),
  });

  // Add 50 most recent posts
  posts.slice(0, 50).forEach(post => {
    feed.item({
      title: post.title,
      description: post.content,
      url: `https://bloccato.xyz/posts/${post.slug}/`,
      date: post.date,
      categories: [post.category, ...(post.tags || [])],
    });
  });

  await writeFile('feed.xml', feed.xml({ indent: true }));
  console.log('✓ Generated RSS feed');
}

/**
 * Generates sitemap.xml
 */
async function generateSitemap(posts) {
  const urls = [
    { loc: 'https://bloccato.xyz/', changefreq: 'daily', priority: 1.0 },
    { loc: 'https://bloccato.xyz/archivio/', changefreq: 'weekly', priority: 0.8 },
  ];

  // Add all posts
  posts.forEach(post => {
    urls.push({
      loc: `https://bloccato.xyz/posts/${post.slug}/`,
      lastmod: post.date,
      changefreq: 'monthly',
      priority: 0.7,
    });
  });

  // Add category pages
  const categories = [...new Set(posts.map(p => p.category))];
  categories.forEach(category => {
    urls.push({
      loc: `https://bloccato.xyz/categoria/${slugify(category)}/`,
      changefreq: 'weekly',
      priority: 0.8,
    });
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  await writeFile('sitemap.xml', xml);
  console.log('✓ Generated sitemap.xml');
}

/**
 * Copies static assets to public directory
 */
async function copyStaticAssets() {
  try {
    await fs.cp(STATIC_DIR, PUBLIC_DIR, { recursive: true, force: true });
    console.log('✓ Copied static assets');
  } catch (error) {
    console.error('Error copying static assets:', error);
  }
}

/**
 * Main build function
 */
async function build() {
  console.log('🔨 Building Bloccato...\n');

  try {
    // Clean and prepare
    await cleanPublicDir();

    // Load and parse posts
    const rawPosts = await loadAllPosts();
    const parsedPosts = rawPosts.map(parsePost);
    const sortedPosts = sortByDate(parsedPosts);

    console.log(`📝 Found ${sortedPosts.length} posts\n`);

    // Generate all pages
    await generatePostPages(sortedPosts);
    await generateIndexPages(sortedPosts);
    await generateCategoryPages(sortedPosts);
    await generateArchivePage(sortedPosts);
    await generateRSSFeed(sortedPosts);
    await generateSitemap(sortedPosts);

    // Copy static files
    await copyStaticAssets();

    console.log(`\n✅ Build complete! Output in public/`);
  } catch (error) {
    console.error('\n❌ Build failed:', error);
    process.exit(1);
  }
}

// Run build if called directly
if (require.main === module) {
  build();
}

module.exports = { build };
