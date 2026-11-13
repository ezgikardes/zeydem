import { fromKurus, toKurus } from "./money";

describe("toKurus", () => {
  it("turns a price with two decimals into whole kuruş", () => {
    expect(toKurus("450.00")).toBe(45000);
  });

  it("reads a price with one decimal or with no decimals", () => {
    expect(toKurus("400.5")).toBe(40050);
    expect(toKurus("400")).toBe(40000);
  });

  // Most decimals are not exact in binary: Number("4.35") * 100 is 434.99999999999994.
  it("is exact where floating point is not", () => {
    expect(toKurus("4.35")).toBe(435);
  });

  it.each(["abc", "4.5.0", "-1", ""])("throws for %p", (price) => {
    expect(() => toKurus(price)).toThrow();
  });
});

describe("fromKurus", () => {
  it("turns kuruş back into a price with two decimals", () => {
    expect(fromKurus(304000)).toBe("3040.00");
    expect(fromKurus(5)).toBe("0.05");
    expect(fromKurus(0)).toBe("0.00");
  });
});
