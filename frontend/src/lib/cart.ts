import type { Product } from "./product";

// One product in the cart: the product's fields plus how many of it.
export type CartLine = Product & {
  quantity: number;
};

export type CartAction = { type: "add"; product: Product; quantity: number };

export function cartReducer(lines: CartLine[], action: CartAction): CartLine[] {
  const { product, quantity } = action;
  const inCart = lines.some((line) => line.id === product.id);

  if (!inCart) {
    return [...lines, { ...product, quantity }];
  }

  return lines.map((line) =>
    line.id === product.id
      ? { ...line, quantity: line.quantity + quantity }
      : line,
  );
}
