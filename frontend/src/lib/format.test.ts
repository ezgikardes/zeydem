import { formatAmount, formatPrice } from './format';

// Display formats from docs/features/product-list/spec.md.
describe('formatPrice', () => {
  it('writes the price the Turkish way, with two decimals and TL', () => {
    expect(formatPrice('450.00')).toBe('450,00 TL');
  });

  // The contract sends the price as a string, so the dot is a decimal point, not a thousands sign.
  it('groups the thousands with a dot', () => {
    expect(formatPrice('1950.00')).toBe('1.950,00 TL');
  });
});

describe('formatAmount', () => {
  it('drops the trailing zeros and joins the unit with a space', () => {
    expect(formatAmount(1, 'L')).toBe('1 L');
    expect(formatAmount(0.5, 'L')).toBe('0,5 L');
    expect(formatAmount(500, 'g')).toBe('500 g');
  });
});
