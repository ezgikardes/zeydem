import { ProductList } from './ProductList';
import { products } from '../data/products';

export default function Products() {
  return (
    <section id="products" className="products-section">
      <div className="container">
        <h2 className="section-title">Ürünlerimiz</h2>
        <ProductList products={products} />
      </div>
    </section>
  );
}
