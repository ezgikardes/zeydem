import { toKurus } from "./money";
import type { Product } from "./product";

// One product in the cart: the product's fields plus how many of it.
export type CartLine = Product & {
  quantity: number;
};

export const MAX_QUANTITY = 10;

export type CartAction =
  | { type: "add"; product: Product; quantity: number }
  | { type: "load"; lines: CartLine[] }
  | { type: "setQuantity"; id: number; quantity: number };

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

export function lineTotal(line: CartLine): number {
  return toKurus(line.price) * line.quantity;
}

export function cartTotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + lineTotal(line), 0);
}

export function cartReducer(lines: CartLine[], action: CartAction): CartLine[] {
  if (action.type === "load") {
    return action.lines;
  }

  if (action.type === "setQuantity") {
    const { id, quantity } = action;
    const allowed =
      Number.isInteger(quantity) && quantity >= 1 && quantity <= MAX_QUANTITY;
    if (!allowed) return lines;
    return lines.map((line) => (line.id === id ? { ...line, quantity } : line));
  }

  const { product, quantity } = action;
  const inCart = lines.some((line) => line.id === product.id);

  if (!inCart) {
    // Field by field, not ...product: it would save the description too
    const line: CartLine = {
      id: product.id,
      slug: product.slug,
      name: product.name,
      photoUrl: product.photoUrl,
      price: product.price,
      amount: product.amount,
      unit: product.unit,
      quantity: quantity,
    };
    return [...lines, line];
  }

  return lines.map((line) =>
    line.id === product.id
      ? { ...line, quantity: Math.min(line.quantity + quantity, MAX_QUANTITY) }
      : line,
  );
}
