import { formatPriceKurus } from '../utils';

export type Product = {
  id: string;
  name: string;
  image: string;
  priceKurus: number;
};

export function ProductList({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <p className="products-empty">Henüz ürün yok</p>;
  }

  return (
    <ul className="products-row">
      {products.map((product) => (
        <li className="product-card" key={product.id}>
          {product.image ? (
            <img className="product-img" src={product.image} alt={product.name} />
          ) : (
            <div className="product-img product-img-placeholder" aria-hidden="true" />
          )}
          <h3 className="product-title">{product.name}</h3>
          <p className="product-price">{formatPriceKurus(product.priceKurus)}</p>
        </li>
      ))}
    </ul>
  );
}
