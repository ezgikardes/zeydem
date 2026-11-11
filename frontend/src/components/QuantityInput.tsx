"use client";

import { MAX_QUANTITY } from "../lib/cart";
import styles from "./QuantityInput.module.css";

type Props = {
  value: number;
  onChange: (next: number) => void;
};

export default function QuantityInput({ value, onChange }: Props) {
  return (
    <fieldset className={styles.field}>
      <legend className={styles.label}>Adet</legend>
      <div className={styles.control}>
        <button
          className={styles.step}
          type="button"
          aria-label="Azalt"
          disabled={value <= 1}
          onClick={() => onChange(value - 1)}>
          −
        </button>
        <span className={styles.value}>{value}</span>
        <button
          className={styles.step}
          type="button"
          aria-label="Artır"
          disabled={value >= MAX_QUANTITY}
          onClick={() => onChange(value + 1)}>
          +
        </button>
      </div>
    </fieldset>
  );
}
