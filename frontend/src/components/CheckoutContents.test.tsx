import { fireEvent, render, screen, within } from "@testing-library/react";
import CheckoutContents from "./CheckoutContents";
import CartProvider from "./CartProvider";
import type { CartLine } from "../lib/cart";
import { CART_KEY } from "../lib/cartStorage";

// The three-line cart of ZEY-20, so the totals can be compared with the cart page
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

// Each label of the delivery form, with something a customer would type into it
const fields: [string, string][] = [
  ["Ad soyad", "Ayşe Yılmaz"],
  ["Telefon", "0532 123 45 67"],
  ["E-posta", "ayse@ornek.com"],
  ["İl", "Manisa"],
  ["İlçe", "Akhisar"],
  ["Açık adres", "Zeytinli Mah. 12. Sok. No: 4"],
];

// Saves the cart a visitor added, then opens the page
function renderCheckout(lines: CartLine[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(lines));
  render(
    <CartProvider>
      <CheckoutContents />
    </CartProvider>,
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe("the checkout page", () => {
  it("shows the heading, both sections and the six fields", () => {
    renderCheckout(threeLines);

    expect(
      screen.getByRole("heading", { level: 1, name: "Siparişi tamamla" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Teslimat bilgileri" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Sipariş özeti" }),
    ).toBeInTheDocument();
    for (const [label] of fields) {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    }
  });

  it.each(fields)("keeps what the customer types into %s", (label, typed) => {
    renderCheckout(threeLines);

    fireEvent.change(screen.getByLabelText(label), {
      target: { value: typed },
    });

    expect(screen.getByLabelText(label)).toHaveValue(typed);
  });

  it("lists every line with its quantity and total, and the order total", () => {
    renderCheckout(threeLines);

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    // In the cart's order: the almonds are the third line
    const almonds = within(items[2]);
    expect(almonds.getByText("Çiğ Badem 500 g × 2")).toBeInTheDocument();
    expect(almonds.getByText("640,00 TL")).toBeInTheDocument();
    expect(screen.getByText("Toplam")).toBeInTheDocument();
    expect(screen.getByText("3.040,00 TL")).toBeInTheDocument();
  });

  it("shows the empty cart message and no form when the cart is empty", () => {
    renderCheckout([]);

    expect(screen.getByText("Sepetiniz boş")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sepete dön" })).toHaveAttribute(
      "href",
      "/sepet",
    );
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });
});
