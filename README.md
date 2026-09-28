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
| `index.html` | Magazine cover, Contents (services index), stats, airbrush feature, the cast covers, VIP Pass, founding story, client review, visit + map |
| `tanning.html` | Lavish airbrush tans, on-location spray tans, Mystic Tan, the five UV / high-pressure beds, the Cocktails (combos), before & after care |
| `wellness.html` | Red light therapy (Beauty Angel), infrared sauna (the Zen Den), massage with Logan and Toni, Reiki, Skin Care by Court |
| `menu.html` | The full price list, with section chips and search |
| `team.html` | The cast: one magazine-style profile per team member |
| `guide.html` | The Glow Guide: spray tan FAQ and DHA / FDA facts |
| `visit.html` | Address, hours, map, walk-in vs. appointment policy, cancellations |

## Structure

```
painted-lady/
├── index.html … visit.html   7 pages
├── css/theme.css             brand tokens: colors (with their sources), fonts
├── css/style.css             the whole layout and all components
├── js/site.js                ← ALL business facts: contact, hours, prices, team, photos
├── js/tpl.js                 renders the masthead, menu overlay, footer, cast covers, portrait crops, price lookups
├── js/main.js                shared behaviors from the local-biz starter kit (hours, open-now badge, map, price list, search, JSON-LD)
└── img/cast/*.jpg            the six team portraits, cropped from the old site's bio images
```

Scripts load in this order on every page: `site.js`, then `tpl.js`, then `main.js`. `tpl.js` must run before `main.js`, because `main.js` fills in hooks that `tpl.js` renders (the open-now badge and hours in the header and footer).

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

- **Local:** the six team portraits in `img/cast/`. They were cropped out of the old site's bio images, which had the bio text baked in. The original file and pixel box for each are noted in `CAST`.
- **Still hotlinked**, so they break if those hosts go away:
  - the team photos, from the Weebly site and the GlossGenius booking site;
  - the storefront photo, from the Weebly site;
  - the tanning bed, Beauty Angel and sauna photos, from the Weebly site.

  Download them into `img/` and update `PHOTOS` before the old Weebly site is shut down.
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
4. **Sharon's Reiki** comes from the older hidden bio page and a Reiki promo. Her current bio doesn't mention it.
5. **Adriana Rodriguez and Coral Chavez** are on the GlossGenius team page but have no bios. They're not on the site yet.
6. **Toni's flyer** says "Serving Fairfield, CA" and lists personal phone numbers. Both are left out; her bookings go through the salon.
7. **The *Allure* 2012 mention** is about the Lavish Tan product, not the salon. Keep it?
8. **Old-site problems to clean up** if the Weebly site stays live:
   - the Massage page shows a stock burger photo;
   - the airbrush page still links an old Schedulicity booking page;
   - several per-session prices are miscalculated;
   - 2021 promotions are still live in the store;
   - massage promotions say "not valid with Julie", who isn't on the team.

## Credits

Built on the local-business starter kit (`js/main.js`), with a custom editorial layout for this client.
