// Intl.NumberFormat is built into the browser&Node: it knows Turkish number formats.
const priceFormat = new Intl.NumberFormat("tr-TR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const amountFormat = new Intl.NumberFormat("tr-TR", {
  maximumFractionDigits: 2,
});

// The price comes as a string. Number() is used only to display, never to calculate.
export function formatPrice(price: string): string {
  return `${priceFormat.format(Number(price))} TL`;
}

export function formatAmount(amount: number, unit: string): string {
  return `${amountFormat.format(amount)} ${unit}`;
}
