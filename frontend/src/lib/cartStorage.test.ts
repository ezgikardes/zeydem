import type { CartLine } from "./cart";
import { CART_KEY, loadCart, saveCart } from "./cartStorage";

const oilLine: CartLine = {
  id: 1,
  slug: "naturel-sizma-zeytinyagi-1l",
  name: "Natürel Sızma Zeytinyağı",
  photoUrl: "/products/zeytinyagi-1l.png",
  price: "450.00",
  amount: 1,
  unit: "L",
  quantity: 2,
};

const almondLine: CartLine = {
  id: 3,
  slug: "cig-badem-500g",
  name: "Çiğ Badem",
  photoUrl: "/products/badem-500g.jpg",
  price: "320.00",
  amount: 500,
  unit: "g",
  quantity: 1,
};

// Writes a record by hand, as a broken or old record would look.
function store(value: unknown) {
  localStorage.setItem(CART_KEY, JSON.stringify(value));
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("loadCart and saveCart", () => {
  it("returns an empty cart when there is no record", () => {
    expect(loadCart()).toEqual([]);
  });

  it("reads back the lines saveCart wrote", () => {
    saveCart([oilLine, almondLine]);

    expect(loadCart()).toEqual([oilLine, almondLine]);
  });

  it("saves under the key zeydem-cart-v1", () => {
    saveCart([oilLine]);

    expect(CART_KEY).toBe("zeydem-cart-v1");
    expect(JSON.parse(localStorage.getItem("zeydem-cart-v1")!)).toEqual([oilLine]);
  });

  it("returns an empty cart when the record is not valid JSON", () => {
    localStorage.setItem(CART_KEY, '[{"id":1,');

    expect(loadCart()).toEqual([]);
  });

  it("returns an empty cart when the record is JSON but not a list", () => {
    store({ id: 1 });

    expect(loadCart()).toEqual([]);
  });

  // One broken line empties the whole cart, even next to a valid one.
  it.each([
    ["a quantity of 11", { ...almondLine, quantity: 11 }],
    ["a quantity of 0", { ...almondLine, quantity: 0 }],
    ["a quantity that is not whole", { ...almondLine, quantity: 1.5 }],
    ["a missing name", { ...almondLine, name: undefined }],
    ["a price that is a number", { ...almondLine, price: 320 }],
    ["a price that is not a price", { ...almondLine, price: "abc" }],
    ["the same id as the other line", { ...almondLine, id: oilLine.id }],
  ])("returns an empty cart when one line has %s", (_, brokenLine) => {
    store([oilLine, brokenLine]);

    expect(loadCart()).toEqual([]);
  });

  it("reads a price with no decimals", () => {
    store([{ ...almondLine, price: "320" }]);

    expect(loadCart()).toEqual([{ ...almondLine, price: "320" }]);
  });

  it("drops fields that are not part of a cart line", () => {
    store([{ ...oilLine, description: "Soğuk sıkım" }]);

    expect(loadCart()).toEqual([oilLine]);
  });

  it("returns an empty cart and does not throw when localStorage throws", () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });
    jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });

    expect(loadCart()).toEqual([]);
    expect(() => saveCart([oilLine])).not.toThrow();
  });
});
