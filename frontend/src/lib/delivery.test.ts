import { deliveryErrors, type DeliveryDetails } from "./delivery";

// Field rules from docs/features/checkout/spec.md (ZEY-24).
// Each check starts from a right set of details and changes one field.
const right: DeliveryDetails = {
  name: "Ayşe Yılmaz",
  phone: "0532 123 45 67",
  email: "ayse@ornek.com",
  city: "Manisa",
  district: "Akhisar",
  address: "Zeytinli Mah. 12. Sok. No: 4",
};

describe("deliveryErrors", () => {
  it("finds no error in right details", () => {
    expect(deliveryErrors(right)).toEqual({});
  });

  it.each([
    ["name", "Ad soyad gerekli."],
    ["city", "İl gerekli."],
    ["district", "İlçe gerekli."],
    ["address", "Açık adres gerekli."],
  ] as const)("asks for %s when it is empty or only spaces", (field, message) => {
    expect(deliveryErrors({ ...right, [field]: "" })).toEqual({ [field]: message });
    expect(deliveryErrors({ ...right, [field]: "   " })).toEqual({ [field]: message });
  });

  it("asks for the phone when it is empty", () => {
    expect(deliveryErrors({ ...right, phone: "" })).toEqual({
      phone: "Telefon numarası gerekli.",
    });
  });

  it.each(["5321234567", "05321234567", "+90 532 123 45 67", "(0532) 123-45-67"])(
    "accepts the mobile number %s",
    (phone) => {
      expect(deliveryErrors({ ...right, phone })).toEqual({});
    },
  );

  // Too short, too long, and a landline: one message fits all three
  it.each(["0532 12", "0532 123 45 678", "0212 123 45 67"])(
    "shows the expected shape for %s",
    (phone) => {
      expect(deliveryErrors({ ...right, phone })).toEqual({
        phone: "Telefon numarası 05xx xxx xx xx biçiminde olmalı.",
      });
    },
  );

  it("asks for the email when it is empty", () => {
    expect(deliveryErrors({ ...right, email: "" })).toEqual({
      email: "E-posta gerekli.",
    });
  });

  it.each(["ayse@ornek", "ayseornek.com", "ayse @ornek.com"])(
    "finds the email %s half-typed",
    (email) => {
      expect(deliveryErrors({ ...right, email })).toEqual({
        email: "E-posta adresi eksik görünüyor.",
      });
    },
  );

  // An address book or a paste often adds a space at the ends
  it("ignores spaces around the email", () => {
    expect(deliveryErrors({ ...right, email: " ayse@ornek.com " })).toEqual({});
  });
});
