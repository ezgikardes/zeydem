# Design system

The look of the site, decided before the pages are built. The page layouts are in
`sketches/`; this file says how they are coloured and set in type. ZEY-12 turns it into code:
the colours become CSS variables in one tokens file, and no component writes a colour directly.

## Colours

| Token | Value | Used for |
|---|---|---|
| `--ink` | `#2A211A` | Body text |
| `--brand` | `#4A3524` | Walnut brown: headings, primary buttons, logo |
| `--sage` | `#8A9A6B` | Secondary: borders, icons |
| `--sage-deep` | `#5E6F43` | Text that needs the sage tone |
| `--honey` | `#C99B52` | Warm accent: badges |
| `--surface` | `#FFFFFF` | Cards |
| `--bg` | `#F6F3EC` | Page background |
| `--bg-warm` | `#F3E3C8` | Highlighted bands |
| `--line` | `#DCD3C2` | Dividers |

Error messages need a red that is not in this list yet; it is chosen with ZEY-15, the first
ticket that shows an error, and added here.

## Contrast

Target: WCAG AA, which asks for 4.5:1 for body text and 3:1 for large text.

| Text on background | Ratio | Rule |
|---|---|---|
| `--ink` on `--bg` | 14.2 | Body text |
| `--ink` on `--surface` | 15.8 | Text on cards |
| `--bg` on `--brand` | 10.4 | Primary buttons |
| `--sage-deep` on `--bg` | 4.9 | Sage-toned text, only on light backgrounds |
| `--ink` on `--honey` | 6.2 | Honey only ever carries dark text |
| white on `--honey` | 2.5 | Never |
| white on `--sage` | 3.0 | Never; sage is for borders and icons, not text backgrounds |

`--line` on `--bg` is 1.3: dividers only, never a field border that the visitor must see to use
the form. A new text and background pair is checked before it is used and added to this table.

## Type

- Headings: Fraunces (serif). Body: Inter (sans). Both served by the site itself through
  `next/font`, not loaded from Google at run time.
- Sizes: display 40–56px, headings 24–32px, body 16–18px, labels 11–12px with wide letter
  spacing.
- Body lines stay between 60 and 75 characters.

## Logo

The current site's logo stays: the handwritten "Zeydem" wordmark in olive green, its Y drawn
as an olive leaf. Two files in `frontend/src/assets/logos/`: `zeydem-logo.png` (green) and
`zeydem-koyu-logo.png` (dark). It sits behind a single `Logo` component, so a new drawing
changes one file.

## Components in the MVP

Each comes with the first ticket that needs it.

| Component | First ticket |
|---|---|
| `Button`, `ProductCard`, `ProductGrid` | ZEY-12 |
| `Header` with cart count (named `SiteHeader` until ZEY-34 replaces the home page's own `Header.jsx`), `Footer` with contact details | ZEY-17, ZEY-35, ZEY-36 |
| `QuantityInput` | ZEY-17 |
| `Input` with its error message | ZEY-23, ZEY-24 |
| `Logo` (the current logo, moved into a component) | ZEY-34 |

Left out of the MVP: language switcher, size selector, gallery, contact form.
