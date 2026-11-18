"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import styles from "./CheckoutContents.module.css";

export default function CheckoutContents() {
  const { lines, loaded } = useCart();

  return (
    <>
      <h1 className={styles.title}>Siparişi tamamla</h1>
      {/* Nothing until the saved cart is read */}
      {loaded && lines.length === 0 && (
        <div className={styles.empty}>
          <p className={styles.emptyText}>Sepetiniz boş</p>
          <Link
            className={styles.back}
            href="/sepet">
            Sepete dön
          </Link>
        </div>
      )}
    </>
  );
}
