import type { ProductDetail as Product } from "../lib/product";
import { formatAmount, formatPrice } from "../lib/format";
import styles from "./ProductDetail.module.css";

export default function ProductDetail({ product }: { product: Product }) {
  return (
    <article className={styles.detail}>
      <img className={styles.photo} src={product.photoUrl} alt={product.name} />
      <div className={styles.info}>
        <h1 className={styles.name}>{product.name}</h1>
        <p className={styles.amount}>{formatAmount(product.amount, product.unit)}</p>
        <p className={styles.price}>{formatPrice(product.price)}</p>
        <h2 className={styles.heading}>Açıklama</h2>
        <p className={styles.description}>{product.description}</p>
      </div>
    </article>
  );
}
