import { render, screen } from "@testing-library/react";
import ProductsPage from "./page";

// No backend in tests: fetch is replaced by a fake
const fetchMock = jest.fn();

beforeEach(() => {
  process.env.BACKEND_URL = "http://backend.test";
  fetchMock.mockResolvedValue({
    ok: true,
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

describe("/urunler", () => {
  it("asks the backend for the products and shows a card for each", async () => {
    render(await ProductsPage());

    expect(fetchMock).toHaveBeenCalledWith("http://backend.test/products");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("Çiğ Badem")).toBeInTheDocument();
  });
});
