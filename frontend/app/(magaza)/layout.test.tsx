import { render, screen } from "@testing-library/react";
import ShopLayout from "./layout";
import CartProvider from "../../src/components/CartProvider";

// next/font downloads fonts while Next.js builds
jest.mock("next/font/google", () => ({
  Fraunces: () => ({ variable: "font-display" }),
  Inter: () => ({ variable: "font-body" }),
}));

describe("shop layout", () => {
  it("puts the header with the cart count above every page", () => {
    render(
      <ShopLayout>
        <p>Sayfanın içeriği</p>
      </ShopLayout>,
      { wrapper: CartProvider },
    );

    expect(screen.getByRole("banner")).toHaveTextContent("Sepet (0)");
    expect(screen.getByText("Sayfanın içeriği")).toBeInTheDocument();
  });
});
