import { render, screen, within } from "@testing-library/react";
import ProductGrid from "./ProductGrid";
import type { Product } from "../lib/product";

// The three seed products, written as the backend sends them.
const products: Product[] = [
  {
    id: 1,
    name: "Natürel Sızma Zeytinyağı",
    photoUrl: "/products/zeytinyagi-1l.png",
    price: "450.00",
    amount: 1,
    unit: "L",
  },
  {
    id: 2,
    name: "Natürel Sızma Zeytinyağı",
    photoUrl: "/products/zeytinyagi-5l.png",
    price: "1950.00",
    amount: 5,
    unit: "L",
  },
  {
    id: 3,
    name: "Çiğ Badem",
    photoUrl: "/products/badem-500g.jpg",
    price: "320.00",
    amount: 500,
    unit: "g",
  },
];

describe("ProductGrid", () => {
  it("shows one card per product with its photo, name, amount and price", () => {
    render(<ProductGrid products={products} />);

    const cards = screen.getAllByRole("listitem");
    expect(cards).toHaveLength(3);

    // What each product above should look like on screen, card by card.
    const expected = [
      {
        name: "Natürel Sızma Zeytinyağı",
        amount: "1 L",
        price: "450,00 TL",
        photo: "/products/zeytinyagi-1l.png",
      },
      {
        name: "Natürel Sızma Zeytinyağı",
        amount: "5 L",
        price: "1.950,00 TL",
        photo: "/products/zeytinyagi-5l.png",
      },
      {
        name: "Çiğ Badem",
        amount: "500 g",
        price: "320,00 TL",
        photo: "/products/badem-500g.jpg",
      },
    ];

    // within() looks only inside one card, so a price cannot be found on the wrong product.
    expected.forEach((product, i) => {
      const card = within(cards[i]);
      expect(card.getByText(product.name)).toBeInTheDocument();
      expect(card.getByText(product.amount)).toBeInTheDocument();
      expect(card.getByText(product.price)).toBeInTheDocument();
      expect(card.getByRole("img", { name: product.name })).toHaveAttribute(
        "src",
        product.photo,
      );
    });
  });
});
