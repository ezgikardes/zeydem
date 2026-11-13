import ProductGrid from "../../../src/components/ProductGrid";
import type { Product } from "../../../src/lib/product";
import { BACKEND_TIMEOUT_MS } from "../../../src/lib/backend";
import styles from "./page.module.css";

// Render on every visit, not once at build time
export const dynamic = "force-dynamic";

// Runs on the server, so visitor never learns the backend's address.
export default async function ProductsPage() {
  const response = await fetch(`${process.env.BACKEND_URL}/products`, {
    signal: AbortSignal.timeout(BACKEND_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`Backend answered ${response.status} for /products`);
  }
  const body: unknown = await response.json();
  // Only checks that a list came back
  if (!Array.isArray(body)) {
    throw new Error("Backend did not answer a list for /products");
  }
  const products: Product[] = body;

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Ürünlerimiz</h1>
      <ProductGrid products={products} />
    </main>
  );
}
