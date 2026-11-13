import { fireEvent, render, screen } from "@testing-library/react";
import ProductsError from "./error";

// No Next.js router in tests: useRouter is replaced by a fake
const refresh = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));

const reset = jest.fn();

beforeEach(() => {
  refresh.mockReset();
  reset.mockReset();
});

describe("/urunler error screen", () => {
  it("tells the visitor the products could not be loaded, without the error's text", () => {
    render(
      <ProductsError
        error={new Error("Backend answered 500")}
        reset={reset}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Ürünler şu an yüklenemedi." }),
    ).toBeInTheDocument();
    expect(screen.getByText("Birazdan tekrar deneyin.")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Tekrar dene" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Backend answered 500/)).not.toBeInTheDocument();
  });

  // reset() alone would draw the same failed page again; refresh() asks the server first.
  it("asks the server for the page again, then clears the error, when Tekrar dene is pressed", () => {
    render(
      <ProductsError
        error={new Error("Backend answered 500")}
        reset={reset}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Tekrar dene" }));

    expect(refresh).toHaveBeenCalledTimes(1);
    expect(reset).toHaveBeenCalledTimes(1);
    expect(refresh.mock.invocationCallOrder[0]).toBeLessThan(
      reset.mock.invocationCallOrder[0],
    );
  });
});
