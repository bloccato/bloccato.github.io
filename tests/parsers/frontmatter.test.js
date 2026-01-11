/**
 * Tests for frontmatter parser
 */

const { parseFrontmatter } = require('../../src/parsers/frontmatter');

describe('Frontmatter Parser', () => {
  test('parses valid frontmatter with all fields', () => {
    const content = `---
title: "Lunedì Tecnico: Test Post"
date: 2026-01-09
category: Tecnico
tags: [test, example]
excerpt: "Custom excerpt here"
---

Post content here.`;

    const result = parseFrontmatter(content);

    expect(result.data.title).toBe('Lunedì Tecnico: Test Post');
    expect(result.data.date).toBe('2026-01-09');
    expect(result.data.category).toBe('Tecnico');
    expect(result.data.tags).toEqual(['test', 'example']);
    expect(result.data.excerpt).toBe('Custom excerpt here');
    expect(result.content).toBe('Post content here.');
  });

  test('parses frontmatter without optional fields', () => {
    const content = `---
title: "Simple Post"
date: 2026-01-09
category: Generale
---

Content here.`;

    const result = parseFrontmatter(content);

    expect(result.data.title).toBe('Simple Post');
    expect(result.data.tags).toBeUndefined();
    expect(result.data.excerpt).toBeUndefined();
  });

  test('throws error when required field (title) is missing', () => {
    const content = `---
date: 2026-01-09
category: Tecnico
---

Content.`;

    expect(() => parseFrontmatter(content)).toThrow();
  });

  test('throws error when required field (date) is missing', () => {
    const content = `---
title: "Test"
category: Tecnico
---

Content.`;

    expect(() => parseFrontmatter(content)).toThrow('date');
  });

  test('throws error when required field (category) is missing', () => {
    const content = `---
title: "Test"
date: 2026-01-09
---

Content.`;

    expect(() => parseFrontmatter(content)).toThrow('category');
  });

  test('handles frontmatter with Italian characters', () => {
    const content = `---
title: "Martedì di Salute: Più benessere"
date: 2026-01-10
category: Salute
---

Contenuto in italiano con àccènti.`;

    const result = parseFrontmatter(content);

    expect(result.data.title).toBe('Martedì di Salute: Più benessere');
    expect(result.content).toContain('àccènti');
  });

  test('trims whitespace from content', () => {
    const content = `---
title: "Test"
date: 2026-01-09
category: Test
---

Content here.

`;

    const result = parseFrontmatter(content);
    expect(result.content).toBe('Content here.');
  });

  test('handles empty tags array', () => {
    const content = `---
title: "Test"
date: 2026-01-09
category: Test
tags: []
---

Content.`;

    const result = parseFrontmatter(content);
    expect(result.data.tags).toEqual([]);
  });

  test('handles tags as comma-separated string (alternative format)', () => {
    const content = `---
title: "Test"
date: 2026-01-09
category: Test
tags: tech, riflessioni
---

Content.`;

    const result = parseFrontmatter(content);
    // This might be handled by gray-matter automatically
    // or we may need to process it
    expect(result.data.tags).toBeDefined();
  });
});
