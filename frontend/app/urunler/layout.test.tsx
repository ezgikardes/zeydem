import { render, screen } from "@testing-library/react";
import ProductsLayout from "./layout";
import CartProvider from "../../src/components/CartProvider";

// next/font downloads fonts while Next.js builds
jest.mock("next/font/google", () => ({
  Fraunces: () => ({ variable: "font-display" }),
  Inter: () => ({ variable: "font-body" }),
}));

describe("/urunler layout", () => {
  it("puts the header with the cart count above every page", () => {
    render(
      <ProductsLayout>
        <p>Sayfanın içeriği</p>
      </ProductsLayout>,
      { wrapper: CartProvider },
    );

    expect(screen.getByRole("banner")).toHaveTextContent("Sepet (0)");
    expect(screen.getByText("Sayfanın içeriği")).toBeInTheDocument();
  });
});
