// The six delivery fields, as the customer typed them.
export type DeliveryDetails = {
  name: string;
  phone: string;
  email: string;
  city: string;
  district: string;
  address: string;
};

export const EMPTY_DELIVERY: DeliveryDetails = {
  name: "",
  phone: "",
  email: "",
  city: "",
  district: "",
  address: "",
};

// One message per wrong field; a right field has no key.
export type DeliveryErrors = Partial<Record<keyof DeliveryDetails, string>>;

// Fields whose only rule is "not empty", with their message.
const REQUIRED: [keyof DeliveryDetails, string][] = [
  ["name", "Ad soyad gerekli."],
  ["city", "İl gerekli."],
  ["district", "İlçe gerekli."],
  ["address", "Açık adres gerekli."],
];

// A Turkish mobile number once spaces, dashes and brackets are gone:
// 5xxxxxxxxx, 05xxxxxxxxx or +905xxxxxxxxx.
const MOBILE = /^(\+90|0)?5\d{9}$/;

// Loose on purpose: text, one "@", text, a dot, text, and no spaces.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function deliveryErrors(details: DeliveryDetails): DeliveryErrors {
  const errors: DeliveryErrors = {};

  for (const [field, message] of REQUIRED) {
    // Only spaces counts as empty
    if (details[field].trim() === "") {
      errors[field] = message;
    }
  }

  const phone = details.phone.trim();
  if (phone === "") {
    errors.phone = "Telefon numarası gerekli.";
  } else if (!MOBILE.test(phone.replace(/[\s()-]/g, ""))) {
    errors.phone = "Telefon numarası 05xx xxx xx xx biçiminde olmalı.";
  }

  const email = details.email.trim();
  if (email === "") {
    errors.email = "E-posta gerekli.";
  } else if (!EMAIL.test(email)) {
    errors.email = "E-posta adresi eksik görünüyor.";
  }

  return errors;
}
