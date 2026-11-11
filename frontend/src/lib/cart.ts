import type { Product } from "./product";

// One product in the cart: the product's fields plus how many of it.
export type CartLine = Product & {
  quantity: number;
};

export type CartAction = { type: "add"; product: Product; quantity: number };

// Returns a new list, never changes the one it is given.
export function cartReducer(lines: CartLine[], action: CartAction): CartLine[] {
  return [...lines, { ...action.product, quantity: action.quantity }];
}
