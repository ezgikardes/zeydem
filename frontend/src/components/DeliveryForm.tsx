import { useState, type ChangeEvent } from "react";
import { deliveryErrors, type DeliveryDetails } from "../lib/delivery";
import styles from "./DeliveryForm.module.css";

type Field = keyof DeliveryDetails;

type Props = {
  details: DeliveryDetails;
  onChange: (details: DeliveryDetails) => void;
};

// The values live in the page (ZEY-25 sends them)
export default function DeliveryForm({ details, onChange }: Props) {
  const [left, setLeft] = useState<Set<Field>>(new Set());

  const errors = deliveryErrors(details);

  // A message shows only once the customer has left the field
  function shownError(field: Field) {
    return left.has(field) ? errors[field] : undefined;
  }

  // What every input and the textarea share: value, events, error markup
  function fieldProps(field: Field, id: string, extraClass = "") {
    const error = shownError(field);
    const base = `${styles.input} ${extraClass}`.trim();
    return {
      id,
      value: details[field],
      onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        onChange({ ...details, [field]: event.target.value }),
      onBlur: () => setLeft((fields) => new Set(fields).add(field)),
      className: error ? `${base} ${styles.invalid}` : base,
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? `${id}-error` : undefined,
    };
  }

  function errorText(field: Field, id: string) {
    const error = shownError(field);
    return (
      error && (
        <p
          id={`${id}-error`}
          className={styles.error}>
          {error}
        </p>
      )
    );
  }

  return (
    // noValidate: the browser's own bubbles stay off; the messages below replace them
    <form
      className={styles.form}
      aria-labelledby="delivery-title"
      noValidate>
      <h2
        id="delivery-title"
        className={styles.title}>
        Teslimat bilgileri
      </h2>

      <div className={styles.field}>
        <label htmlFor="delivery-name">Ad soyad</label>
        <input
          {...fieldProps("name", "delivery-name")}
          type="text"
          autoComplete="name"
        />
        {errorText("name", "delivery-name")}
      </div>

      <div className={styles.field}>
        <label htmlFor="delivery-phone">Telefon</label>
        <input
          {...fieldProps("phone", "delivery-phone")}
          type="tel"
          autoComplete="tel"
        />
        {errorText("phone", "delivery-phone")}
      </div>

      <div className={styles.field}>
        <label htmlFor="delivery-email">E-posta</label>
        <input
          {...fieldProps("email", "delivery-email")}
          type="email"
          autoComplete="email"
        />
        {errorText("email", "delivery-email")}
      </div>

      <div className={styles.pair}>
        <div className={styles.field}>
          <label htmlFor="delivery-city">İl</label>
          <input
            {...fieldProps("city", "delivery-city")}
            type="text"
            autoComplete="address-level1"
          />
          {errorText("city", "delivery-city")}
        </div>
        <div className={styles.field}>
          <label htmlFor="delivery-district">İlçe</label>
          <input
            {...fieldProps("district", "delivery-district")}
            type="text"
            autoComplete="address-level2"
          />
          {errorText("district", "delivery-district")}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="delivery-address">Açık adres</label>
        <textarea
          {...fieldProps("address", "delivery-address", styles.address)}
          autoComplete="street-address"
          rows={4}
        />
        {errorText("address", "delivery-address")}
      </div>
    </form>
  );
}
