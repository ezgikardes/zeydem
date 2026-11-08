import ProductGrid from "../../src/components/ProductGrid";
import type { Product } from "../../src/lib/product";

// Render on every visit, not once at build time
export const dynamic = "force-dynamic";

// Runs on the server, not in the browser: the page only fetches and shows the products, and the visitor never learns the backend's address.
export default async function ProductsPage() {
  const response = await fetch(`${process.env.BACKEND_URL}/products`);
  const products: Product[] = await response.json();

  return (
    <main>
      <h1>Ürünlerimiz</h1>
      <ProductGrid products={products} />
    </main>
  );
}
