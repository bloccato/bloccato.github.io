/**
 * Excerpt utility - generates preview text from markdown content
 */

const EXCERPT_LENGTH = 120;

/**
 * Removes markdown formatting from text
 * @param {string} text - Text with markdown
 * @returns {string} Plain text
 */
function stripMarkdown(text) {
  return text
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove headings
    .replace(/^#{1,6}\s+/gm, '')
    // Remove links but keep text [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove bold **text** or __text__
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    // Remove italic *text* or _text_
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Truncates text at word boundary
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text with ellipsis if needed
 */
function truncateAtWord(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }

  // Find the last space before maxLength
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace === -1) {
    // No space found, truncate at maxLength
    return text.substring(0, maxLength).trim() + ' ...';
  }

  return text.substring(0, lastSpace).trim() + ' ...';
}

/**
 * Generates an excerpt from markdown content
 * - Strips markdown formatting
 * - Truncates to ~120 characters at word boundary
 * - Adds ellipsis if truncated
 *
 * @param {string} content - Markdown content
 * @returns {string} Plain text excerpt
 */
function generateExcerpt(content) {
  if (!content) return '';

  const plainText = stripMarkdown(content);
  return truncateAtWord(plainText, EXCERPT_LENGTH);
}

module.exports = {
  generateExcerpt,
};
