"use client";

import { createContext, useContext, useReducer, type ReactNode } from "react";
import { cartCount, cartReducer, type CartLine } from "../lib/cart";
import type { Product } from "../lib/product";

type CartContextValue = {
  lines: CartLine[];
  count: number;
  add: (product: Product, quantity: number) => void;
};

// null until a CartProvider gives it a value
const CartContext = createContext<CartContextValue | null>(null);

export default function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(cartReducer, []);

  const add = (product: Product, quantity: number) =>
    dispatch({ type: "add", product, quantity });

  const count = cartCount(lines);

  return (
    <CartContext.Provider value={{ lines, count, add }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const cart = useContext(CartContext);
  if (cart === null) {
    throw new Error("useCart must be used inside a CartProvider");
  }
  return cart;
}
