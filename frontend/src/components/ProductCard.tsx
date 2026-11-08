import type { Product } from "../lib/product";
import { formatAmount, formatPrice } from "../lib/format";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article>
      <img
        src={product.photoUrl}
        alt={product.name}
      />
      <h3>{product.name}</h3>
      <p>{formatAmount(product.amount, product.unit)}</p>
      <p>{formatPrice(product.price)}</p>
    </article>
  );
}
