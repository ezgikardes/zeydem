import CartContents from "../../../src/components/CartContents";
import styles from "./page.module.css";

export default function CartPage() {
  return (
    <main className={styles.page}>
      <CartContents />
    </main>
  );
}
