/**
 * Tests for base HTML template
 */

const { baseTemplate } = require('../../src/templates/base');

describe('Base Template', () => {
  test('generates valid HTML structure', () => {
    const html = baseTemplate({
      title: 'Test Page',
      content: '<p>Test content</p>',
    });

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html lang="it">');
    expect(html).toContain('<head>');
    expect(html).toContain('<body>');
    expect(html).toContain('</html>');
  });

  test('includes title in head and meta tags', () => {
    const html = baseTemplate({
      title: 'My Blog Post',
      content: '<p>Content</p>',
    });

    expect(html).toContain('<title>My Blog Post</title>');
    expect(html).toContain('My Blog Post');
  });

  test('includes meta description if provided', () => {
    const html = baseTemplate({
      title: 'Test',
      content: '<p>Content</p>',
      description: 'This is a test description',
    });

    expect(html).toContain('<meta name="description" content="This is a test description"');
  });

  test('includes default meta description if not provided', () => {
    const html = baseTemplate({
      title: 'Test',
      content: '<p>Content</p>',
    });

    expect(html).toContain('<meta name="description"');
  });

  test('includes viewport meta tag for responsive design', () => {
    const html = baseTemplate({
      title: 'Test',
      content: '<p>Content</p>',
    });

    expect(html).toContain('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
  });

  test('includes CSS stylesheet link', () => {
    const html = baseTemplate({
      title: 'Test',
      content: '<p>Content</p>',
    });

    expect(html).toContain('<link rel="stylesheet" href="/css/main.css">');
  });

  test('includes charset UTF-8', () => {
    const html = baseTemplate({
      title: 'Test',
      content: '<p>Content</p>',
    });

    expect(html).toContain('<meta charset="UTF-8">');
  });

  test('renders content inside body', () => {
    const content = '<article><h1>Hello World</h1></article>';
    const html = baseTemplate({
      title: 'Test',
      content,
    });

    expect(html).toContain(content);
  });

  test('includes navigation header', () => {
    const html = baseTemplate({
      title: 'Test',
      content: '<p>Content</p>',
    });

    expect(html).toContain('<header');
    expect(html).toContain('BLOCCATO');
    expect(html).toContain('<nav');
  });

  test('escapes HTML in title', () => {
    const html = baseTemplate({
      title: 'Test <script>alert("xss")</script>',
      content: '<p>Content</p>',
    });

    // Check that title tag contains escaped script, not raw script
    expect(html).toContain('<title>Test &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;</title>');
    expect(html).not.toContain('<title>Test <script>alert("xss")</script></title>');
  });

  test('does NOT escape HTML in content (pre-rendered)', () => {
    const html = baseTemplate({
      title: 'Test',
      content: '<p><strong>Bold</strong></p>',
    });

    expect(html).toContain('<strong>Bold</strong>');
  });
});
