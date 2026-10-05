import type { Product } from '../components/ProductList';
import bottledOliveOil from '../assets/products/bottled-oliveoil.png';
import tinnedOliveOil from '../assets/products/tinned-oliveoil.png';

export const products: Product[] = [
  {
    id: 'zy-1l',
    name: 'Natürel Sızma Zeytinyağı · 1 L',
    image: bottledOliveOil.src,
    priceKurus: 40000,
  },
  {
    id: 'zy-5l',
    name: 'Natürel Sızma Zeytinyağı · 5 L',
    image: tinnedOliveOil.src,
    priceKurus: 160000,
  },
  {
    id: 'ib-500',
    name: 'İç Badem · 500 g',
    image: '',
    priceKurus: 32000,
  },
];
