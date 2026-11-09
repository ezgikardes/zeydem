import Link from "next/link";
import type { Product } from "../lib/product";
import { formatAmount, formatPrice } from "../lib/format";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product }: { product: Product }) {
  // The whole card is the link, so photo and name both open the product's page.
  return (
    <Link
      className={styles.link}
      href={`/urunler/${product.slug}`}>
      <article className={styles.card}>
        <img
          className={styles.photo}
          src={product.photoUrl}
          alt={product.name}
        />
        <div className={styles.body}>
          <h3 className={styles.name}>{product.name}</h3>
          <p className={styles.amount}>
            {formatAmount(product.amount, product.unit)}
          </p>
          <p className={styles.price}>{formatPrice(product.price)}</p>
        </div>
      </article>
    </Link>
  );
}
