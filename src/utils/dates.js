/**
 * Date formatting utilities for Italian blog
 */

const ITALIAN_MONTHS = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
];

/**
 * Parse date string or Date object to UTC components
 * Avoids timezone issues by working with UTC dates
 * @param {Date|string} date - Date object or ISO date string
 * @returns {Object} UTC date components
 */
function parseDate(date) {
  let d;
  if (typeof date === 'string') {
    // For YYYY-MM-DD strings, treat as UTC date
    const [year, month, day] = date.split('-').map(Number);
    d = new Date(Date.UTC(year, month - 1, day));
  } else {
    d = date;
  }

  return {
    day: d.getUTCDate(),
    month: d.getUTCMonth(),
    year: d.getUTCFullYear(),
  };
}

/**
 * Formats a date in Italian format: "9 Gennaio 2026"
 * @param {Date|string} date - Date object or ISO date string
 * @returns {string} Formatted date in Italian
 */
function formatDate(date) {
  const { day, month, year } = parseDate(date);
  return `${day} ${ITALIAN_MONTHS[month]} ${year}`;
}

/**
 * Formats a date in ISO 8601 format: "2026-01-09"
 * @param {Date|string} date - Date object or ISO date string
 * @returns {string} Date in YYYY-MM-DD format
 */
function formatDateISO(date) {
  const { day, month, year } = parseDate(date);
  const monthPadded = String(month + 1).padStart(2, '0');
  const dayPadded = String(day).padStart(2, '0');
  return `${year}-${monthPadded}-${dayPadded}`;
}

module.exports = {
  formatDate,
  formatDateISO,
};
