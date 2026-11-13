import { toKurus } from "./money";
import type { Product } from "./product";

// One product in the cart: the product's fields plus how many of it.
export type CartLine = Product & {
  quantity: number;
};

// The most of one product a cart can hold.
export const MAX_QUANTITY = 10;

export type CartAction =
  | { type: "add"; product: Product; quantity: number }
  // Puts the saved cart in place when the site opens.
  | { type: "load"; lines: CartLine[] };

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

  const { product, quantity } = action;
  const inCart = lines.some((line) => line.id === product.id);

  if (!inCart) {
    // Field by field, not ...product
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
