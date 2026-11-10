import ProductGrid from "../../src/components/ProductGrid";
import type { Product } from "../../src/lib/product";
import { BACKEND_TIMEOUT_MS } from "../../src/lib/backend";
import styles from "./page.module.css";

// Render on every visit, not once at build time
export const dynamic = "force-dynamic";

// Runs on the server, so visitor never learns the backend's address.
export default async function ProductsPage() {
  const response = await fetch(`${process.env.BACKEND_URL}/products`, {
    signal: AbortSignal.timeout(BACKEND_TIMEOUT_MS),
  });
  const products: Product[] = await response.json();

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Ürünlerimiz</h1>
      <ProductGrid products={products} />
    </main>
  );
}
