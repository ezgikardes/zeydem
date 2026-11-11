import { cartCount, cartReducer, type CartLine } from "./cart";
import type { Product } from "./product";

// Sample products 1 and 3, as GET /products sends them.
const oil: Product = {
  id: 1,
  slug: "naturel-sizma-zeytinyagi-1l",
  name: "Natürel Sızma Zeytinyağı",
  photoUrl: "/products/zeytinyagi-1l.png",
  price: "450.00",
  amount: 1,
  unit: "L",
};

const almonds: Product = {
  id: 3,
  slug: "cig-badem-500g",
  name: "Çiğ Badem",
  photoUrl: "/products/badem-500g.jpg",
  price: "320.00",
  amount: 500,
  unit: "g",
};

describe("cartReducer: add", () => {
  it("adds a new product as a new line with the given quantity", () => {
    const lines = cartReducer([], { type: "add", product: oil, quantity: 2 });

    expect(lines).toEqual([{ ...oil, quantity: 2 }]);
  });

  it("adds up the quantity when the same product is added again", () => {
    const start: CartLine[] = [{ ...oil, quantity: 2 }];

    const lines = cartReducer(start, {
      type: "add",
      product: oil,
      quantity: 1,
    });

    expect(lines).toEqual([{ ...oil, quantity: 3 }]);
  });

  it("keeps another product on its own line, and counts every item", () => {
    const start: CartLine[] = [{ ...oil, quantity: 2 }];

    const lines = cartReducer(start, {
      type: "add",
      product: almonds,
      quantity: 1,
    });

    expect(lines).toEqual([
      { ...oil, quantity: 2 },
      { ...almonds, quantity: 1 },
    ]);
    expect(cartCount(lines)).toBe(3);
  });

  it("stops a line at 10", () => {
    const start: CartLine[] = [{ ...oil, quantity: 8 }];

    const lines = cartReducer(start, {
      type: "add",
      product: oil,
      quantity: 5,
    });

    expect(lines[0].quantity).toBe(10);
  });

  it("keeps only the line's own fields when the product carries more", () => {
    // The product page sends the product with its description.
    const withDescription = { ...oil, description: "Uzun bir açıklama." };

    const lines = cartReducer([], {
      type: "add",
      product: withDescription,
      quantity: 1,
    });

    expect(lines).toEqual([{ ...oil, quantity: 1 }]);
  });

  // React compares the old and new cart to decide whether to redraw
  it("does not change the list it is given", () => {
    const start: CartLine[] = [{ ...oil, quantity: 2 }];

    cartReducer(start, { type: "add", product: oil, quantity: 1 });

    expect(start).toEqual([{ ...oil, quantity: 2 }]);
  });
});
