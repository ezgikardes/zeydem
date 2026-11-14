import {
  cartCount,
  cartReducer,
  cartTotal,
  lineTotal,
  type CartLine,
} from "./cart";
import { formatPrice } from "./format";
import { fromKurus } from "./money";
import type { Product } from "./product";

// Sample products 1, 2 and 3, as GET /products sends them.
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

const bigOil: Product = {
  id: 2,
  slug: "naturel-sizma-zeytinyagi-5l",
  name: "Natürel Sızma Zeytinyağı",
  photoUrl: "/products/zeytinyagi-5l.png",
  price: "1950.00",
  amount: 5,
  unit: "L",
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

describe("cartReducer: load", () => {
  it("replaces the cart with the given lines", () => {
    const before: CartLine[] = [{ ...oil, quantity: 2 }];
    const saved: CartLine[] = [
      { ...almonds, quantity: 1 },
      { ...oil, quantity: 5 },
    ];

    const lines = cartReducer(before, { type: "load", lines: saved });

    expect(lines).toEqual(saved);
  });
});

describe("cartReducer: setQuantity", () => {
  const start: CartLine[] = [
    { ...oil, quantity: 1 },
    { ...almonds, quantity: 2 },
  ];

  it("sets the line's quantity and leaves the other lines alone", () => {
    const lines = cartReducer(start, {
      type: "setQuantity",
      id: almonds.id,
      quantity: 3,
    });

    expect(lines).toEqual([
      { ...oil, quantity: 1 },
      { ...almonds, quantity: 3 },
    ]);
  });

  it("lowers the quantity down to 1", () => {
    const lines = cartReducer(start, {
      type: "setQuantity",
      id: almonds.id,
      quantity: 1,
    });

    expect(lines[1].quantity).toBe(1);
  });

  it.each([0, 11, 2.5])("ignores a quantity of %s", (quantity) => {
    const lines = cartReducer(start, {
      type: "setQuantity",
      id: almonds.id,
      quantity,
    });

    expect(lines).toEqual(start);
  });

  it("ignores an id that is not in the cart", () => {
    const lines = cartReducer(start, {
      type: "setQuantity",
      id: bigOil.id,
      quantity: 3,
    });

    expect(lines).toEqual(start);
  });

  it("does not modify the cart it receives", () => {
    cartReducer(start, { type: "setQuantity", id: almonds.id, quantity: 3 });

    expect(start).toEqual([
      { ...oil, quantity: 1 },
      { ...almonds, quantity: 2 },
    ]);
  });
});

describe("totals", () => {
  const threeLines: CartLine[] = [
    { ...oil, quantity: 1 },
    { ...bigOil, quantity: 1 },
    { ...almonds, quantity: 2 },
  ];

  it("multiplies a line's price by its quantity", () => {
    expect(lineTotal({ ...almonds, quantity: 2 })).toBe(64000);
  });

  it("adds up every line, and the total reads 3.040,00 TL", () => {
    expect(cartTotal(threeLines)).toBe(304000);
    expect(formatPrice(fromKurus(cartTotal(threeLines)))).toBe("3.040,00 TL");
  });

  it("is 0 for an empty cart", () => {
    expect(cartTotal([])).toBe(0);
  });
});
