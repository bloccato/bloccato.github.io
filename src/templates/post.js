/**
 * Post page template
 */

const { baseTemplate } = require('./base');
const { formatDate } = require('../utils/dates');

/**
 * Generates a blog post page
 *
 * @param {Object} post - Post data
 * @param {string} post.title - Post title
 * @param {string} post.date - Post date (ISO format)
 * @param {string} post.category - Post category
 * @param {Array<string>} post.tags - Post tags
 * @param {string} post.content - Rendered HTML content
 * @param {string} post.slug - URL slug
 * @param {Object} [post.prev] - Previous post {title, slug}
 * @param {Object} [post.next] - Next post {title, slug}
 * @returns {string} Complete HTML page
 */
function postTemplate(post) {
  const formattedDate = formatDate(post.date);

  const tagsHtml = post.tags && post.tags.length > 0
    ? `<div class="post-tags">
         ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
       </div>`
    : '';

  const navHtml = (post.prev || post.next)
    ? `<nav class="post-navigation">
         ${post.prev ? `<a href="/posts/${post.prev.slug}/" class="nav-prev">← ${post.prev.title}</a>` : '<span></span>'}
         ${post.next ? `<a href="/posts/${post.next.slug}/" class="nav-next">${post.next.title} →</a>` : '<span></span>'}
       </nav>`
    : '';

  const content = `
    <article class="post">
      <header class="post-header">
        <a href="/" class="back-link">← Indietro</a>
        <h1>${post.title}</h1>
        <div class="post-meta">
          <time datetime="${post.date}">${formattedDate}</time>
          <span class="separator">•</span>
          <span class="category">${post.category}</span>
          <span class="separator">•</span>
          <span class="reading-time">${post.readingTime}</span>
        </div>
      </header>

      <div class="post-content">
        ${post.content}
      </div>

      <footer class="post-footer">
        ${tagsHtml}
        ${navHtml}
      </footer>
    </article>
  `;

  return baseTemplate({
    title: `${post.title} - Bloccato`,
    content,
    description: post.excerpt,
  });
}

module.exports = {
  postTemplate,
};
