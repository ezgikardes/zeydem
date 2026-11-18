"use client";

import Link from "next/link";
import { useState } from "react";
import { EMPTY_DELIVERY, type DeliveryDetails } from "../lib/delivery";
import { useCart } from "./CartProvider";
import DeliveryForm from "./DeliveryForm";
import OrderSummary from "./OrderSummary";
import styles from "./CheckoutContents.module.css";

export default function CheckoutContents() {
  const { lines, loaded } = useCart();
  // Kept in memory only: personal details are never saved in the browser
  const [details, setDetails] = useState<DeliveryDetails>(EMPTY_DELIVERY);

  return (
    <>
      <h1 className={styles.title}>Siparişi tamamla</h1>
      {/* Nothing until the saved cart is read */}
      {loaded && lines.length === 0 && (
        <div className={styles.empty}>
          <p className={styles.emptyText}>Sepetiniz boş</p>
          <Link
            className={styles.back}
            href="/sepet">
            Sepete dön
          </Link>
        </div>
      )}
      {loaded && lines.length > 0 && (
        <div className={styles.layout}>
          <DeliveryForm
            details={details}
            onChange={setDetails}
          />
          <OrderSummary lines={lines} />
        </div>
      )}
    </>
  );
}
