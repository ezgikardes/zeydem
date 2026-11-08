import type { Product } from "../lib/product";
import ProductCard from "./ProductCard";
import styles from "./ProductGrid.module.css";

export default function ProductGrid({ products }: { products: Product[] }) {
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
