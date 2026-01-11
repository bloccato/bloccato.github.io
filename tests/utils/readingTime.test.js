/**
 * Tests for reading time calculation
 */

const { calculateReadingTime } = require('../../src/utils/readingTime');

describe('Reading Time Utility', () => {
  test('calculates 1 minute for short text (singular Italian)', () => {
    const text = 'Questo è un breve testo di prova.';
    const result = calculateReadingTime(text);

    expect(result.minutes).toBe(1);
    expect(result.text).toBe('1 minuto di lettura');
  });

  test('calculates multiple minutes (plural Italian)', () => {
    // Generate ~400 words = 2 minutes at 200 wpm
    const words = [];
    for (let i = 0; i < 400; i++) {
      words.push('parola');
    }
    const text = words.join(' ');
    const result = calculateReadingTime(text);

    expect(result.minutes).toBe(2);
    expect(result.text).toBe('2 minuti di lettura');
  });

  test('rounds up partial minutes', () => {
    // 250 words = 1.25 minutes, should round to 2
    const words = [];
    for (let i = 0; i < 250; i++) {
      words.push('word');
    }
    const text = words.join(' ');
    const result = calculateReadingTime(text);

    expect(result.minutes).toBe(2);
    expect(result.text).toBe('2 minuti di lettura');
  });

  test('handles empty string', () => {
    const result = calculateReadingTime('');

    expect(result.minutes).toBe(1);
    expect(result.text).toBe('1 minuto di lettura');
  });

  test('handles undefined input', () => {
    const result = calculateReadingTime(undefined);

    expect(result.minutes).toBe(1);
    expect(result.text).toBe('1 minuto di lettura');
  });

  test('handles null input', () => {
    const result = calculateReadingTime(null);

    expect(result.minutes).toBe(1);
    expect(result.text).toBe('1 minuto di lettura');
  });

  test('handles text with multiple spaces', () => {
    const text = 'Parola    con     molti      spazi';
    const result = calculateReadingTime(text);

    expect(result.minutes).toBe(1);
    // Should count 4 words, not be confused by spaces
  });

  test('handles text with newlines', () => {
    const text = `Prima riga
    Seconda riga
    Terza riga`;
    const result = calculateReadingTime(text);

    expect(result.minutes).toBe(1);
  });

  test('realistic blog post (~500 words = 3 minutes)', () => {
    // Simulate a real blog post length
    const words = [];
    for (let i = 0; i < 500; i++) {
      words.push('parola');
    }
    const text = words.join(' ');
    const result = calculateReadingTime(text);

    expect(result.minutes).toBe(3);
    expect(result.text).toBe('3 minuti di lettura');
  });

  test('long article (~1500 words = 8 minutes)', () => {
    const words = [];
    for (let i = 0; i < 1500; i++) {
      words.push('parola');
    }
    const text = words.join(' ');
    const result = calculateReadingTime(text);

    expect(result.minutes).toBe(8);
    expect(result.text).toBe('8 minuti di lettura');
  });

  test('handles Italian text with accents', () => {
    const text = 'È un testo con caratteri accentati: à è é ì ò ù';
    const result = calculateReadingTime(text);

    expect(result.minutes).toBe(1);
    expect(result.text).toBe('1 minuto di lettura');
  });
});
