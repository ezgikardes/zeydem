import { cartTotal, lineTotal, type CartLine } from "../lib/cart";
import { formatAmount, formatPrice } from "../lib/format";
import { fromKurus } from "../lib/money";
import styles from "./OrderSummary.module.css";

// The same helpers as the cart page, so the two pages cannot show different amounts.
export default function OrderSummary({ lines }: { lines: CartLine[] }) {
  return (
    <section
      className={styles.summary}
      aria-labelledby="summary-title">
      <h2
        id="summary-title"
        className={styles.title}>
        Sipariş özeti
      </h2>
      <ul className={styles.lines}>
        {lines.map((line) => (
          <li
            key={line.id}
            className={styles.line}>
            <span>
              {`${line.name} ${formatAmount(line.amount, line.unit)} × ${line.quantity}`}
            </span>
            <span className={styles.money}>
              {formatPrice(fromKurus(lineTotal(line)))}
            </span>
          </li>
        ))}
      </ul>
      <p className={styles.total}>
        <span>Toplam</span>
        <span className={styles.money}>
          {formatPrice(fromKurus(cartTotal(lines)))}
        </span>
      </p>
    </section>
  );
}
