#!/usr/bin/env python3
"""Sync the Weebly store's live products into js/shop.js (window.SHOP) for the new site's Shop page.

Run from the repo root:  python3 _build/sync_shop.py
Runs daily in GitHub Actions (.github/workflows/sync-shop.yml); also runnable by hand.

How it works: the store's sitemap lists every published product. Each product page carries
schema.org markup (name, sale price, description) plus Weebly's price boxes (regular price)
and an og:image. Checkout stays on the Weebly store: every item links to its own product page.

Safeguards: if the sitemap can't be read, or too few products parse, nothing is written
(the site keeps the last good list) and the script exits non-zero so the Action run fails.
js/shop.js is only rewritten when the product data actually changed.
Standard library only.
"""
import html, json, re, sys, time, urllib.request
from datetime import datetime, timezone
from pathlib import Path

SHOP = "https://shop.thepaintedladynapavalley.com"
OUT = Path(__file__).resolve().parent.parent / "js" / "shop.js"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36"
MIN_ITEMS = 5  # fewer than this parsed → treat as a failure, keep the last good file

# Never show these (case-insensitive, matched against the product name).
# Reiki: discontinued 2026-09-28, but the deal is still in the Weebly store.
EXCLUDE = [r"\breiki\b"]

# Display groups, first match wins (matched against name + description). Order = order on the page.
GROUPS = [
    ("Memberships & gifts", r"\bvip\b|gift certificate|gift card"),
    ("Spray tans", r"airbrush|lavish|mystic|spray"),
    ("UV tanning", r"\buv\b|high.pressure|tanning session|tanning bed|unlimited .*tanning"),
    ("Wellness", r"red light|sauna|massage|facial"),
    ("Take-home", r"lotion|candle|lip balm|packet"),
]
OTHER = "More deals"


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en-US"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")


def text(s):
    s = re.sub(r"<br\s*/?>", " ", s or "", flags=re.I)
    s = re.sub(r"<[^>]+>", " ", s)
    return re.sub(r"\s+", " ", html.unescape(s)).strip()


def money(s):
    m = re.search(r"[\d,]+(?:\.\d+)?", s or "")
    return round(float(m.group().replace(",", "")), 2) if m else None


def first(pattern, s, flags=re.S | re.I):
    m = re.search(pattern, s, flags)
    return m.group(1) if m else None


def product(url):
    page = get(url)
    name = text(first(r'itemprop="name"[^>]*>(.*?)</', page) or first(r'<meta property="og:title" content="([^"]*)"', page))
    if not name:
        return None
    if "Add to Cart" not in page:                     # not purchasable right now
        return None
    sale = money(first(r'itemprop="price"[^>]*content="([^"]*)"', page) or "")
    regular = money(text(first(r'id="wsite-com-product-price"[^>]*>(.*?)</div>', page)))
    if sale is None:
        sale = regular
    if regular is None or regular <= (sale or 0):     # not on sale: show one price
        regular = None
    desc = text(first(r'itemprop="description"[^>]*>(.*?)</div>', page))
    desc = re.sub(r"\s+", " ", re.sub(r"https?://\S+|CLICK HERE[^.]*\.?", "", desc)).strip()  # bare links / "click here" read badly on a card
    img = first(r'<meta property="og:image" content="([^"]*)"', page) or ""
    img = re.sub(r"^http://", "https://", img)
    return {"name": name, "price": sale, "was": regular, "desc": desc, "img": img}


def group_for(item):
    hay = f"{item['name']} {item['desc']}".lower()
    for label, pat in GROUPS:
        if re.search(pat, hay):
            return label
    return OTHER


def main():
    try:
        sitemap = get(f"{SHOP}/sitemap.xml")
    except Exception as e:
        sys.exit(f"Could not read the store sitemap: {e}")
    paths = sorted(set(re.findall(r"<loc>https?://[^/<]+(/store/p\d+/[^<]+)</loc>", sitemap)),
                   key=lambda p: -int(re.search(r"/p(\d+)/", p).group(1)))  # newest first
    items, failed, seen = [], [], set()
    for path in paths:
        pid = re.search(r"/p(\d+)/", path).group(1)
        url = SHOP + path
        try:
            p = product(url)
        except Exception as e:
            failed.append(f"p{pid}: {e}")
            continue
        finally:
            time.sleep(0.4)                          # be polite to the store
        if not p or any(re.search(x, p["name"], re.I) for x in EXCLUDE):
            continue
        dup = (p["name"].lower(), p["price"])       # the store lists some deals twice: keep the newest (paths are newest-first)
        if dup in seen:
            continue
        seen.add(dup)
        p.update(id=int(pid), url=url)
        p["group"] = group_for(p)
        items.append(p)

    if failed:
        print("Failed:", *failed, sep="\n  ", file=sys.stderr)
    if len(items) < MIN_ITEMS:
        sys.exit(f"Only {len(items)} products parsed (minimum {MIN_ITEMS}); keeping the last good js/shop.js.")

    order = [g for g, _ in GROUPS] + [OTHER]
    items.sort(key=lambda i: (order.index(i["group"]), -i["id"]))
    keys = ["id", "group", "name", "price", "was", "desc", "img", "url"]
    items = [{k: i[k] for k in keys} for i in items]

    old = None
    if OUT.exists():
        m = re.search(r"\"items\": (\[.*\])\n\};", OUT.read_text(), re.S)
        old = json.loads(m.group(1)) if m else None
    if old == items:
        print(f"No changes ({len(items)} products).")
        return

    data = {"synced": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%MZ"), "store": SHOP, "groups": order}
    body = json.dumps(data, indent=2)[:-2]  # drop the closing brace; items go last on their own lines
    OUT.write_text(
        "/* Generated by _build/sync_shop.py from the Weebly store. Do not edit by hand: change the store,\n"
        "   or EXCLUDE / GROUPS in the script. */\n"
        f"window.SHOP = {body},\n  \"items\": {json.dumps(items, indent=2, ensure_ascii=False)}\n}};\n"
    )
    print(f"Wrote {OUT.relative_to(OUT.parent.parent)}: {len(items)} products"
          + (f" (was {len(old)})" if old is not None else ""))


if __name__ == "__main__":
    main()
