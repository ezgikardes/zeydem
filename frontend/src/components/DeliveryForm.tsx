import { useState } from "react";
import { deliveryErrors, type DeliveryDetails } from "../lib/delivery";
import styles from "./DeliveryForm.module.css";

type FieldName = keyof DeliveryDetails;

type Props = {
  details: DeliveryDetails;
  onChange: (details: DeliveryDetails) => void;
};

// The values live in the page (ZEY-25 sends them)
export default function DeliveryForm({ details, onChange }: Props) {
  const [left, setLeft] = useState<Set<FieldName>>(new Set());

  const errors = deliveryErrors(details);

  // A message shows only once the customer has left the field
  function shownError(field: FieldName) {
    return left.has(field) ? errors[field] : undefined;
  }

  function change(field: FieldName, value: string) {
    onChange({ ...details, [field]: value });
  }

  function leave(field: FieldName) {
    setLeft((fields) => new Set(fields).add(field));
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

      <Field
        label="Ad soyad"
        id="delivery-name"
        autoComplete="name"
        value={details.name}
        error={shownError("name")}
        onChange={(value) => change("name", value)}
        onLeave={() => leave("name")}
      />

      <Field
        label="Telefon"
        id="delivery-phone"
        type="tel"
        autoComplete="tel"
        value={details.phone}
        error={shownError("phone")}
        onChange={(value) => change("phone", value)}
        onLeave={() => leave("phone")}
      />

      <Field
        label="E-posta"
        id="delivery-email"
        type="email"
        autoComplete="email"
        value={details.email}
        error={shownError("email")}
        onChange={(value) => change("email", value)}
        onLeave={() => leave("email")}
      />

      <div className={styles.pair}>
        <Field
          label="İl"
          id="delivery-city"
          autoComplete="address-level1"
          value={details.city}
          error={shownError("city")}
          onChange={(value) => change("city", value)}
          onLeave={() => leave("city")}
        />
        <Field
          label="İlçe"
          id="delivery-district"
          autoComplete="address-level2"
          value={details.district}
          error={shownError("district")}
          onChange={(value) => change("district", value)}
          onLeave={() => leave("district")}
        />
      </div>

      <Field
        label="Açık adres"
        id="delivery-address"
        autoComplete="street-address"
        multiline
        value={details.address}
        error={shownError("address")}
        onChange={(value) => change("address", value)}
        onLeave={() => leave("address")}
      />
    </form>
  );
}

type FieldProps = {
  label: string;
  id: string;
  type?: "text" | "tel" | "email";
  autoComplete: string;
  multiline?: boolean;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onLeave: () => void;
};

// One labelled field with its message underneath, if there is one
function Field({
  label,
  id,
  type = "text",
  autoComplete,
  multiline = false,
  value,
  error,
  onChange,
  onLeave,
}: FieldProps) {
  const errorId = `${id}-error`;
  const className = [
    styles.input,
    multiline && styles.address,
    error && styles.invalid,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea
          id={id}
          className={className}
          autoComplete={autoComplete}
          rows={4}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onLeave}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
      ) : (
        <input
          id={id}
          className={className}
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onLeave}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
      )}
      {error && (
        <p
          id={errorId}
          className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
