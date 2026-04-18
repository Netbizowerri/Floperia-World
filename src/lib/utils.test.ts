import { describe, it, expect } from 'vitest';
import { formatPrice, cn } from './utils';

describe('Utility Functions', () => {
  describe('formatPrice', () => {
    it('formats numbers as Naira currency', () => {
      // Note: Intl.NumberFormat might use non-breaking spaces or different symbols depending on environment
      // We check if it contains the currency code or symbol and the number
      const formatted = formatPrice(5000);
      expect(formatted).toContain('5,000');
      expect(formatted).toMatch(/NGN|₦/);
    });

    it('handles zero correctly', () => {
      const formatted = formatPrice(0);
      expect(formatted).toContain('0');
    });
  });

  describe('cn', () => {
    it('merges tailwind classes correctly', () => {
      expect(cn('px-2', 'py-2')).toBe('px-2 py-2');
      expect(cn('px-2', 'px-4')).toBe('px-4');
      expect(cn('text-red-500', { 'bg-blue-500': true, 'bg-green-500': false })).toBe('text-red-500 bg-blue-500');
    });
  });
});
