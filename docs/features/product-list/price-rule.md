# The price formatting rule

One integer in, one piece of text out. Every price on the site goes through this rule, so it is
written down and locked by tests.

## The model

```
  kurus (integer)
        │
        ▼
  ┌──────────────┐   yes   ┌──────────────────────────────────────┐
  │ negative?    ├────────▶│ render it visibly broken             │
  └──────┬───────┘         │ "-325,-5 TL"                         │
         │ no              │ a data error must not look like a    │
         ▼                 │ valid price                          │
  ┌─────────────────────┐  └──────────────────────────────────────┘
  │ lira  = kurus / 100 │  (the fraction is cut off, not rounded)
  │ kalan = kurus % 100 │
  └──────┬──────────────┘
         │
         ├── lira >= 1000 ──▶ thousands separator   "1.600,00 TL"
         ├── lira == 0     ──▶ kurus only           "0,05 TL"
         └── otherwise     ──▶ plain                "325,05 TL"
                  │
                  └── a one-digit kalan is padded to two:  5 → "05"
```

Two decisions hide in this picture:

**The fraction is cut off, not rounded.** `32599` kuruş is 325 lira and 99 kuruş. Rounding would
show 326 lira, inventing a lira that nobody paid.

**A negative amount is not repaired.** An earlier version used `Math.abs` and turned `-5` kuruş
into `0,05 TL` — a broken price that looked perfectly normal. A negative price is a data error,
and the only person who can fix it is whoever typed it. Hiding it keeps it broken.

## The checks

| Given | When | Then |
|---|---|---|
| `40000` kuruş, a whole lira amount | it is formatted | `400,00 TL` |
| `32505` kuruş, with kuruş left over | it is formatted | `325,05 TL` |
| `160000` kuruş, over a thousand lira | it is formatted | `1.600,00 TL` |
| `5` kuruş, less than one lira | it is formatted | `0,05 TL` |
| `0` kuruş | it is formatted | `0,00 TL` |
| `-32505` kuruş, data that should not exist | it is formatted | the result is **not** a well-formed price |

The last check is the one that matters. It does not pin down the exact text — it says the output
must not look like a real price. Re-adding `Math.abs` makes it fail, which was verified by
putting the line back and watching the test go red.

Lives in `src/utils.ts` (`formatPriceKurus`), checked in `src/utils.test.ts`.
