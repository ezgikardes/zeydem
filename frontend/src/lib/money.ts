// Pattern of Price: Digits, then optionally a dot and one or two digits
export const PRICE_PATTERN = /^\d+(\.\d{1,2})?$/;

export function toKurus(price: string): number {
  if (!PRICE_PATTERN.test(price)) {
    throw new Error(`Not a price: "${price}"`);
  }
  // Split the text
  const [lira, kurus = ""] = price.split(".");

  return Number(lira) * 100 + Number(kurus.padEnd(2, "0"));
}

// Back to the shape the backend sends, so formatPrice can show it.
export function fromKurus(kurus: number): string {
  const lira = Math.floor(kurus / 100);
  const rest = kurus % 100;
  return `${lira}.${String(rest).padStart(2, "0")}`;
}
