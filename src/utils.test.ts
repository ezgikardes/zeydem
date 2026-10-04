import { formatPrice } from './utils';

describe('formatPrice', () => {
  test('iki ondalik basamakla formatlar', () => {
    expect(formatPrice(12.5)).toBe('12.50 TL');
  });

  test('tam sayiyi da formatlar', () => {
    expect(formatPrice(100)).toBe('100.00 TL');
  });
});
