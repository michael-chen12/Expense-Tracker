import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate } from '../format';

describe('formatCurrency', () => {
  it('should format positive numbers correctly', () => {
    expect(formatCurrency(100)).toBe('$100.00');
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
    expect(formatCurrency(0.99)).toBe('$0.99');
  });

  it('should format zero correctly', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should format negative numbers correctly', () => {
    expect(formatCurrency(-50)).toBe('-$50.00');
    expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
  });

  it('should handle large numbers', () => {
    expect(formatCurrency(1000000)).toBe('$1,000,000.00');
    expect(formatCurrency(999999.99)).toBe('$999,999.99');
  });

  it('should handle decimal precision', () => {
    expect(formatCurrency(10.5)).toBe('$10.50');
    expect(formatCurrency(10.123)).toBe('$10.12');
    expect(formatCurrency(10.999)).toBe('$11.00');
  });
});

describe('formatDate', () => {
  it('should format ISO date strings correctly', () => {
    expect(formatDate('2026-01-15')).toBe('Jan 15, 2026');
    expect(formatDate('2025-12-25')).toBe('Dec 25, 2025');
  });

  it('should handle different date formats', () => {
    expect(formatDate('2026-01-01')).toBe('Jan 1, 2026');
    expect(formatDate('2026-12-31')).toBe('Dec 31, 2026');
  });

  it('should handle Date objects', () => {
    const date = new Date('2026-06-15');
    const formatted = formatDate(date);
    expect(formatted).toContain('2026');
    expect(formatted).toContain('Jun');
  });

  it('should handle null and undefined', () => {
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
  });

  it('should handle invalid date strings', () => {
    expect(formatDate('invalid')).toBe('invalid');
    expect(formatDate('not-a-date')).toBe('not-a-date');
  });

  it('should handle empty string', () => {
    expect(formatDate('')).toBe('');
  });
});
