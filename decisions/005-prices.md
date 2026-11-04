# 005 · Prices are TL with two decimals, exact end to end

**Status:** Accepted. Replaces the earlier decision 002 (prices as integers in kuruş), which was
removed with the first product list before the MVP plan.

**Context:** ZEY-12 puts the first prices in a database; ZEY-20 adds up a cart, and ZEY-25
computes an order total on the server. A price must reach the visitor exactly as stored, and a
total must never be off by a kuruş. The earlier frontend kept prices as whole kuruş
(`40000` = 400,00 TL) because it added them up in JavaScript.

**Options:**
- **Floating point** (`double` in Java, a JSON number). Simple, but `0.1 + 0.2` is
  `0.30000000000000004`: a sum of prices can drift.
- **Integers in kuruş** everywhere (`BIGINT`, `long`, a JSON number). Exact, but the database
  shows `45000` for 450,00 TL, and every layer must remember to divide by 100.
- **Exact decimals:** `NUMERIC(10,2)` in the database, `BigDecimal` in Java, a string in JSON.

**Decision:** Exact decimals.

| Where | Type | 450,00 TL is |
|---|---|---|
| PostgreSQL | `NUMERIC(10,2)` | `450.00` |
| Java | `BigDecimal` | `new BigDecimal("450.00")` |
| JSON (contract) | string | `"450.00"` |
| Screen | formatted text | `450,00 TL` |

- The currency is always TL and is not stored.
- The frontend only formats a price; it does not calculate with it. When the cart total arrives
  (ZEY-20), how it is added up is decided there, on purpose.
- The total that is charged is computed by the backend with `BigDecimal` (ZEY-25).

**Why this option:**
- The value means the same thing at every step; `450.00` in the database is `"450.00"` in the
  answer, with no conversion to get wrong.
- A string in JSON cannot be read as a floating-point number by accident.
- `NUMERIC(10,2)` allows up to 99.999.999,99 TL, far above any order this shop will see.

**Evidence:** JavaScript has only one number type, a 64-bit float; a JSON number goes into it.
`BigDecimal` and PostgreSQL `NUMERIC` both store decimal digits exactly.

**Trade-off accepted:**
- `BigDecimal` is verbose: `a.add(b)`, not `a + b`.
- Two `BigDecimal`s with the same value but a different scale are not `equals`:
  `450.0` and `450.00` differ. Tests compare with `compareTo`, or always use two decimals.
- The DTO field needs one annotation to be written as a string; the frontend turns the string
  into a number only to format it.

**Revisit when:** a second currency arrives, or a price needs more than two decimals (a price
per gram, for example).
