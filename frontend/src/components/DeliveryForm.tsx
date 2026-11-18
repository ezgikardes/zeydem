import styles from "./DeliveryForm.module.css";

// The fields keep what is typed themselves; ZEY-24 moves the values up into the page.
export default function DeliveryForm() {
  return (
    // noValidate: the browser's own bubbles stay off; ZEY-24 shows ours
    <form
      className={styles.form}
      aria-labelledby="delivery-title"
      noValidate>
      <h2
        id="delivery-title"
        className={styles.title}>
        Teslimat bilgileri
      </h2>

      <div className={styles.field}>
        <label htmlFor="delivery-name">Ad soyad</label>
        <input
          id="delivery-name"
          className={styles.input}
          type="text"
          autoComplete="name"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="delivery-phone">Telefon</label>
        <input
          id="delivery-phone"
          className={styles.input}
          type="tel"
          autoComplete="tel"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="delivery-email">E-posta</label>
        <input
          id="delivery-email"
          className={styles.input}
          type="email"
          autoComplete="email"
        />
      </div>

      <div className={styles.pair}>
        <div className={styles.field}>
          <label htmlFor="delivery-city">İl</label>
          <input
            id="delivery-city"
            className={styles.input}
            type="text"
            autoComplete="address-level1"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="delivery-district">İlçe</label>
          <input
            id="delivery-district"
            className={styles.input}
            type="text"
            autoComplete="address-level2"
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="delivery-address">Açık adres</label>
        <textarea
          id="delivery-address"
          className={`${styles.input} ${styles.address}`}
          autoComplete="street-address"
          rows={4}
        />
      </div>
    </form>
  );
}
