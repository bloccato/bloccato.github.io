/**
 * Tests for slugify utility - converts titles to URL-friendly slugs
 */

const { slugify } = require('../../src/utils/slugify');

describe('Slugify Utility', () => {
  test('converts basic text to lowercase slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  test('handles Italian characters (à, è, é, ì, ò, ù)', () => {
    expect(slugify('È un café con più opzioni')).toBe('e-un-cafe-con-piu-opzioni');
  });

  test('removes special characters', () => {
    expect(slugify('Hello! World? (2026)')).toBe('hello-world-2026');
  });

  test('replaces multiple spaces with single dash', () => {
    expect(slugify('Multiple   spaces   here')).toBe('multiple-spaces-here');
  });

  test('removes leading and trailing dashes', () => {
    expect(slugify('  spaces around  ')).toBe('spaces-around');
  });

  test('handles apostrophes and quotes', () => {
    expect(slugify("L'arte di scrivere")).toBe('larte-di-scrivere');
  });

  test('converts colons (common in blog titles)', () => {
    expect(slugify('Lunedì Tecnico: Riflessioni')).toBe('lunedi-tecnico-riflessioni');
  });

  test('handles empty string', () => {
    expect(slugify('')).toBe('');
  });

  test('handles numbers', () => {
    expect(slugify('Post 123 - Anno 2026')).toBe('post-123-anno-2026');
  });

  test('handles real blog post titles', () => {
    expect(slugify('Martedì di Salute: Come vivere meglio')).toBe('martedi-di-salute-come-vivere-meglio');
    expect(slugify('Riflessioni su tecnologia e società')).toBe('riflessioni-su-tecnologia-e-societa');
  });
});
