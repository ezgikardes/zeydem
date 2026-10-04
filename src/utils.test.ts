import { formatPrice, formatPriceKurus } from './utils';

describe('formatPrice', () => {
  test('formats with two decimals', () => {
    expect(formatPrice(12.5)).toBe('12.50 TL');
  });

  test('formats a whole number too', () => {
    expect(formatPrice(100)).toBe('100.00 TL');
  });
});

describe('formatPriceKurus', () => {
  test('formats a whole lira amount', () => {
    expect(formatPriceKurus(40000)).toBe('400,00 TL');
  });

  test('formats an amount that has kurus', () => {
    expect(formatPriceKurus(32505)).toBe('325,05 TL');
  });

  test('separates thousands', () => {
    expect(formatPriceKurus(160000)).toBe('1.600,00 TL');
  });

  test('formats an amount smaller than one lira', () => {
    expect(formatPriceKurus(5)).toBe('0,05 TL');
  });

  test('formats zero', () => {
    expect(formatPriceKurus(0)).toBe('0,00 TL');
  });

  test('does not render a negative amount as a well-formed price', () => {
    const wellFormedPrice = /^-?\d{1,3}(\.\d{3})*,\d{2} TL$/;

    expect(formatPriceKurus(-32505)).not.toMatch(wellFormedPrice);
  });
});
