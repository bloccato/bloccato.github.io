/**
 * Tests for excerpt utility - generates preview text from content
 */

const { generateExcerpt } = require('../../src/utils/excerpt');

describe('Excerpt Utility', () => {
  test('truncates long text to ~120 characters', () => {
    const text = 'This is a very long piece of text that should be truncated to approximately 120 characters for use as a preview excerpt in the blog post list view.';
    const result = generateExcerpt(text);
    expect(result.length).toBeLessThanOrEqual(123); // 120 + ellipsis
    expect(result).toContain('...');
  });

  test('does not truncate short text', () => {
    const text = 'Short text.';
    expect(generateExcerpt(text)).toBe('Short text.');
  });

  test('truncates at word boundary, not mid-word', () => {
    const text = 'This is a very long piece of text that should be truncated at a word boundary and not in the middle of a word which would look unprofessional.';
    const result = generateExcerpt(text);
    expect(result).not.toMatch(/\.\.\.\w/); // Should not have ... followed by partial word
    expect(result.split(' ').pop()).not.toMatch(/^\w+\.\.\.$/); // Last word shouldn't be partial
  });

  test('removes markdown headings', () => {
    const text = '# Big Heading\n\nThis is the actual content that should be in the excerpt.';
    const result = generateExcerpt(text);
    expect(result).not.toContain('#');
    expect(result).toContain('This is the actual content');
  });

  test('removes markdown links but keeps link text', () => {
    const text = 'Check out [this article](https://example.com) for more info.';
    const result = generateExcerpt(text);
    expect(result).not.toContain('[');
    expect(result).not.toContain('](');
    expect(result).toContain('this article');
  });

  test('removes markdown bold and italic markers', () => {
    const text = 'This is **bold** and this is *italic* text.';
    const result = generateExcerpt(text);
    expect(result).not.toContain('**');
    expect(result).not.toContain('*');
    expect(result).toContain('bold');
    expect(result).toContain('italic');
  });

  test('removes code blocks', () => {
    const text = 'Some text before.\n\n```js\nconst code = true;\n```\n\nSome text after.';
    const result = generateExcerpt(text);
    expect(result).not.toContain('```');
    expect(result).not.toContain('const code');
    expect(result).toContain('Some text');
  });

  test('removes inline code backticks', () => {
    const text = 'Use the `npm install` command to install.';
    const result = generateExcerpt(text);
    expect(result).not.toContain('`');
    expect(result).toContain('npm install');
  });

  test('normalizes whitespace (multiple spaces, newlines)', () => {
    const text = 'Text with\n\nmultiple   spaces  and\nnewlines.';
    const result = generateExcerpt(text);
    expect(result).toBe('Text with multiple spaces and newlines.');
  });

  test('handles Italian text', () => {
    const text = 'Questo è un testo italiano con àccènti che dovrebbe essere troncato correttamente mantenendo l\'integrità delle parole italiane.';
    const result = generateExcerpt(text);
    expect(result.length).toBeLessThanOrEqual(123);
    expect(result).toContain('italiano');
  });

  test('handles empty string', () => {
    expect(generateExcerpt('')).toBe('');
  });

  test('trims whitespace', () => {
    const text = '  Text with spaces around  ';
    expect(generateExcerpt(text)).toBe('Text with spaces around');
  });
});
