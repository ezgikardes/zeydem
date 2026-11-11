"use client";

import { createContext, useContext, useReducer, type ReactNode } from "react";
import { cartCount, cartReducer, type CartLine } from "../lib/cart";

type CartContextValue = {
  lines: CartLine[];
  count: number;
};

const CartContext = createContext<CartContextValue>({ lines: [], count: 0 });

export default function CartProvider({ children }: { children: ReactNode }) {
  const [lines] = useReducer(cartReducer, []);

  return (
    <CartContext.Provider value={{ lines, count: cartCount(lines) }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  return useContext(CartContext);
}
