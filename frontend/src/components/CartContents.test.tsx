import { fireEvent, render, screen, within } from "@testing-library/react";
import CartContents from "./CartContents";
import CartProvider from "./CartProvider";
import SiteHeader from "./SiteHeader";
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
function renderCartContents(lines: CartLine[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(lines));
  render(
    <CartProvider>
      <CartContents />
    </CartProvider>,
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe("the cart contents", () => {
  it("shows one row per line and the total", () => {
    renderCartContents(threeLines);

    expect(
      screen.getByRole("heading", { name: "Sepetim" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(4);
    // "Toplam" is the column name
    expect(screen.getAllByText("Toplam")).toHaveLength(2);
    expect(screen.getByText("3.040,00 TL")).toBeInTheDocument();
  });

  it("shows the amount, unit price, quantity and line total in a row", () => {
    renderCartContents(threeLines);

    const almonds = within(screen.getByRole("row", { name: /Çiğ Badem/ }));
    expect(almonds.getByText("500 g")).toBeInTheDocument();
    expect(almonds.getByText("320,00 TL")).toBeInTheDocument();
    expect(almonds.getByText("2")).toBeInTheDocument();
    expect(almonds.getByText("640,00 TL")).toBeInTheDocument();
  });

  it("links the name to the product page and names the photo", () => {
    renderCartContents(threeLines);

    expect(screen.getByRole("link", { name: "Çiğ Badem" })).toHaveAttribute(
      "href",
      "/urunler/cig-badem-500g",
    );
    expect(screen.getByRole("img", { name: "Çiğ Badem" })).toBeInTheDocument();
  });

  it("shows only the heading when the cart is empty", () => {
    renderCartContents([]);

    expect(
      screen.getByRole("heading", { name: "Sepetim" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});

describe("changing a quantity in the cart", () => {
  // With the header, so the count can be checked too
  function renderCartPage(lines: CartLine[]) {
    localStorage.setItem(CART_KEY, JSON.stringify(lines));
    render(
      <CartProvider>
        <SiteHeader />
        <CartContents />
      </CartProvider>,
    );
  }

  const almondsPicker = () =>
    within(screen.getByRole("group", { name: "Çiğ Badem 500 g adedi" }));

  it("updates the row, the total, the header and the saved cart", () => {
    renderCartPage(threeLines);

    fireEvent.click(almondsPicker().getByRole("button", { name: "Artır" }));

    const almonds = within(screen.getByRole("row", { name: /Çiğ Badem/ }));
    expect(almondsPicker().getByText("3")).toBeInTheDocument();
    expect(almonds.getByText("960,00 TL")).toBeInTheDocument();
    expect(screen.getByText("3.360,00 TL")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sepet (5)" })).toBeInTheDocument();

    const saved: CartLine[] = JSON.parse(localStorage.getItem(CART_KEY)!);
    expect(saved.find((line) => line.id === 3)?.quantity).toBe(3);
  });

  it("goes down to 1, where Azalt is disabled", () => {
    renderCartPage(threeLines);

    fireEvent.click(almondsPicker().getByRole("button", { name: "Azalt" }));

    expect(almondsPicker().getByText("1")).toBeInTheDocument();
    expect(almondsPicker().getByRole("button", { name: "Azalt" })).toBeDisabled();
  });

  it("disables Artır at 10", () => {
    const tenAlmonds = threeLines.map((line) =>
      line.id === 3 ? { ...line, quantity: 10 } : line,
    );
    renderCartPage(tenAlmonds);

    expect(almondsPicker().getByRole("button", { name: "Artır" })).toBeDisabled();
  });
});
