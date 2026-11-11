"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import QuantityInput from "./QuantityInput";
import type { Product } from "../lib/product";
import styles from "./AddToCart.module.css";

export default function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);

  return (
    <div className={styles.row}>
      <QuantityInput value={quantity} onChange={setQuantity} />
      <button
        className={styles.button}
        type="button"
        onClick={() => add(product, quantity)}
      >
        Sepete ekle
      </button>
    </div>
  );
}
