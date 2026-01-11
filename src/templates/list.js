/**
 * List page template (homepage, category pages)
 */

const { baseTemplate } = require('./base');
const { formatDate } = require('../utils/dates');

/**
 * Generates a post list item
 * @param {Object} post - Post data
 * @returns {string} HTML for post list item
 */
function postListItem(post) {
  const formattedDate = formatDate(post.date);

  return `
    <article class="post-item">
      <h2><a href="/posts/${post.slug}/">${post.title}</a></h2>
      <div class="post-meta">
        <time datetime="${post.date}">${formattedDate}</time>
        <span class="separator">•</span>
        <span class="category">${post.category}</span>
      </div>
      <p class="excerpt">${post.excerpt}</p>
      <a href="/posts/${post.slug}/" class="read-more" aria-label="Leggi ${post.title}">→</a>
    </article>
  `;
}

/**
 * Generates pagination controls
 * @param {number} currentPage - Current page number (1-indexed)
 * @param {number} totalPages - Total number of pages
 * @param {string} baseUrl - Base URL for pagination (e.g., '/' or '/categoria/tecnico/')
 * @returns {string} HTML for pagination
 */
function pagination(currentPage, totalPages, baseUrl = '/') {
  if (totalPages <= 1) return '';

  const prevUrl = currentPage > 1
    ? (currentPage === 2 ? baseUrl : `${baseUrl}page/${currentPage - 1}/`)
    : null;

  const nextUrl = currentPage < totalPages
    ? `${baseUrl}page/${currentPage + 1}/`
    : null;

  return `
    <nav class="pagination">
      ${prevUrl ? `<a href="${prevUrl}" class="pagination-prev">← Più recenti</a>` : '<span></span>'}
      <span class="pagination-info">Pagina ${currentPage} di ${totalPages}</span>
      ${nextUrl ? `<a href="${nextUrl}" class="pagination-next">Meno recenti →</a>` : '<span></span>'}
    </nav>
  `;
}

/**
 * Generates a list page (homepage or category)
 *
 * @param {Object} options - Template options
 * @param {Array<Object>} options.posts - Array of posts to display
 * @param {string} [options.title] - Page title (default: 'Bloccato')
 * @param {string} [options.heading] - Page heading (optional)
 * @param {number} [options.currentPage] - Current page number
 * @param {number} [options.totalPages] - Total pages
 * @param {string} [options.baseUrl] - Base URL for pagination
 * @returns {string} Complete HTML page
 */
function listTemplate({ posts, title = 'Bloccato', heading, currentPage = 1, totalPages = 1, baseUrl = '/' }) {
  const headingHtml = heading ? `<h1 class="page-heading">${heading}</h1>` : '';

  const postsHtml = posts.map(postListItem).join('\n');

  const paginationHtml = pagination(currentPage, totalPages, baseUrl);

  const content = `
    <div class="post-list">
      ${headingHtml}

      <div class="search-container">
        <input type="search" id="search" placeholder="Cerca nel blog..." />
      </div>

      ${postsHtml}

      ${paginationHtml}
    </div>
  `;

  return baseTemplate({
    title,
    content,
  });
}

module.exports = {
  listTemplate,
};
