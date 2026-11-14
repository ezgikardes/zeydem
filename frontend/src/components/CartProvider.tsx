"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import { cartCount, cartReducer, type CartLine } from "../lib/cart";
import { loadCart, saveCart } from "../lib/cartStorage";
import type { Product } from "../lib/product";

type CartContextValue = {
  lines: CartLine[];
  count: number;
  // false until the saved cart has been read
  loaded: boolean;
  add: (product: Product, quantity: number) => void;
  setQuantity: (id: number, quantity: number) => void;
};

// null until a CartProvider gives it a value
const CartContext = createContext<CartContextValue | null>(null);

export default function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(cartReducer, []);
  const [loaded, setLoaded] = useState(false);

  // Read after the first render
  useEffect(() => {
    dispatch({ type: "load", lines: loadCart() });
    setLoaded(true);
  }, []);

  // Write on every change, but never before the read
  useEffect(() => {
    if (loaded) saveCart(lines);
  }, [lines, loaded]);

  const add = (product: Product, quantity: number) =>
    dispatch({ type: "add", product, quantity });

  const setQuantity = (id: number, quantity: number) =>
    dispatch({ type: "setQuantity", id, quantity });

  const count = cartCount(lines);

  return (
    <CartContext.Provider value={{ lines, count, loaded, add, setQuantity }}>
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
