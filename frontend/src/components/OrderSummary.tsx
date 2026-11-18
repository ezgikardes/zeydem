import styles from "./OrderSummary.module.css";

export default function OrderSummary() {
  return (
    <section
      className={styles.summary}
      aria-labelledby="summary-title">
      <h2
        id="summary-title"
        className={styles.title}>
        Sipariş özeti
      </h2>
    </section>
  );
}
