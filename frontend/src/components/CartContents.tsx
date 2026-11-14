"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "./CartProvider";
import QuantityInput from "./QuantityInput";
import { cartTotal, lineTotal } from "../lib/cart";
import { formatAmount, formatPrice } from "../lib/format";
import { fromKurus } from "../lib/money";
import styles from "./CartContents.module.css";

export default function CartContents() {
  const { lines, loaded, setQuantity, remove } = useCart();

  const headingRef = useRef<HTMLHeadingElement>(null);
  const removeButtons = useRef(new Map<number, HTMLButtonElement>());
  // Set focus just before a removal
  const focusAfterRemove = useRef<number | "heading" | null>(null);

  // A removed button takes the focus with it; put it back once the new rows are drawn.
  useEffect(() => {
    const target = focusAfterRemove.current;
    if (target === null) return;
    focusAfterRemove.current = null;
    if (target === "heading") headingRef.current?.focus();
    else removeButtons.current.get(target)?.focus();
  }, [lines]);

  function handleRemove(index: number) {
    const next = lines[index + 1];
    focusAfterRemove.current = next ? next.id : "heading";
    remove(lines[index].id);
  }

  return (
    <>
      <h1
        className={styles.title}
        ref={headingRef}
        tabIndex={-1}>
        Sepetim
      </h1>
      {/* Nothing until the saved cart is read */}
      {loaded && lines.length === 0 && (
        <div className={styles.empty}>
          <p className={styles.emptyText}>Sepetiniz boş</p>
          <Link
            className={styles.browse}
            href="/urunler">
            Ürünlere göz atın →
          </Link>
        </div>
      )}
      {loaded && lines.length > 0 && (
        <>
          <div className={styles.scroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Ürün</th>
                  <th
                    className={styles.fixedCol}
                    scope="col">
                    Birim fiyat
                  </th>
                  <th
                    className={styles.fixedCol}
                    scope="col">
                    Adet
                  </th>
                  <th
                    className={styles.fixedCol}
                    scope="col">
                    Toplam
                  </th>
                  {/* No heading on screen but screen readers still get a name */}
                  <th
                    className={styles.removeCol}
                    scope="col">
                    <span className={styles.hidden}>Sepetten çıkar</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line, index) => {
                  const product = `${line.name} ${formatAmount(line.amount, line.unit)}`;
                  return (
                    <tr key={line.id}>
                      <td>
                        <div className={styles.product}>
                          <img
                            className={styles.photo}
                            src={line.photoUrl}
                            alt={line.name}
                          />
                          <div>
                            <Link
                              className={styles.name}
                              href={`/urunler/${line.slug}`}>
                              {line.name}
                            </Link>
                            <p className={styles.amount}>
                              {formatAmount(line.amount, line.unit)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className={styles.money}>
                        {formatPrice(line.price)}
                      </td>
                      <td>
                        <QuantityInput
                          value={line.quantity}
                          onChange={(next) => setQuantity(line.id, next)}
                          label={`${product} adedi`}
                        />
                      </td>
                      <td className={styles.money}>
                        {formatPrice(fromKurus(lineTotal(line)))}
                      </td>
                      <td>
                        <button
                          type="button"
                          className={styles.remove}
                          ref={(button) => {
                            if (button)
                              removeButtons.current.set(line.id, button);
                            else removeButtons.current.delete(line.id);
                          }}
                          onClick={() => handleRemove(index)}>
                          Çıkar
                          <span className={styles.hidden}>{` ${product}`}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className={styles.total}>
            <span>Toplam</span>
            <span>{formatPrice(fromKurus(cartTotal(lines)))}</span>
          </p>
        </>
      )}
    </>
  );
}
