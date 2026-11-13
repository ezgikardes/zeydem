import { render, screen } from "@testing-library/react";
import ProductsPage from "./page";

// No backend in tests: fetch is replaced by a fake
const fetchMock = jest.fn();

beforeEach(() => {
  process.env.BACKEND_URL = "http://backend.test";
  fetchMock.mockReset();
  fetchMock.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => [
      {
        id: 1,
        slug: "naturel-sizma-zeytinyagi-1l",
        name: "Natürel Sızma Zeytinyağı",
        photoUrl: "/products/zeytinyagi-1l.png",
        price: "450.00",
        amount: 1,
        unit: "L",
      },
      {
        id: 3,
        slug: "cig-badem-500g",
        name: "Çiğ Badem",
        photoUrl: "/products/badem-500g.jpg",
        price: "320.00",
        amount: 500,
        unit: "g",
      },
    ],
  });
  global.fetch = fetchMock;
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("/urunler", () => {
  it("asks the backend for the products with a 20 s limit and shows a card for each", async () => {
    // Watches which limit the page asks for
    const timeoutSpy = jest.spyOn(AbortSignal, "timeout");

    render(await ProductsPage());

    expect(timeoutSpy).toHaveBeenCalledWith(20_000);
    expect(fetchMock).toHaveBeenCalledWith("http://backend.test/products", {
      signal: expect.any(AbortSignal),
    });
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("Çiğ Badem")).toBeInTheDocument();
  });

  it("throws when the backend answers 500", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ title: "Internal Server Error", status: 500 }),
    });

    await expect(ProductsPage()).rejects.toThrow();
  });

  it("throws when the answer is not a list", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ products: [] }),
    });

    await expect(ProductsPage()).rejects.toThrow();
  });

  // A lost connection and a run-out time limit both make fetch reject.
  it("throws when the request fails", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));

    await expect(ProductsPage()).rejects.toThrow();
  });
});
