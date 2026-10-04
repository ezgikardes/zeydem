export function formatPrice(amount: number): string {
  return `${amount.toFixed(2)} TL`;
}

export function formatPriceKurus(kurus: number): string {
  const lira = Math.trunc(kurus / 100);
  const kalan = kurus % 100;
  return `${lira.toLocaleString('tr-TR')},${String(kalan).padStart(2, '0')} TL`;
}
