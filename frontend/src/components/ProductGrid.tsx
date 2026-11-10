import type { Product } from "../lib/product";
import ProductCard from "./ProductCard";
import styles from "./ProductGrid.module.css";

export default function ProductGrid({ products }: { products: Product[] }) {
  // "no product" message when the list is empty
  if (products.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>Henüz ürün yok</p>
        <p className={styles.emptyText}>
          Yeni hasat ürünleri yakında burada olacak.
        </p>
      </div>
    );
  }

  return (
    <ul className={styles.grid}>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
