import { render, screen } from '@testing-library/react';
import { ProductList, type Product } from './ProductList';

const products: Product[] = [
  { id: 'zy-1l', name: 'Natürel Sızma Zeytinyağı', image: '/urunler/zeytinyagi.jpg', priceKurus: 40000 },
  { id: 'ib-500', name: 'İç Badem', image: '/urunler/ic-badem.jpg', priceKurus: 32000 },
  { id: 'kb-1kg', name: 'Kabuklu Badem', image: '/urunler/kabuklu-badem.jpg', priceKurus: 24000 },
];

describe('ProductList', () => {
  test('renders one card per product', () => {
    render(<ProductList products={products} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  test('shows a photo, a name and a price with currency on every card', () => {
    render(<ProductList products={products} />);

    expect(screen.getByAltText('Natürel Sızma Zeytinyağı')).toBeInTheDocument();
    expect(screen.getByText('Natürel Sızma Zeytinyağı')).toBeInTheDocument();
    expect(screen.getByText('400,00 TL')).toBeInTheDocument();
    expect(screen.getByText('320,00 TL')).toBeInTheDocument();
  });

  test('still shows the name and the price when the photo is missing', () => {
    render(<ProductList products={[{ ...products[0], image: '' }]} />);

    expect(screen.getByText('Natürel Sızma Zeytinyağı')).toBeInTheDocument();
    expect(screen.getByText('400,00 TL')).toBeInTheDocument();
  });

  test('renders no card and shows a message when the list is empty', () => {
    render(<ProductList products={[]} />);

    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    expect(screen.getByText('Henüz ürün yok')).toBeInTheDocument();
  });
});
