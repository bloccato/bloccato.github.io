/**
 * Slugify utility - converts titles to URL-friendly slugs
 */

/**
 * Italian character mappings for transliteration
 */
const ITALIAN_CHAR_MAP = {
  'à': 'a',
  'è': 'e',
  'é': 'e',
  'ì': 'i',
  'ò': 'o',
  'ù': 'u',
  'À': 'a',
  'È': 'e',
  'É': 'e',
  'Ì': 'i',
  'Ò': 'o',
  'Ù': 'u',
};

/**
 * Converts a string to a URL-friendly slug
 * - Lowercase
 * - Transliterates Italian characters
 * - Replaces spaces and special chars with dashes
 * - Removes consecutive dashes
 * - Trims dashes from start/end
 *
 * @param {string} text - Text to slugify
 * @returns {string} URL-friendly slug
 */
function slugify(text) {
  if (!text) return '';

  // Convert to lowercase
  let slug = text.toLowerCase();

  // Transliterate Italian characters
  Object.keys(ITALIAN_CHAR_MAP).forEach(char => {
    slug = slug.replace(new RegExp(char, 'g'), ITALIAN_CHAR_MAP[char]);
  });

  // Remove apostrophes and quotes (don't replace with dash)
  slug = slug.replace(/[''"]/g, '');

  // Replace spaces and special characters with dashes
  slug = slug
    .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric with dash
    .replace(/-+/g, '-')           // Replace multiple dashes with single dash
    .replace(/^-|-$/g, '');        // Remove leading/trailing dashes

  return slug;
}

module.exports = {
  slugify,
};
