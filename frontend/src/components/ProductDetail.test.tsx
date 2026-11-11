import { render, screen, within } from "@testing-library/react";
import CartProvider from "./CartProvider";
import ProductDetail from "./ProductDetail";
import type { ProductDetail as Product } from "../lib/product";

// Sample product 1, written as GET /products/{slug} sends it.
const product: Product = {
  id: 1,
  slug: "naturel-sizma-zeytinyagi-1l",
  name: "Natürel Sızma Zeytinyağı",
  photoUrl: "/products/zeytinyagi-1l.png",
  price: "450.00",
  amount: 1,
  unit: "L",
  description:
    "Manisa'daki bahçemizin zeytinlerinden sıkılan natürel sızma zeytinyağı.",
};

// "Sepete ekle" reads the cart, so the page is drawn inside a CartProvider
describe("ProductDetail", () => {
  it("shows the name, photo, amount, price and description", () => {
    render(<ProductDetail product={product} />, { wrapper: CartProvider });

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Natürel Sızma Zeytinyağı",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Natürel Sızma Zeytinyağı" }),
    ).toHaveAttribute("src", "/products/zeytinyagi-1l.png");
    expect(screen.getByText("450,00 TL")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Açıklama" }),
    ).toBeInTheDocument();
    expect(screen.getByText(product.description)).toBeInTheDocument();
  });

  it("shows the breadcrumb with a link back to the list", () => {
    render(<ProductDetail product={product} />, { wrapper: CartProvider });

    // within() keeps the search inside the breadcrumb
    const breadcrumb = within(
      screen.getByRole("navigation", { name: "Sayfa yolu" }),
    );
    expect(breadcrumb.getByRole("link", { name: "Ürünler" })).toHaveAttribute(
      "href",
      "/urunler",
    );
    expect(
      breadcrumb.getByText("Natürel Sızma Zeytinyağı 1 L"),
    ).toBeInTheDocument();
  });

  it("offers the quantity picker and Sepete ekle", () => {
    render(<ProductDetail product={product} />, { wrapper: CartProvider });

    expect(screen.getByRole("group", { name: "Adet" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sepete ekle" }),
    ).toBeInTheDocument();
  });
});
