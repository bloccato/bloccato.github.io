/**
 * Frontmatter parser for blog posts
 * Uses gray-matter library to extract YAML frontmatter
 */

const matter = require('gray-matter');

/**
 * Parses frontmatter from markdown content
 * Validates required fields: title, date, category
 *
 * @param {string} content - Markdown content with frontmatter
 * @returns {Object} Parsed result with data and content
 * @throws {Error} If required fields are missing
 */
function parseFrontmatter(content) {
  const result = matter(content);

  // Validate required fields
  const required = ['title', 'date', 'category'];
  for (const field of required) {
    if (!result.data[field]) {
      throw new Error(`Required frontmatter field missing: ${field}`);
    }
  }

  // Convert date to ISO string if it's a Date object
  if (result.data.date instanceof Date) {
    const d = result.data.date;
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    result.data.date = `${year}-${month}-${day}`;
  }

  // Trim content whitespace
  result.content = result.content.trim();

  return result;
}

module.exports = {
  parseFrontmatter,
};
