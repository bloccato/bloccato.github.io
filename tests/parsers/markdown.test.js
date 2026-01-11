/**
 * Tests for markdown parser
 */

const { parseMarkdown } = require('../../src/parsers/markdown');

describe('Markdown Parser', () => {
  test('converts basic markdown to HTML', () => {
    const markdown = '# Hello\n\nThis is a paragraph.';
    const html = parseMarkdown(markdown);

    expect(html).toContain('<h1');
    expect(html).toContain('Hello');
    expect(html).toContain('<p>');
    expect(html).toContain('This is a paragraph.');
  });

  test('handles bold text', () => {
    const markdown = 'This is **bold** text.';
    const html = parseMarkdown(markdown);

    expect(html).toContain('<strong>bold</strong>');
  });

  test('handles italic text', () => {
    const markdown = 'This is *italic* text.';
    const html = parseMarkdown(markdown);

    expect(html).toContain('<em>italic</em>');
  });

  test('handles links', () => {
    const markdown = '[Link text](https://example.com)';
    const html = parseMarkdown(markdown);

    expect(html).toContain('<a href="https://example.com"');
    expect(html).toContain('Link text');
  });

  test('handles code blocks', () => {
    const markdown = '```javascript\nconst x = 1;\n```';
    const html = parseMarkdown(markdown);

    expect(html).toContain('<pre>');
    expect(html).toContain('<code');
    expect(html).toContain('const x = 1;');
  });

  test('handles inline code', () => {
    const markdown = 'Use `npm install` to install.';
    const html = parseMarkdown(markdown);

    expect(html).toContain('<code>npm install</code>');
  });

  test('handles headings with anchors', () => {
    const markdown = '## Section Title';
    const html = parseMarkdown(markdown);

    // markdown-it-anchor should add id
    expect(html).toContain('id="');
  });

  test('handles Italian characters correctly', () => {
    const markdown = 'Testo con àccènti e più caratteri speciali.';
    const html = parseMarkdown(markdown);

    expect(html).toContain('àccènti');
    expect(html).toContain('più');
  });

  test('handles blockquotes', () => {
    const markdown = '> This is a quote';
    const html = parseMarkdown(markdown);

    expect(html).toContain('<blockquote>');
    expect(html).toContain('This is a quote');
  });

  test('handles lists', () => {
    const markdown = '- Item 1\n- Item 2\n- Item 3';
    const html = parseMarkdown(markdown);

    expect(html).toContain('<ul>');
    expect(html).toContain('<li>');
    expect(html).toContain('Item 1');
  });

  test('handles numbered lists', () => {
    const markdown = '1. First\n2. Second\n3. Third';
    const html = parseMarkdown(markdown);

    expect(html).toContain('<ol>');
    expect(html).toContain('<li>');
  });

  test('handles images', () => {
    const markdown = '![Alt text](/images/test.jpg)';
    const html = parseMarkdown(markdown);

    expect(html).toContain('<img');
    expect(html).toContain('alt="Alt text"');
    expect(html).toContain('src="/images/test.jpg"');
  });

  test('auto-links URLs', () => {
    const markdown = 'Visit https://example.com for more.';
    const html = parseMarkdown(markdown);

    expect(html).toContain('<a href=');
    expect(html).toContain('https://example.com');
  });

  test('handles typography (smart quotes)', () => {
    const markdown = '"Smart quotes" and it\'s nice.';
    const html = parseMarkdown(markdown);

    // Typographer should convert to smart quotes (Unicode 8220 and 8221)
    expect(html.charCodeAt(html.indexOf(String.fromCharCode(8220)))).toBe(8220); // Opening curly quote
    expect(html).toContain('nice'); // Basic content check
  });

  test('returns empty string for empty input', () => {
    expect(parseMarkdown('')).toBe('');
  });
});
