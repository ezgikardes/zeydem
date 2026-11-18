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

// Stub
export function deliveryErrors(details: DeliveryDetails): DeliveryErrors {
  void details;
  return {};
}
