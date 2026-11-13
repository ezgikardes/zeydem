"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import styles from "./SiteHeader.module.css";

export default function SiteHeader() {
  const { count } = useCart();

  return (
    <header className={styles.header}>
      <Link className={styles.brand} href="/">
        Zeydem
      </Link>
      <nav className={styles.nav} aria-label="Ana menü">
        <Link className={styles.link} href="/urunler">
          Ürünler
        </Link>
        <Link className={styles.cart} href="/sepet">
          {`Sepet (${count})`}
        </Link>
      </nav>
    </header>
  );
}
