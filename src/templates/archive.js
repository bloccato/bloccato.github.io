/**
 * Archive page template
 */

const { baseTemplate } = require('./base');
const { formatDate } = require('../utils/dates');

const ITALIAN_MONTHS = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
];

/**
 * Groups posts by year and month
 * @param {Array<Object>} posts - All posts
 * @returns {Object} Posts grouped by year and month
 */
function groupPostsByYearMonth(posts) {
  const grouped = {};

  posts.forEach(post => {
    const date = new Date(post.date);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();

    if (!grouped[year]) {
      grouped[year] = {};
    }

    if (!grouped[year][month]) {
      grouped[year][month] = [];
    }

    grouped[year][month].push(post);
  });

  return grouped;
}

/**
 * Generates archive page
 *
 * @param {Array<Object>} posts - All posts
 * @returns {string} Complete HTML page
 */
function archiveTemplate(posts) {
  const grouped = groupPostsByYearMonth(posts);
  const years = Object.keys(grouped).sort((a, b) => b - a); // Newest first

  let archiveHtml = '';

  years.forEach(year => {
    const months = Object.keys(grouped[year]).sort((a, b) => b - a); // Newest first

    archiveHtml += `<div class="archive-year">
      <h2>${year}</h2>`;

    months.forEach(monthIndex => {
      const monthPosts = grouped[year][monthIndex];
      const monthName = ITALIAN_MONTHS[monthIndex];

      archiveHtml += `
        <div class="archive-month">
          <h3>${monthName} <span class="count">(${monthPosts.length})</span></h3>
          <ul class="archive-list">`;

      monthPosts.forEach(post => {
        const date = new Date(post.date);
        const day = date.getUTCDate();

        archiveHtml += `
            <li>
              <a href="/posts/${post.slug}/">${post.title}</a>
              <time datetime="${post.date}">${day} ${monthName.substring(0, 3)}</time>
            </li>`;
      });

      archiveHtml += `
          </ul>
        </div>`;
    });

    archiveHtml += `</div>`;
  });

  const content = `
    <div class="archive">
      <h1>Archivio</h1>
      ${archiveHtml}
    </div>
  `;

  return baseTemplate({
    title: 'Archivio - Bloccato',
    content,
  });
}

module.exports = {
  archiveTemplate,
};
