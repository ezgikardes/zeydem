import ProductDetail from "../../../../src/components/ProductDetail";
import type { ProductDetail as Product } from "../../../../src/lib/product";
import { BACKEND_TIMEOUT_MS } from "../../../../src/lib/backend";
import styles from "./page.module.css";

// params holds the [slug] part of the address.
type Props = { params: Promise<{ slug: string }> };

// Runs on the server, on every visit
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  // encodeURIComponent escapes unknown characters such as "?" or '#'
  const response = await fetch(
    `${process.env.BACKEND_URL}/products/${encodeURIComponent(slug)}`,
    { signal: AbortSignal.timeout(BACKEND_TIMEOUT_MS) },
  );
  // Not 200 means there is no product to show. "Ürün bulunamadı" page comes in ZEY-16.
  if (!response.ok) {
    throw new Error(
      `Backend answered ${response.status} for /products/${slug}`,
    );
  }
  const product: Product = await response.json();

  return (
    <main className={styles.page}>
      <ProductDetail product={product} />
    </main>
  );
}
