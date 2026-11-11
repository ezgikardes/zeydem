import { fireEvent, render, screen } from "@testing-library/react";
import AddToCart from "./AddToCart";
import CartProvider from "./CartProvider";
import SiteHeader from "./SiteHeader";
import type { Product } from "../lib/product";

const oil: Product = {
  id: 1,
  slug: "naturel-sizma-zeytinyagi-1l",
  name: "Natürel Sızma Zeytinyağı",
  photoUrl: "/products/zeytinyagi-1l.png",
  price: "450.00",
  amount: 1,
  unit: "L",
};

// The header and the button share one cart, as on a product page.
function renderProductPage() {
  render(
    <CartProvider>
      <SiteHeader />
      <AddToCart product={oil} />
    </CartProvider>,
  );
}

describe("the cart on a product page", () => {
  it("starts at Sepet (0), with links to the home page and the product list", () => {
    renderProductPage();

    expect(screen.getByText("Sepet (0)")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Zeydem" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Ürünler" })).toHaveAttribute("href", "/urunler");
  });

  it("counts what Sepete ekle adds", () => {
    renderProductPage();

    fireEvent.click(screen.getByRole("button", { name: "Artır" }));
    fireEvent.click(screen.getByRole("button", { name: "Sepete ekle" }));
    expect(screen.getByText("Sepet (2)")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Azalt" }));
    fireEvent.click(screen.getByRole("button", { name: "Sepete ekle" }));
    expect(screen.getByText("Sepet (3)")).toBeInTheDocument();
  });

  it("fails at once when there is no CartProvider", () => {
    // React prints the thrown error to the console; hide it so the test output stays readable.
    jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<SiteHeader />)).toThrow();

    jest.restoreAllMocks();
  });
});
