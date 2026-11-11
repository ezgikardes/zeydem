"use client";

type Props = {
  value: number;
  onChange: (next: number) => void;
};

export default function QuantityInput({ value }: Props) {
  return (
    <div>
      <button type="button" aria-label="Azalt" disabled={value <= 1}>
        −
      </button>
      <button type="button" aria-label="Artır">
        +
      </button>
    </div>
  );
}
