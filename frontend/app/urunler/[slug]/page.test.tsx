import { render, screen } from "@testing-library/react";
import ProductPage from "./page";
import CartProvider from "../../../src/components/CartProvider";

// No backend in tests: fetch is replaced by a fake
const fetchMock = jest.fn();

// Next.js hands the page its address parts as a promise.
const params = Promise.resolve({ slug: "cig-badem-500g" });

beforeEach(() => {
  process.env.BACKEND_URL = "http://backend.test";
  fetchMock.mockReset();
  global.fetch = fetchMock;
});

describe("/urunler/[slug]", () => {
  it("asks the backend for the product in the address and shows it", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        id: 3,
        slug: "cig-badem-500g",
        name: "Çiğ Badem",
        photoUrl: "/products/badem-500g.jpg",
        price: "320.00",
        amount: 500,
        unit: "g",
        description: "Bahçemizden toplanan çiğ badem.",
      }),
    });

    // The page now holds "Sepete ekle", which reads the cart of the root layout.
    render(await ProductPage({ params }), { wrapper: CartProvider });

    expect(fetchMock).toHaveBeenCalledWith("http://backend.test/products/cig-badem-500g", {
      signal: expect.any(AbortSignal),
    });
    expect(screen.getByRole("heading", { level: 1, name: "Çiğ Badem" })).toBeInTheDocument();
    expect(screen.getByText("Bahçemizden toplanan çiğ badem.")).toBeInTheDocument();
  });

  it("asks the backend with a 20 s limit", async () => {
    const timeoutSpy = jest.spyOn(AbortSignal, "timeout");
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: 3, slug: "cig-badem-500g", name: "Çiğ Badem" }),
    });

    await ProductPage({ params });

    expect(timeoutSpy).toHaveBeenCalledWith(20_000);
    timeoutSpy.mockRestore();
  });

  // The "Ürün bulunamadı" page is ZEY-16; until then a 404 must not draw an empty product.
  it("throws when the backend does not answer 200", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ title: "Not Found", status: 404 }),
    });

    await expect(ProductPage({ params })).rejects.toThrow();
  });
});
