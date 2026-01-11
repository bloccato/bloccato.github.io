/**
 * Tests for Italian date formatting utility
 */

const { formatDate, formatDateISO } = require('../../src/utils/dates');

describe('Date Utilities', () => {
  describe('formatDate - Italian format', () => {
    test('formats date in Italian (9 Gennaio 2026)', () => {
      const date = new Date('2026-01-09');
      expect(formatDate(date)).toBe('9 Gennaio 2026');
    });

    test('formats single digit day without leading zero', () => {
      const date = new Date('2026-02-05');
      expect(formatDate(date)).toBe('5 Febbraio 2026');
    });

    test('formats all Italian months correctly', () => {
      const months = [
        ['2026-01-15', '15 Gennaio 2026'],
        ['2026-02-15', '15 Febbraio 2026'],
        ['2026-03-15', '15 Marzo 2026'],
        ['2026-04-15', '15 Aprile 2026'],
        ['2026-05-15', '15 Maggio 2026'],
        ['2026-06-15', '15 Giugno 2026'],
        ['2026-07-15', '15 Luglio 2026'],
        ['2026-08-15', '15 Agosto 2026'],
        ['2026-09-15', '15 Settembre 2026'],
        ['2026-10-15', '15 Ottobre 2026'],
        ['2026-11-15', '15 Novembre 2026'],
        ['2026-12-15', '15 Dicembre 2026'],
      ];

      months.forEach(([input, expected]) => {
        expect(formatDate(new Date(input))).toBe(expected);
      });
    });

    test('handles string input', () => {
      expect(formatDate('2026-01-09')).toBe('9 Gennaio 2026');
    });
  });

  describe('formatDateISO - ISO 8601 format', () => {
    test('formats date as YYYY-MM-DD', () => {
      const date = new Date('2026-01-09T10:30:00Z');
      expect(formatDateISO(date)).toBe('2026-01-09');
    });

    test('handles string input', () => {
      expect(formatDateISO('2026-02-05')).toBe('2026-02-05');
    });

    test('pads single digit month and day with zeros', () => {
      const date = new Date('2026-03-05');
      expect(formatDateISO(date)).toBe('2026-03-05');
    });
  });
});
