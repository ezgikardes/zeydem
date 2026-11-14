"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import QuantityInput from "./QuantityInput";
import { cartTotal, lineTotal } from "../lib/cart";
import { formatAmount, formatPrice } from "../lib/format";
import { fromKurus } from "../lib/money";
import styles from "./CartContents.module.css";

export default function CartContents() {
  const { lines, loaded, setQuantity } = useCart();

  return (
    <>
      <h1 className={styles.title}>Sepetim</h1>
      {/* Nothing until the saved cart is read. An empty cart shows only the heading until ZEY-22. */}
      {loaded && lines.length > 0 && (
        <>
          <div className={styles.scroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Ürün</th>
                  <th className={styles.fixedCol} scope="col">
                    Birim fiyat
                  </th>
                  <th className={styles.fixedCol} scope="col">
                    Adet
                  </th>
                  <th className={styles.fixedCol} scope="col">
                    Toplam
                  </th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => (
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
                    <td className={styles.money}>{formatPrice(line.price)}</td>
                    <td>
                      <QuantityInput
                        value={line.quantity}
                        onChange={(next) => setQuantity(line.id, next)}
                        label={`${line.name} ${formatAmount(line.amount, line.unit)} adedi`}
                      />
                    </td>
                    <td className={styles.money}>
                      {formatPrice(fromKurus(lineTotal(line)))}
                    </td>
                  </tr>
                ))}
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
