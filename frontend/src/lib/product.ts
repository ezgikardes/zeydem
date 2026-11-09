// One product as GET /products sends it.
export type Product = {
  id: number;
  slug: string;
  name: string;
  photoUrl: string;
  price: string;
  amount: number;
  unit: string;
};

// One product as GET /products/{slug} sends it: the list fields plus the description.
export type ProductDetail = Product & {
  description: string;
};
