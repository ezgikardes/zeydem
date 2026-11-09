import ProductDetail from "../../../src/components/ProductDetail";
import type { ProductDetail as Product } from "../../../src/lib/product";
import styles from "./page.module.css";

// params holds the [slug] part of the address.
type Props = { params: Promise<{ slug: string }> };

// Runs on the server, on every visit
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  // encodeURIComponent() escapes unknown characters such as "?" or '#'
  const response = await fetch(
    `${process.env.BACKEND_URL}/products/${encodeURIComponent(slug)}`,
  );
  const product: Product = await response.json();

  return (
    <main className={styles.page}>
      <ProductDetail product={product} />
    </main>
  );
}
