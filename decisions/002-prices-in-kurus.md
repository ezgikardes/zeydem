# 002 · Prices are integers in kuruş

**Decision:** Every price is stored and passed around as a whole number of kuruş. `40000` means
400,00 TL. It becomes text in one place only, `formatPriceKurus`.

**Context:** Decimal numbers lose precision when they are added up: a few hundred order lines and
the total is off by a kuruş, which is visible on an invoice and impossible to explain to a
customer. Integers cannot drift. Keeping the conversion in a single function also means the
display format is decided once, not in every component that happens to show a price.

**When to reopen:** If prices ever need more precision than whole kuruş — a per-kilo price with
fractions, for example — or if a second currency arrives, since the formatter currently assumes
Turkish lira.
