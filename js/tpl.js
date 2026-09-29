/* The Painted Lady: layout chrome + extras. Loads after site.js and BEFORE the kit's main.js,
   so main.js still fills the hooks rendered here ([data-status], [data-hours-summary], [data-year], phones, .reveal).
   Hooks:
     [data-chrome="top"] / [data-chrome="foot"]   announcement bar + masthead + menu overlay / footer + mobile bar
     body.is-home + .cover-mast                     masthead wordmark stays hidden until the cover masthead scrolls away
     [data-portrait="alli"]                         crops a CAST portrait out of its bio image (lazy), sized to the element
     [data-cast="covers"] / [data-cast="profiles"]  magazine-cover cards / full team spreads from CAST
     [data-price="menuId:Item name"]                exact price from MENU; [data-from="menuId"] = lowest price in a section */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const S = window.SITE || {}, CAST = window.CAST || [], MENU = window.MENU || [];
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const EXT = ' target="_blank" rel="noopener"';
  const A = S.address || {};
  const addrLine = `${A.street}, ${A.city}, ${A.region} ${A.zip}`;
  const tel = "tel:+1" + String(S.phone || "").replace(/\D/g, "");
  const directions = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(addrLine);
  const here = location.pathname.split("/").pop() || "index.html";
  const book = S.order || { label: "Book now", url: "#" };
  const shop = S.shop && S.shop.url ? S.shop : null;
  const socials = Object.entries(S.social || {}).filter(([, u]) => u);
  const cap = s => s[0].toUpperCase() + s.slice(1);
  const pad = n => String(n).padStart(2, "0");
  // "$60", "$49.50", "$1,000", "$200+" (a function declaration, so every section below can use it)
  function fmt(p) {
    if (p == null) return "";
    const n = parseFloat(p), plus = /\+$/.test(String(p)) ? "+" : "";
    return "$" + n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }) + plus;
  }

  /* ---------- Chrome: announcement bar, masthead, menu overlay ---------- */
  const link = n => `<a href="${n.href}"${n.href === here ? ' aria-current="page"' : ""}>${esc(n.label)}</a>`;
  const shopOn = !!S.shopDeals; // SITE.shopDeals: on-site Shop switched on?
  const shopHref = shopOn ? "shop.html" : (S.shop || {}).url || "#";
  const shopExt = shopOn ? "" : EXT;
  const nav = (S.nav || []).filter(n => shopOn || n.href !== "shop.html"), half = Math.ceil(nav.length / 2);
  const SUBS = { // overlay sub-links (in-page anchors)
    "tanning.html": [["Airbrush", "tanning.html#airbrush"], ["Mystic Tan", "tanning.html#mystic"], ["The beds", "tanning.html#beds"], ["Cocktails", "tanning.html#cocktails"]],
    "wellness.html": [["Red light", "wellness.html#red-light"], ["Sauna", "wellness.html#sauna"], ["Massage", "wellness.html#massage"], ["Facials", "wellness.html#skin"]],
  };

  $$('[data-chrome="top"]').forEach(slot => {
    slot.outerHTML = `
      <a class="skip" href="#main">Skip to content</a>
      <div class="announce">
        <div class="wrap">
          <span class="status" data-status></span>
          <span class="announce-mid">No appointment needed for UV &amp; Mystic Tan</span>
          <a class="announce-phone" href="${tel}">${esc(S.phone)}</a>
        </div>
      </div>
      <header class="mast">
        <div class="wrap mast-row">
          <div class="mast-l">
            <button class="menu-btn" type="button" aria-expanded="false" aria-controls="overlay">
              <span class="burger" aria-hidden="true"><i></i><i></i></span><span class="menu-label">Menu</span>
            </button>
            <nav class="mast-nav" aria-label="Main">${nav.slice(0, half).map(link).join("")}</nav>
          </div>
          <a class="wordmark" href="index.html" aria-label="${esc(S.name)}, home">
            <span class="wm-main">${esc(S.name)}</span><span class="wm-sub">${esc(S.tagline || "")}</span>
          </a>
          <div class="mast-r">
            <nav class="mast-nav" aria-label="More">${nav.slice(half).map(link).join("")}</nav>
            <a class="btn btn-hot mast-book" href="${esc(book.url)}"${EXT}>${esc(book.label)}</a>
          </div>
        </div>
      </header>
      <div class="overlay" id="overlay" role="dialog" aria-modal="true" aria-label="Menu" hidden>
        <div class="overlay-inner">
          <div class="overlay-top">
            <a class="wordmark" href="index.html"><span class="wm-main">${esc(S.name)}</span></a>
            <button class="overlay-close" type="button" aria-label="Close menu">Close <span aria-hidden="true">✕</span></button>
          </div>
          <ol class="overlay-links">
            <li><a href="index.html"${here === "index.html" ? ' aria-current="page"' : ""}><small>00</small>Home</a></li>
            ${nav.map((n, i) => `<li>${link(n).replace(">", `><small>${pad(i + 1)}</small>`)}
              ${SUBS[n.href] ? `<span class="overlay-subs">${SUBS[n.href].map(([l, h]) => `<a href="${h}">${esc(l)}</a>`).join("")}</span>` : ""}</li>`).join("")}
          </ol>
          <div class="overlay-foot">
            <div><h4>Visit</h4><p>${esc(A.street)}<br>${esc(`${A.city}, ${A.region} ${A.zip}`)}</p><p><a href="${tel}">${esc(S.phone)}</a></p></div>
            <div><h4>Hours</h4><ul class="plain" data-hours-summary></ul></div>
            <div><h4>Follow</h4><p>${socials.map(([k, u]) => `<a href="${esc(u)}"${EXT}>${cap(k)}</a>`).join("<br>")}</p></div>
          </div>
          <a class="btn btn-hot overlay-book" href="${esc(book.url)}"${EXT}>${esc(book.label)}</a>
        </div>
      </div>`;
  });

  /* ---------- Footer + mobile Call / Book bar ---------- */
  $$('[data-chrome="foot"]').forEach(slot => {
    slot.outerHTML = `
      <footer class="foot">
        <div class="awning" aria-hidden="true"></div>
        <div class="wrap">
          <p class="foot-mark" aria-hidden="true">${esc(S.name)}</p>
          <div class="foot-grid">
            <div class="foot-about">
              <p>${esc(S.footerBlurb || "")}</p>
              <p class="foot-social">${socials.map(([k, u]) => `<a href="${esc(u)}"${EXT}>${cap(k)}</a>`).join(" · ")}</p>
              ${shop ? `<p><a class="link-arrow" href="${esc(shopHref)}"${shopExt}>${esc(shop.label)}</a></p>` : ""}
            </div>
            <div>
              <h4>Visit</h4>
              <p>${esc(A.street)}<br>${esc(`${A.city}, ${A.region} ${A.zip}`)}<br><span class="foot-cross">${esc(S.cross || "")}</span></p>
              <p><a href="${tel}">${esc(S.phone)}</a><br><a href="mailto:${esc(S.email)}">${esc(S.email)}</a></p>
            </div>
            <div><h4>Hours</h4><ul class="plain" data-hours-summary></ul><p class="foot-status"><span class="status" data-status></span></p></div>
            <div><h4>Explore</h4><ul class="plain">${[{ label: "Home", href: "index.html" }, ...nav].map(n => `<li><a href="${n.href}">${esc(n.label)}</a></li>`).join("")}</ul></div>
            <div><h4>Mobile spray tans</h4><ul class="plain">${(S.areas || []).map(a => `<li>${esc(a)}</li>`).join("")}</ul>
              <a class="btn btn-hot foot-book" href="${esc(book.url)}"${EXT}>${esc(book.label)}</a></div>
          </div>
          <div class="foot-base">
            <span>© <span data-year></span> ${esc(S.name)} Tanning &amp; Spa · Napa, California</span>
            <span>${esc(S.footerNote || "")}</span>
          </div>
        </div>
      </footer>
      <div class="book-bar"><a href="${tel}">Call</a><a href="${esc(book.url)}"${EXT}>${esc(book.label)}</a></div>`;
  });

  /* Photos decode off the main thread (a big image arriving mid-scroll can't stall a frame).
     Set before main.js assigns src from PHOTOS. The first photo on a page is the hero: fetch it first. */
  $$("img[data-photo]").forEach((img, i) => { img.decoding = "async"; if (i === 0 && !img.hasAttribute("loading")) img.fetchPriority = "high"; });

  /* Fill simple SITE hooks the kit doesn't cover */
  $$("[data-book]").forEach(a => { a.href = book.url; a.target = "_blank"; a.rel = "noopener"; });
  $$("[data-tel]").forEach(a => (a.href = tel)); // tel: link that keeps its own label ([data-phone] replaces the text)
  $$("[data-shop]").forEach(a => { a.href = shopHref; if (!shopOn) { a.target = "_blank"; a.rel = "noopener"; } });
  $$("[data-email]").forEach(a => { a.href = "mailto:" + S.email; if (!a.textContent.trim()) a.textContent = S.email; });

  /* ---------- Shop: deals from window.SHOP (js/shop.js, synced daily from the Weebly store by _build/sync_shop.py) ----------
     Checkout stays on the Weebly store: every card links to that item's page there.
     [data-shop-grid]        every deal, one section per group
     [data-shop-index]       <ol> of group links (the Shop page's sticky index)
     [data-shop-teaser="4"]  the newest N deals, memberships excluded (home page)
     [data-shop-count]       number of deals · [data-shop-synced] date of the last sync
     [data-shop-find="vip pass"]  href → the first deal whose name matches (falls back to shop.html) */
  const nameRe = s => new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "\\s*"), "i");
  const saleNames = (S.shopShowSale || []).map(nameRe), onlyNames = (S.shopOnly || []).map(nameRe);
  const imgFor = Object.entries(S.shopImages || {}).map(([n, src]) => [nameRe(n), src]);
  const RAW = window.SHOP && Array.isArray(window.SHOP.items) ? window.SHOP : { items: [], groups: [] };
  const SH = { ...RAW, items: RAW.items // SITE.shopOnly narrows the list; SITE.shopImages swaps in our own photos
    .filter(i => !onlyNames.length || onlyNames.some(re => re.test(i.name)))
    .map(i => { const own = imgFor.find(([re]) => re.test(i.name)); return own ? { ...i, img: own[1] } : i; }) };
  const shopOnlyMode = onlyNames.length > 0;
  document.body.classList.toggle("shop-only", shopOnlyMode);
  const slug = s => "g-" + s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "");
  const lastWordEm = s => { const w = esc(s).split(" "); return w.length > 1 ? `${w.slice(0, -1).join(" ")} <em>${w.at(-1)}</em>` : `<em>${w[0]}</em>`; };
  const deal = i => { // regular price only, unless the deal is listed in SITE.shopShowSale
    const was = i.was && saleNames.some(re => re.test(i.name)) ? i.was : null, price = was ? i.price : i.was || i.price; return `
    <article class="deal reveal">
      <a class="deal-img" href="${esc(i.url)}" tabindex="-1" aria-hidden="true"><img src="${esc(i.img)}" alt="" loading="lazy" decoding="async"></a>
      <div class="deal-body">
        <p class="deal-group">${esc(i.group)}</p>
        <h3 class="deal-name"><a href="${esc(i.url)}">${esc(i.name)}</a></h3>
        ${i.desc ? `<p class="deal-desc">${esc(i.desc)}</p>` : ""}
        <p class="deal-price">${was ? `<s aria-label="Regular price ${fmt(was)}">${fmt(was)}</s>` : ""}<b>${fmt(price)}</b>${was ? `<small>Save ${Math.round((1 - price / was) * 100)}%</small>` : ""}</p>
        <a class="btn btn-ink deal-buy" href="${esc(i.url)}">Get this deal</a>
      </div>
    </article>`; };
  const groups = (SH.groups || []).filter(g => SH.items.some(i => i.group === g));
  $$("[data-shop-grid]").forEach(root => {
    root.innerHTML = SH.items.length ? groups.map(g => {
      const list = SH.items.filter(i => i.group === g);
      return `<section class="shop-group" id="${slug(g)}" aria-labelledby="${slug(g)}-h">
        <div class="tier-head"><h2 id="${slug(g)}-h">${lastWordEm(g)}</h2><p>${list.length} ${list.length === 1 ? "deal" : "deals"}</p></div>
        <div class="deals">${list.map(deal).join("")}</div>
      </section>`;
    }).join("") : `<p class="shop-empty">Our deals are taking a quick break from this page. See them all in our <a href="${esc((S.shop || {}).url || "#")}">online store</a>, or call <a href="${tel}">${esc(S.phone)}</a>.</p>`;
  });
  $$("[data-shop-index]").forEach(ol => {
    if (!groups.length) return void (ol.closest("nav").hidden = true);
    ol.innerHTML = groups.map((g, k) => `<li><a href="#${slug(g)}"><small>${pad(k + 1)}</small>${esc(g)}</a></li>`).join("");
  });
  $$("[data-shop-teaser]").forEach(root => {
    if (!shopOn) return void (root.closest("section").hidden = true);
    const list = SH.items.filter(i => !/membership|gift/i.test(i.group)).sort((a, b) => b.id - a.id).slice(0, +root.dataset.shopTeaser || 4);
    if (!list.length) return void (root.closest("section").hidden = true);
    root.innerHTML = list.map(deal).join("");
  });
  $$("[data-shop-count]").forEach(el => (el.textContent = SH.items.length));
  if (shopOnlyMode) $$("[data-shop-only]").forEach(el => (el.innerHTML = el.dataset.shopOnly)); // alternate headline/lede (our own HTML)
  $$("[data-shop-synced]").forEach(el => {
    const d = SH.synced && new Date(SH.synced.replace(/Z$/, ":00Z"));
    el.textContent = d && !isNaN(d) ? d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "";
    if (!el.textContent) el.closest("[data-shop-synced-wrap]")?.setAttribute("hidden", "");
  });
  $$("[data-shop-find]").forEach(a => {
    const re = new RegExp(a.dataset.shopFind, "i"), hit = SH.items.find(i => re.test(i.name));
    a.href = hit ? hit.url : shopHref;
  });
  $$("[data-cross]").forEach(el => (el.textContent = S.cross || ""));
  $$("[data-social]").forEach(a => { const u = (S.social || {})[a.dataset.social]; if (!u) return void (a.hidden = true); a.href = u; a.target = "_blank"; a.rel = "noopener"; });

  /* ---------- Menu overlay ---------- */
  const overlay = $("#overlay"), menuBtn = $(".menu-btn");
  if (overlay && menuBtn) {
    const open = () => {
      overlay.hidden = false; requestAnimationFrame(() => overlay.classList.add("open"));
      menuBtn.setAttribute("aria-expanded", "true"); document.body.style.overflow = "hidden";
      $(".overlay-close", overlay).focus();
    };
    const close = () => {
      overlay.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); document.body.style.overflow = "";
      setTimeout(() => (overlay.hidden = true), 350); menuBtn.focus();
    };
    menuBtn.addEventListener("click", open);
    $(".overlay-close", overlay).addEventListener("click", close);
    overlay.addEventListener("click", e => { if (e.target.closest("a")) close(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !overlay.hidden) close(); });
    overlay.addEventListener("keydown", e => { // keep Tab inside the open menu
      if (e.key !== "Tab") return;
      const f = $$("a, button", overlay), first = f[0], last = f.at(-1);
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---------- Masthead: shadow once scrolled; home keeps the wordmark hidden while the cover masthead shows ---------- */
  const mast = $(".mast");
  if (mast) {
    const onScroll = () => mast.classList.toggle("is-scrolled", scrollY > 10);
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
    const coverMast = $(".cover-mast");
    if (coverMast && "IntersectionObserver" in window) {
      mast.classList.add("hide-mark");
      new IntersectionObserver(([e]) => mast.classList.toggle("hide-mark", e.isIntersecting), { rootMargin: "-70px 0px 0px 0px" }).observe(coverMast);
    }
  }

  /* ---------- In-page index (.subnav): highlight the section in view ---------- */
  const sub = $(".subnav");
  if (sub && "IntersectionObserver" in window) {
    const links = $$('a[href^="#"]', sub), strip = $("ol", sub);
    const spy = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
      // Scroll only the strip sideways. scrollIntoView() also moved the PAGE (24px yank at every section = scroll jitter).
      const a = $(".active", sub);
      if (a && strip.scrollWidth > strip.clientWidth) {
        const ar = a.getBoundingClientRect(), sr = strip.getBoundingClientRect();
        strip.scrollTo({ left: strip.scrollLeft + ar.left - sr.left - (sr.width - ar.width) / 2, behavior: "smooth" });
      }
    }), { rootMargin: "-40% 0px -55% 0px" });
    links.forEach(a => { const t = document.getElementById(a.getAttribute("href").slice(1)); if (t) spy.observe(t); });
  }

  /* ---------- Cast: magazine covers + profiles ---------- */
  const light = hex => { const n = parseInt(hex.slice(1), 16); return (0.2126 * (n >> 16) + 0.7152 * (n >> 8 & 255) + 0.0722 * (n & 255)) / 255 > .55; };
  const note = c => c.inspired ? `Inspired by ${c.inspired}` : c.look || "";
  const cover = (c, i, tag = "a") => `
    <${tag} class="cover-card${light(c.color) ? " is-light" : ""}"${tag === "a" ? ` href="team.html#${c.id}"` : ""} style="--c:${c.color}">
      <span class="cc-top"><span class="cc-mast">${esc(S.name)}</span><span class="cc-issue"><span>No. ${pad(i + 1)}</span><span>Napa Valley</span></span></span>
      <span class="cc-img" data-portrait="${c.id}" role="img" aria-label="${esc(`${c.name}'s portrait${c.inspired ? `, inspired by ${c.inspired}` : ""}`)}"></span>
      <span class="cc-lines"><span class="cc-name">${esc(c.name)}</span><span class="cc-role">${esc(c.role)}</span><span class="cc-note">${esc(note(c))}</span></span>
    </${tag}>`;
  $$('[data-cast="covers"]').forEach(root => (root.innerHTML = CAST.map((c, i) => cover(c, i)).join("")));
  $$('[data-cast="profiles"]').forEach(root => {
    root.innerHTML = CAST.map((c, i) => `
      <article class="profile reveal" id="${c.id}" style="--c:${c.color}">
        <div class="profile-cover">${cover(c, i, "div")}</div>
        <div class="profile-text">
          <p class="eyebrow">No. ${pad(i + 1)} · ${esc(c.role)}</p>
          <h2 class="profile-name">${esc(c.name)}</h2>
          <div class="profile-bio">${c.bio.map(p => `<p>${esc(p)}</p>`).join("")}</div>
          ${c.inspired ? `<p class="profile-inspired">“My picture is inspired by ${esc(c.inspired)}.”</p>` : ""}
          <ul class="tags">${c.tags.map(t => `<li>${esc(t)}</li>`).join("")}</ul>
          <p class="profile-actions">
            <a class="btn btn-ink" href="${esc(book.url)}"${EXT}>Book with ${esc(c.name.split(" ")[0])}</a>
            ${c.link ? `<a class="btn btn-line" href="${esc(c.link.url)}"${EXT}>${esc(c.link.label)}</a>` : ""}
          </p>
        </div>
      </article>`).join("");
  });

  /* ---------- Portraits: crop the portrait out of its bio image, sized to the element ----------
     Background crop, so the visible box = the element's aspect, centered on the portrait (faces sit high: fy .3). */
  const byId = Object.fromEntries(CAST.map(c => [c.id, c]));
  const crop = el => {
    const c = byId[el.dataset.portrait]; if (!c) return;
    const [W, H] = c.nat, [x0, y0, x1, y1] = c.box;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) return;
    const aspect = r.width / r.height;
    let w = x1 - x0, h = y1 - y0, vx = x0, vy = y0;
    if (w / h > aspect) { const nw = h * aspect; vx += (w - nw) / 2; w = nw; } else { const nh = w / aspect; vy += (h - nh) * .3; h = nh; }
    const pct = (v, room) => (room > 0.5 ? (v / room) * 100 : 0); // no room to shift (box spans the image) → 0/0 guard
    el.style.backgroundSize = `${(W / w) * 100}% auto`;
    el.style.backgroundPosition = `${pct(vx, W - w)}% ${pct(vy, H - h)}%`;
  };
  const portraits = $$("[data-portrait]");
  const load = el => { const c = byId[el.dataset.portrait]; if (c) el.style.backgroundImage = `url("${c.src}")`; };
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { load(e.target); io.unobserve(e.target); } }), { rootMargin: "600px" });
    portraits.forEach(el => io.observe(el));
  } else portraits.forEach(load);
  if ("ResizeObserver" in window) { const ro = new ResizeObserver(es => es.forEach(e => crop(e.target))); portraits.forEach(el => ro.observe(el)); }
  else portraits.forEach(crop);

  /* ---------- Prices from MENU (so page copy never drifts from the price list) ---------- */
  const section = id => MENU.find(s => s.id === id);
  $$("[data-price]").forEach(el => {
    const [id, name] = el.dataset.price.split(":");
    const it = section(id)?.items.find(i => i[0] === name);
    if (it) el.textContent = fmt(it[1]); else console.warn("No price for", el.dataset.price);
  });
  $$("[data-from]").forEach(el => {
    const ps = (section(el.dataset.from)?.items || []).map(i => parseFloat(i[1])).filter(n => !isNaN(n));
    if (ps.length) el.textContent = fmt(Math.min(...ps));
  });
  // After main.js renders the price list: "$1000.00" → "$1,000", "$60.00" → "$60"
  document.addEventListener("DOMContentLoaded", () => {
    $$("#menu .item-price").forEach(el => (el.textContent = fmt(el.textContent.replace(/[$,]/g, ""))));
  });
})();
