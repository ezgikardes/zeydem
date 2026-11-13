// Next.js requires error.tsx to run in the browser.

"use client";
// "use client" sends this file's code to the browser, so the "tekrar dene" button can react to a click.

import { startTransition } from "react";
import { useRouter } from "next/navigation";
import styles from "./error.module.css";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

// Shown in place of any page under /urunler that throws.
export default function ProductsError({ reset }: Props) {
  const router = useRouter();

  // refresh() asks the backend again; reset() alone would redraw the failed page.
  function retry() {
    startTransition(() => {
      router.refresh();
      reset();
    });
  }

  return (
    <main className={styles.page}>
      <div className={styles.box}>
        <h1 className={styles.title}>Ürünler şu an yüklenemedi.</h1>
        <p className={styles.text}>Birazdan tekrar deneyin.</p>
        <button
          type="button"
          className={styles.button}
          onClick={retry}>
          Tekrar dene
        </button>
      </div>
    </main>
  );
}
