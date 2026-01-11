/**
 * Calculate reading time for blog posts
 * Uses average reading speed and formats in Italian
 */

/**
 * Calculates reading time in minutes
 * Based on average reading speed of 200 words per minute (conservative for Italian)
 *
 * @param {string} text - The text content to analyze
 * @returns {Object} - { minutes: number, text: string }
 */
function calculateReadingTime(text) {
  if (!text || typeof text !== 'string') {
    return { minutes: 1, text: '1 minuto di lettura' };
  }

  // Count words (split by whitespace, filter empty strings)
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;

  // Average reading speed: 200 words per minute (conservative)
  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  // Format in Italian (handle singular vs plural)
  const text_it = minutes === 1
    ? '1 minuto di lettura'
    : `${minutes} minuti di lettura`;

  return {
    minutes,
    text: text_it
  };
}

module.exports = {
  calculateReadingTime,
};
