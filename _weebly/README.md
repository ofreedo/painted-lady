# The Weebly store's new look

The online store stays on Weebly at **shop.thepaintedladynapavalley.com** (cart, checkout, payments, orders). It wears the main site's look through two files served by this site:

| File | What it does |
|---|---|
| `store-skin/skin.css` | Porcelain/ink/pink colors, Bodoni Moda + Jost, deal cards in a clean grid, ink buttons, restyled mini cart. Hides Weebly's own header, menu and footer (only after `skin.js` has run). Shows each deal's regular price only, except the VIP Pass, which keeps its sale (regular struck through, $1,000). |
| `store-skin/skin.js` | Adds the main site's announcement bar, masthead (every link goes back to www), phone menu and footer. Moves Weebly's own **Cart (n)** link into the masthead, so the count and mini cart keep working. Hides the discontinued Reiki deal. Sends visitors on the old info pages (`/uv.html`, `/prices.html`, …) to their new home on www, and the store's bare address to its product list. |

Weebly's theme files are **not edited**. The two files are linked from Weebly's site-wide code boxes:

**Weebly → Settings → SEO → Header Code**
```html
<!-- The Painted Lady store skin (main site repo: store-skin/). Remove this and the Footer Code line to undo. -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..700;1,6..96,400..700&family=Jost:ital,wght@0,300..600;1,300..500&display=swap">
<link rel="stylesheet" href="https://www.thepaintedladynapavalley.com/store-skin/skin.css">
```

**Weebly → Settings → SEO → Footer Code**
```html
<script src="https://www.thepaintedladynapavalley.com/store-skin/skin.js"></script>
```

Then **Publish** in Weebly.

- **To change the store's look:** edit `store-skin/` here and push. The store picks it up within about 10 minutes (GitHub Pages' cache); there's no need to touch Weebly.
- **To undo:** clear both boxes in Weebly and publish. The store goes back to its original theme.
- **If the main site is ever down**, the store still works: without `skin.js` it keeps Weebly's own menu.

## Old info pages on the store domain

The Weebly site still contains the old pages (UV, Spray, Prices, Bios, …). They aren't linked from anywhere, `skin.js` forwards visitors to the new site, and each is set to **Hide this page from search engines** in Weebly (Pages → the page → SEO Settings) so only the store's pages are indexed there. Keep `summerween.html`: it holds store products.

## Owner to-dos in Weebly (content, not styling)

- The Featured Products category description still shows a **Cyber Monday "up to 70% off everything"** banner. `skin.css` hides that one image; delete it in the store's category settings, then remove the rule.
- Remove or unpublish the **Reiki** deal (hidden by `skin.js` for now).
- See "Open questions for the owner" in the main README for the other store fixes.

## Backup

`snapshot/` is a copy of the store as it looked before the restyle (pages and the theme's `main_style.css`), taken by `fetch.sh` on 2026-09-29.

The checkout pages sit behind a Cloudflare "verify you are human" check and weren't previewed. They're Weebly's own screens; the skin only touches their table headings.
