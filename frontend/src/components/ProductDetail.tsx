import Link from "next/link";
import AddToCart from "./AddToCart";
import type { ProductDetail as Product } from "../lib/product";
import { formatAmount, formatPrice } from "../lib/format";
import styles from "./ProductDetail.module.css";

export default function ProductDetail({ product }: { product: Product }) {
  const amount = formatAmount(product.amount, product.unit);

  return (
    <>
      <nav className={styles.breadcrumb} aria-label="Sayfa yolu">
        <Link className={styles.crumbLink} href="/urunler">
          Ürünler
        </Link>
        {/* The slash is decoration: screen readers skip it. */}
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{`${product.name} ${amount}`}</span>
      </nav>
      <article className={styles.detail}>
        <img className={styles.photo} src={product.photoUrl} alt={product.name} />
        <div className={styles.info}>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.amount}>{amount}</p>
          <p className={styles.price}>{formatPrice(product.price)}</p>
          <h2 className={styles.heading}>Açıklama</h2>
          <p className={styles.description}>{product.description}</p>
          <AddToCart product={product} />
        </div>
      </article>
    </>
  );
}
