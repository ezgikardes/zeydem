"use client";

import { createContext, useContext, useReducer, type ReactNode } from "react";
import { cartCount, cartReducer, type CartLine } from "../lib/cart";
import type { Product } from "../lib/product";

type CartContextValue = {
  lines: CartLine[];
  count: number;
  add: (product: Product, quantity: number) => void;
};

const CartContext = createContext<CartContextValue>({
  lines: [],
  count: 0,
  add: () => {},
});

export default function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(cartReducer, []);

  const add = (product: Product, quantity: number) =>
    dispatch({ type: "add", product, quantity });

  return (
    <CartContext.Provider value={{ lines, count: cartCount(lines), add }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  return useContext(CartContext);
}
