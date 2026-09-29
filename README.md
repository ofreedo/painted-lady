# The Painted Lady Tanning & Spa

An editorial redesign of [thepaintedladynapavalley.com](https://www.thepaintedladynapavalley.com) for The Painted Lady Tanning & Spa, 1643 Jefferson Street, Napa, CA.

**Live preview:** https://ofreedo.github.io/painted-lady/

The concept is a fashion glossy for a pink palace. The team's own bios on the old site are mock *Vogue* covers and era costume portraits, so the site reads like a magazine:
- a masthead cover on the home page;
- a "Contents" page listing the services;
- each team member on their own mini magazine cover;
- a pink VIP membership card;
- a price list styled like a champagne list;
- the black-and-white awning stripes from the storefront.

It's a static site (HTML, CSS and JavaScript) with no framework and no build step.

---

## Pages

| Page | What's on it |
|---|---|
| `index.html` | Magazine cover, Contents (services index), stats, airbrush feature, the cast covers, VIP Pass, the four newest shop deals, founding story, client review, visit + map |
| `shop.html` | Every live deal from the online store, grouped (memberships & gifts, spray tans, UV, wellness, take-home). Checkout happens in the Weebly store |
| `tanning.html` | Lavish airbrush tans, on-location spray tans, Mystic Tan, the five UV / high-pressure beds, the Cocktails (combos), before & after care |
| `wellness.html` | Red light therapy (Beauty Angel), infrared sauna (the Zen Den), massage with Logan and Toni, Skin Care by Court |
| `menu.html` | The full price list, with section chips and search |
| `team.html` | The cast: one magazine-style profile per team member |
| `guide.html` | The Glow Guide: spray tan FAQ and DHA / FDA facts |
| `visit.html` | Address, hours, map, walk-in vs. appointment policy, cancellations |

## Structure

```
painted-lady/
├── index.html … visit.html   8 pages (+ 404.html, which redirects old Weebly addresses)
├── css/theme.css             brand tokens: colors (with their sources), fonts
├── css/style.css             the whole layout and all components
├── js/site.js                ← ALL business facts: contact, hours, prices, team, photos
├── js/shop.js                the store's live deals, GENERATED daily by _build/sync_shop.py (don't edit by hand)
├── js/tpl.js                 renders the masthead, menu overlay, footer, cast covers, portrait crops, price lookups, shop cards
├── js/main.js                shared behaviors from the local-biz starter kit (hours, open-now badge, map, price list, search, JSON-LD)
├── img/                      photos, team portraits (img/cast), social card (og-image.jpg), home-screen icon
├── _build/                   sync_shop.py, and the sources for og-image.jpg and the icons (not published)
└── .github/workflows/        sync-shop.yml: the daily shop sync
```

Scripts load in this order on every page: `site.js`, then (on the home and Shop pages) `shop.js`, then `tpl.js`, then `main.js`. `tpl.js` must run before `main.js`, because `main.js` fills in hooks that `tpl.js` renders (the open-now badge and hours in the header and footer).

## Editing content

Every fact lives in **`js/site.js`**. Edit it there, and every page updates.

| To change… | Edit in `site.js` |
|---|---|
| Phone, email, address, social links, booking link | `SITE` |
| Opening hours | `HOURS` (24h `"HH:MM"` ranges; `null` = closed) |
| Any price or service | `MENU`: each item is `[name, price, description?]`. `price` can be a number, a string like `"200+"`, or `null` (no price shown) |
| Team bios, titles, portrait captions | `CAST` |
| Photos | `PHOTOS` (one place for every image URL) |

Prices on the Home, Tan and Wellness pages are **not typed into the HTML**. They're looked up from `MENU`, so changing a price in `site.js` changes it everywhere:

```html
<span data-price="airbrush:Lavish Airbrush Tan"></span>   <!-- → $60 -->
<span data-from="uv"></span>                              <!-- lowest price in a section → $33 -->
```

If you rename a menu item, update any `data-price` that points to it. The browser console warns `No price for …` when a lookup fails.

### Other hooks

| Attribute | Result |
|---|---|
| `data-status` | "Open now · until 8 pm" in Napa time |
| `data-hours` | Full week hours table, today highlighted |
| `data-address`, `data-phone`, `data-email`, `data-cross` | Contact details from `SITE` |
| `data-book` | Link to the GlossGenius booking site |
| `data-tel` | `tel:` link that keeps its own label ("Call to join") |
| `data-directions`, `data-map` | Google Maps directions link / embedded map |
| `data-social="instagram"` | Link from `SITE.social` |
| `data-portrait="alli"` | Team portrait, cropped to fit whatever box it's in |
| `data-cast="covers"` / `"profiles"` | Team cover cards / full team spreads |

## The Shop and its daily sync

> **Currently switched OFF** (`shopDeals: false` in `js/site.js`, 2026-09-28) until the owner wants deals on the site. While off, the Shop is left out of the menus and the home page, and shop links go straight to the Weebly store; `shop.html` still works by direct link for previewing. **To turn it on:** set `shopDeals: true`, remove the `noindex` meta tag from `shop.html`, add `shop.html` back to `sitemap.xml`, and turn on the daily sync (the workflow file needs a GitHub token with the `workflow` permission).

The online store stays on Weebly at **shop.thepaintedladynapavalley.com** (cart, checkout, payments, orders). This site shows the deals in its own style, and every **Get this deal** button opens that item's page in the store.

- **What syncs:** every published product in the store's sitemap that has an Add to Cart button, with its name, sale price, regular price, description and photo. Photos load from the store itself.
- **When:** daily at 6 am Pacific, via GitHub Actions (`.github/workflows/sync-shop.yml`). To sync right away (say, after adding a deal), go to the repo on GitHub, open **Actions**, then **Sync shop deals**, then **Run workflow**. Or run `python3 _build/sync_shop.py` locally and push.
- **Changes only when needed:** `js/shop.js` is rewritten, committed and published only when the store's products actually changed.
- **Excluded or grouped differently:** edit `EXCLUDE` and `GROUPS` at the top of `_build/sync_shop.py`. The Reiki deal is excluded because Reiki is discontinued. Deals listed twice in the store (same name and price) appear once.
- **If the store can't be read** (Weebly is down, or it changes its page layout and fewer than 5 products parse), nothing is written, the site keeps showing the last good list, and the failed run shows up in GitHub Actions, which emails the repo owner.
- **What the owner does:** manage deals in Weebly as usual. Ending or hiding a deal there removes it here by the next morning.

## Design

- **Fonts:** Bodoni Moda (headings and masthead), Jost (body and tracked caps), Ms Madi (script, used only for names and sign-offs).
- **Colors:** all sampled from the client's own site and storefront, with each source noted in `css/theme.css`:
  - `#ef2761`: the site title color;
  - `#ff69b4`: their Book Now button;
  - `#973749`: the bio-page titles;
  - blush tones: the storefront stucco.
- **Motion:** gentle fades and a slow services ticker only. There's no cursor-following movement, and everything stays still for visitors who've turned on "reduce motion".
- **Accessibility:** pink text is a deeper `--lipstick` shade wherever it's small, so it stays readable. The phone menu button and the bottom Call and Book bar are sized for thumbs. The menu overlay closes with Escape, keeps keyboard focus inside while open, and returns focus to the menu button when closed.

## Run it locally

```bash
cd painted-lady && python3 -m http.server 8850
```

Then open http://localhost:8850. The site must be served, not opened as a file, because the price list and team pages are built by JavaScript. The Claude preview config names this server `painted-lady`.

## Deploy

GitHub Pages serves `main` from the root folder. To publish a change:

```bash
git add -A && git commit -m "Describe the change" && git push
```

The live site updates in about a minute.

## Photos

- **Local:**
  - the six team portraits in `img/cast/`, cropped out of the old site's bio images, which had the bio text baked in. The original file and pixel box for each are noted in `CAST`;
  - the two team photos and the storefront in `img/photos/`. The team photos are resized to 1400px wide, twice their largest display width, and the storefront was converted from PNG to JPEG. That took the homepage from about 4.3 MB of photos to about 1.0 MB with no visible difference. Sources are noted in `PHOTOS`.
- **Still hotlinked** from the old Weebly site, so they break if it goes away: the tanning bed, Beauty Angel and sauna photos (small, 28–172 KB each). Download them into `img/` and update `PHOTOS` before the Weebly site is shut down.
- **Nice to have:** a short professional shoot (an airbrush tan in progress, the Zen Den, the interior, retail shelves). The bed photos are casual phone shots.

## Content sources

All copy is taken from the business's own material, captured 2026-09-25:
- every page in the old site's sitemap, including the hidden `bios.html` and `summerween.html`;
- the 38 store product pages;
- the GlossGenius booking site (services, packages, team, hours, cancellation policy, one client review);
- skincarebycourt.com (Courtney's facials).

No reviews, prices or facts were invented.

## Open questions for the owner

1. **Price conflicts** between the price page and GlossGenius:
   - 10 sauna sessions: $230 vs. $240;
   - The Cocktail: $60.50 vs. $61;
   - The Top Shelf: $82.50 vs. $83.

   The site uses the price page.
2. **Eyelash extensions** are mentioned on the old homepage, but there's no page or price for them. They're left out.
3. **VIP Pass** ($1,000/year): is it still offered?
4. **Adriana Rodriguez and Coral Chavez** are on the GlossGenius team page but have no bios. They're not on the site yet.
5. **Toni's flyer** says "Serving Fairfield, CA" and lists personal phone numbers. Both are left out; her bookings go through the salon.
6. **The *Allure* 2012 mention** is about the Lavish Tan product, not the salon. Keep it?
7. **Old-site problems to clean up** in the Weebly site (now at shop.thepaintedladynapavalley.com):
   - the Massage page shows a stock burger photo;
   - the airbrush page still links an old Schedulicity booking page;
   - several per-session prices are miscalculated;
   - 2021 promotions are still live in the store;
   - massage promotions say "not valid with Julie", who isn't on the team;
   - the store still sells "Buy One Reiki Session, Get One Half Off", though Reiki is discontinued (the new Shop page hides it).
8. **Store items that now appear on the new Shop page** (they come straight from Weebly, so fix them there):
   - the VIP Pass photo is a sample pass for a named person ("Holly La Porta, Valid for 2025");
   - the VIP Pass "regular price" of $8,550 makes its card say "Save 88%";
   - the $200-for-$100 gift certificate is a holiday special ("now through Christmas") that's still for sale;
   - "Buy 1 High Pressure Tanning Session, Get **on** Free" has a typo in its name.

**Resolved:** Reiki. The salon no longer offers it (2026-09-28), so it was removed from the whole site: the Wellness section, the price list, the home page, and Sharon's and Toni's bios.

## Credits

Built on the local-business starter kit (`js/main.js`), with a custom editorial layout for this client.
