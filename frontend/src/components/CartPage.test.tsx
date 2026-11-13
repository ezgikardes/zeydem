import { render, screen, within } from "@testing-library/react";
import CartPage from "./CartPage";
import CartProvider from "./CartProvider";
import type { CartLine } from "../lib/cart";
import { CART_KEY } from "../lib/cartStorage";

// The three-line cart of the ticket
const threeLines: CartLine[] = [
  {
    id: 1,
    slug: "naturel-sizma-zeytinyagi-1l",
    name: "Natürel Sızma Zeytinyağı",
    photoUrl: "/products/zeytinyagi-1l.png",
    price: "450.00",
    amount: 1,
    unit: "L",
    quantity: 1,
  },
  {
    id: 2,
    slug: "naturel-sizma-zeytinyagi-5l",
    name: "Natürel Sızma Zeytinyağı",
    photoUrl: "/products/zeytinyagi-5l.png",
    price: "1950.00",
    amount: 5,
    unit: "L",
    quantity: 1,
  },
  {
    id: 3,
    slug: "cig-badem-500g",
    name: "Çiğ Badem",
    photoUrl: "/products/badem-500g.jpg",
    price: "320.00",
    amount: 500,
    unit: "g",
    quantity: 2,
  },
];

// Saves the cart a visitor added, then opens the page
function renderCartPage(lines: CartLine[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(lines));
  render(
    <CartProvider>
      <CartPage />
    </CartProvider>,
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe("the cart page", () => {
  it("shows one row per line and the total", () => {
    renderCartPage(threeLines);

    expect(
      screen.getByRole("heading", { name: "Sepetim" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(4);
    // "Toplam" is the column name
    expect(screen.getAllByText("Toplam")).toHaveLength(2);
    expect(screen.getByText("3.040,00 TL")).toBeInTheDocument();
  });

  it("shows the amount, unit price, quantity and line total in a row", () => {
    renderCartPage(threeLines);

    const almonds = within(screen.getByRole("row", { name: /Çiğ Badem/ }));
    expect(almonds.getByText("500 g")).toBeInTheDocument();
    expect(almonds.getByText("320,00 TL")).toBeInTheDocument();
    expect(almonds.getByText("2")).toBeInTheDocument();
    expect(almonds.getByText("640,00 TL")).toBeInTheDocument();
  });

  it("links the name to the product page and names the photo", () => {
    renderCartPage(threeLines);

    expect(screen.getByRole("link", { name: "Çiğ Badem" })).toHaveAttribute(
      "href",
      "/urunler/cig-badem-500g",
    );
    expect(screen.getByRole("img", { name: "Çiğ Badem" })).toBeInTheDocument();
  });

  it("shows only the heading when the cart is empty", () => {
    renderCartPage([]);

    expect(
      screen.getByRole("heading", { name: "Sepetim" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});
