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

export function deliveryErrors(details: DeliveryDetails): DeliveryErrors {
  const errors: DeliveryErrors = {};

  for (const [field, message] of REQUIRED) {
    // Only spaces counts as empty
    if (details[field].trim() === "") {
      errors[field] = message;
    }
  }

  return errors;
}
