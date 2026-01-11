/**
 * Base HTML template for all pages
 * Provides the HTML structure with header, meta tags, and styling
 */

/**
 * Escapes HTML special characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Generates the base HTML template
 *
 * @param {Object} options - Template options
 * @param {string} options.title - Page title
 * @param {string} options.content - HTML content (already rendered, not escaped)
 * @param {string} [options.description] - Meta description
 * @returns {string} Complete HTML document
 */
function baseTemplate({ title, content, description }) {
  const safeTitle = escapeHtml(title);
  const metaDescription = description
    ? escapeHtml(description)
    : 'Blog minimalista italiano - riflessioni su tecnologia, salute e vita quotidiana';

  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${metaDescription}">
  <meta name="theme-color" content="#8B7355">
  <title>${safeTitle}</title>
  <link rel="stylesheet" href="/css/main.css">
  <link rel="alternate" type="application/rss+xml" title="Bloccato RSS Feed" href="/feed.xml">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" href="/apple-touch-icon.svg">
  <link rel="manifest" href="/manifest.json">
</head>
<body>
  <header class="site-header" data-pagefind-ignore>
    <nav class="container">
      <h1 class="site-logo"><a href="/">BLOCCATO</a></h1>
      <div class="nav-links">
        <a href="/">Tutti</a>
        <a href="/categoria/tecnico/">Tecnico</a>
        <a href="/categoria/salute/">Salute</a>
        <a href="/archivio/">Archivio</a>
      </div>
    </nav>
  </header>

  <main class="container" data-pagefind-body>
    ${content}
  </main>

  <footer class="site-footer" data-pagefind-ignore>
    <div class="container">
      <p>&copy; ${new Date().getFullYear()} Bloccato</p>
    </div>
  </footer>
  <script>
    window.addEventListener('DOMContentLoaded', async () => {
      const searchContainer = document.querySelector('.search-container');
      if (searchContainer) {
        // Clear existing content and create Pagefind container
        searchContainer.innerHTML = '<div id="pagefind-search"></div>';

        // Load and initialize Pagefind UI
        const script = document.createElement('script');
        script.src = '/pagefind/pagefind-ui.js';
        script.onload = () => {
          new PagefindUI({
            element: "#pagefind-search",
            showSubResults: false,
            showImages: false,
            excerptLength: 20,
            translations: {
              placeholder: "Cerca nel blog..."
            }
          });
        };
        document.head.appendChild(script);

        // Load Pagefind UI CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/pagefind/pagefind-ui.css';
        document.head.appendChild(link);
      }
    });
  </script>
  <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</body>
</html>`;
}

module.exports = {
  baseTemplate,
};
