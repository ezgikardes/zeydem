import ProductGrid from "../../src/components/ProductGrid";
import type { Product } from "../../src/lib/product";
import styles from "./page.module.css";

// Render on every visit, not once at build time
export const dynamic = "force-dynamic";

// Runs on the server, not in the browser: the page only fetches and shows the products, and the visitor never learns the backend's address.
export default async function ProductsPage() {
  const response = await fetch(`${process.env.BACKEND_URL}/products`);
  const products: Product[] = await response.json();

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Ürünlerimiz</h1>
      <ProductGrid products={products} />
    </main>
  );
}
