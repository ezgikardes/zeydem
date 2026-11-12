import { MAX_QUANTITY, type CartLine } from "./cart";

export const CART_KEY = "zeydem-cart-v1";

// Rebuilds one saved line field by field, or returns null if it breaks a rule.
function toCartLine(value: unknown): CartLine | null {
  if (typeof value !== "object" || value === null) return null;

  const line = value as Record<string, unknown>;

  const valid =
    typeof line.id === "number" &&
    typeof line.slug === "string" &&
    typeof line.name === "string" &&
    typeof line.photoUrl === "string" &&
    typeof line.price === "string" &&
    typeof line.amount === "number" &&
    typeof line.unit === "string" &&
    Number.isInteger(line.quantity) &&
    (line.quantity as number) >= 1 &&
    (line.quantity as number) <= MAX_QUANTITY;
  if (!valid) return null;

  // Field by field, so extra fields in the record are dropped.
  return {
    id: line.id as number,
    slug: line.slug as string,
    name: line.name as string,
    photoUrl: line.photoUrl as string,
    price: line.price as string,
    amount: line.amount as number,
    unit: line.unit as string,
    quantity: line.quantity as number,
  };
}

// The saved cart, or [] if there is none or any part of it is broken.
export function loadCart(): CartLine[] {
  try {
    const saved = localStorage.getItem(CART_KEY);
    if (saved === null) return [];

    const value: unknown = JSON.parse(saved);
    if (!Array.isArray(value)) return [];

    const lines: CartLine[] = [];
    for (const item of value) {
      const line = toCartLine(item);
      // One broken line, or a second line for the same product, empties the whole cart.
      if (line === null || lines.some((l) => l.id === line.id)) return [];
      lines.push(line);
    }
    return lines;
  } catch {
    // Unreadable JSON, or localStorage cannot be reached
    return [];
  }
}

export function saveCart(lines: CartLine[]): void {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(lines));
  } catch {
    // Storage full or blocked: the cart keeps working in memory.
  }
}
