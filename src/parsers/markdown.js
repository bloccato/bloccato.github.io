/**
 * Markdown parser for blog posts
 * Uses markdown-it with anchor plugin for heading links
 */

const MarkdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');

// Configure markdown-it
const md = new MarkdownIt({
  html: true,          // Enable HTML tags in source
  linkify: true,       // Auto-convert URLs to links
  typographer: true,   // Smart quotes, dashes, ellipsis
  breaks: false,       // Don't convert \n to <br>
})
.use(markdownItAnchor, {
  permalink: false,    // Don't add permalink symbols
  level: 2,            // Start anchors at h2 (h1 is page title)
});

/**
 * Converts Twitter/X URLs to embedded tweets
 * @param {string} html - HTML content
 * @returns {string} HTML with Twitter embeds
 */
function embedTwitterLinks(html) {
  // Match Twitter/X URLs that are standalone links (not already in other HTML)
  const twitterRegex = /<a href="(https?:\/\/(?:twitter\.com|x\.com)\/\w+\/status\/\d+[^"]*)"[^>]*>\1<\/a>/gi;

  return html.replace(twitterRegex, (match, url) => {
    return `<blockquote class="twitter-tweet" data-theme="light"><a href="${url}"></a></blockquote>`;
  });
}

/**
 * Converts markdown to HTML
 *
 * @param {string} markdown - Markdown content
 * @returns {string} HTML content
 */
function parseMarkdown(markdown) {
  if (!markdown) return '';

  let html = md.render(markdown);

  // Convert Twitter links to embeds
  html = embedTwitterLinks(html);

  return html;
}

module.exports = {
  parseMarkdown,
};
