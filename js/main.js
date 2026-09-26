/* Starter kit behaviors. Nothing here is client-specific; edit js/site.js instead.
   Hooks (all optional; drop them into any page):
     [data-slot="header"] [data-slot="footer"]   shared chrome
     [data-phone] [data-address] [data-name]     text (and tel: href on <a data-phone>)
     [data-directions]                           href → Google Maps directions
     [data-map]                                  empty div → embedded map iframe
     [data-status]                               open-now pill
     [data-hours]                                <table> → full week, today highlighted
     [data-hours-summary]                        <ul> → compact "Tue–Thu 11 am – 8 pm"
     [data-years] [data-year]                    years since SITE.founded / current year
     [data-day="fri"]                            hidden unless it's that day (business tz)
     .reveal                                     fade up on scroll
     #menu + .chips + #menu-search               menu page (item[3] = optional detail-page href)
     [data-gallery] + .lightbox                  gallery page; data-gallery="NAME" renders window.NAME
     [data-gallery-filters]                      tag filter chips for the gallery
     [data-order]                                href → SITE.order.url (hidden when there's no order link)
     img[data-photo="key"] data-w data-h         src/alt from window.PHOTOS (one place to swap hotlinks for local files)
     [data-products="MERCH"]                     product cards from window.MERCH; data-group / data-feature filter them
     [data-showcase] + .slide                    hero carousel (names/prices from MENU via data-dish); dots, swipe, keys
     [data-parallax] + .depth (--d)              layers drift with the pointer
     .hero-enter (on .hero)                      staged entrance: copy rises, h1 .ln lines slide up, .swash draws, .stamp stamps in
   SITE options: nav children → dropdowns; social as object or [{label,url}]; areas (strings or {label,href}), quickLinks,
   footerCta {label,href}, legal [{label,href}], license, logo, moreContact,
   order {label,url} → header button + mobile bar become "Order" instead of Call/Directions. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const S = window.SITE || {}, H = window.HOURS || {}, P = window.PHOTOS || {};
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const money = p => p == null ? "" : typeof p === "number" ? `$${p.toFixed(2)}` : p.split(" / ").map(v => `$${v}`).join(" / ");
  // Photo srcs may contain {w}/{h} (CDNs that resize by URL); local files simply ignore them
  const sized = (src, w = 480, h = w) => String(src).replace(/\{w\}/g, w).replace(/\{h\}/g, h);
  const order = S.order && S.order.url ? S.order : null;
  const EXT = ' target="_blank" rel="noopener"';

  const DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const DAY_NAMES = { sun: "Sunday", mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday" };
  const WEEK = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]; // display order

  const A = S.address || {};
  const addrLine = [A.street, A.city && `${A.city}, ${A.region} ${A.zip}`].filter(Boolean).join(", ");
  const telOf = p => "tel:+1" + String(p).replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
  const tel = S.phone ? telOf(S.phone) : "";
  const smsOf = p => "sms:+1" + String(p).replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
  const directions = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(addrLine);
  const here = location.pathname.split("/").pop() || "index.html";

  /* ---------- Shared chrome ---------- */
  const fullName = `${S.name || ""} ${S.nameAccent || ""}`.trim();
  const wordmark = `<span class="brand-name">${esc(S.name || "")}${S.nameAccent ? ` <em>${esc(S.nameAccent)}</em>` : ""}</span>`;
  const logo = S.logo ? `<img class="brand-logo" src="${esc(S.logo)}" alt="" width="186" height="132">` : ""; // optional SITE.logo

  // Nav items: { label, href } or { label, href, children: [{ label, href }], wide: true } for a dropdown
  const isHere = href => !href.includes("#") && href === here;
  const chevron = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`;
  const navItem = n => {
    if (!n.children) return `<a href="${n.href}"${isHere(n.href) ? ' aria-current="page"' : ""}>${esc(n.label)}</a>`;
    const active = [n, ...n.children].some(c => isHere(c.href));
    const id = "sub-" + n.label.toLowerCase().replace(/\W+/g, "-");
    return `<div class="nav-group${n.wide ? " wide" : ""}">
      <a class="nav-parent${active ? " is-active" : ""}" href="${n.href}"${isHere(n.href) ? ' aria-current="page"' : ""}>${esc(n.label)}</a>
      <button class="sub-toggle" aria-expanded="false" aria-controls="${id}" aria-label="Show ${esc(n.label)} pages">${chevron}</button>
      <div class="sub" id="${id}">${n.children.map(c => `<a href="${c.href}"${isHere(c.href) ? ' aria-current="page"' : ""}>${esc(c.label)}</a>`).join("")}</div>
    </div>`;
  };

  $$('[data-slot="header"]').forEach(slot => {
    slot.outerHTML = `
      <a class="skip" href="#main">Skip to content</a>
      <header class="site-header">
        <div class="wrap">
          <a class="brand${logo ? " has-logo" : ""}" href="index.html" aria-label="${esc(fullName)} home">
            ${logo}<span class="brand-text">${wordmark}${S.tagline ? `<span class="brand-sub">${esc(S.tagline)}</span>` : ""}</span>
          </a>
          <button class="menu-toggle" aria-expanded="false" aria-controls="nav" aria-label="Menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
          </button>
          <nav class="nav" id="nav" aria-label="Main">
            ${(S.nav || []).map(navItem).join("")}
            ${order ? `<a class="btn btn-accent" href="${esc(order.url)}"${EXT}>${esc(order.label || "Order online")}</a>`
              : S.phone ? `<a class="btn btn-accent" href="${tel}">Call ${esc(S.phone)}</a>` : ""}
          </nav>
        </div>
      </header>`;
  });

  /* Footer columns: brand · find us (+ hours) · areas (optional) · explore · connect (optional).
     SITE.social may be an object { instagram: url } or an array [{ label, url }] (for two accounts on one network). */
  $$('[data-slot="footer"]').forEach(slot => {
    const socials = Array.isArray(S.social) ? S.social.filter(s => s.url)
      : Object.entries(S.social || {}).filter(([, url]) => url).map(([k, url]) => ({ label: k[0].toUpperCase() + k.slice(1), url }));
    const quick = S.quickLinks || (S.nav || []).map(({ label, href }) => ({ label, href }));
    const areas = S.areas || [];
    const connect = socials.length || S.footerCta;
    const cols = ["1.35fr", "1fr", areas.length && "1.45fr", ".95fr", connect && "1fr"].filter(Boolean).join(" ");
    slot.outerHTML = `
      <footer class="site-footer">
        <div class="wrap">
          <div class="foot-grid" style="--foot-cols:${cols}">
            <div class="foot-brand">${logo}${wordmark}<p>${esc(S.footerBlurb || "")}</p>${S.license ? `<p class="foot-license">${esc(S.license)}</p>` : ""}</div>
            <div><h4>Find us</h4><ul>
              ${A.street ? `<li>${esc(A.street)}</li><li>${esc(`${A.city}, ${A.region} ${A.zip}`)}</li>` : ""}
              ${S.phone ? `<li><a href="${tel}">${esc(S.phone)}</a></li>` : ""}
              ${(S.moreContact || []).map(c => `<li>${esc(c.label)}: <a href="${telOf(c.phone)}">${esc(c.phone)}</a></li>`).join("")}
              ${S.email ? `<li><a href="mailto:${esc(S.email)}">${esc(S.email)}</a></li>` : ""}
            </ul>
            <h4 class="foot-sub">Hours</h4><ul data-hours-summary></ul></div>
            ${areas.length ? `<div class="foot-areas"><h4>${esc(S.areasTitle || "Areas we serve")}</h4><ul>${areas.map(a => typeof a === "string"
              ? `<li>${esc(a)}</li>` : `<li><a href="${a.href}">${esc(a.label)}</a></li>`).join("")}</ul></div>` : ""}
            <div><h4>Explore</h4><ul>${quick.map(n => `<li><a href="${n.href}">${esc(n.label)}</a></li>`).join("")}</ul></div>
            ${connect ? `<div><h4>Connect</h4><ul>
              ${socials.map(s => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join("")}
            </ul>${S.footerCta ? `<a class="btn btn-accent foot-cta" href="${S.footerCta.href}">${esc(S.footerCta.label)}</a>` : ""}</div>` : ""}
          </div>
          <div class="foot-base">
            <span>© <span data-year></span> ${esc(fullName)}${(S.legal || []).map(l => ` · <a href="${l.href}">${esc(l.label)}</a>`).join("")}</span>
            <span>${esc(S.footerNote || "")}</span>
          </div>
        </div>
      </footer>
      ${S.phone ? `<div class="call-bar"><a href="${tel}" aria-label="Call ${esc(S.phone)}">Call</a>${order
        // SITE.order → Call + Order; SITE.sms → Call + Text (service businesses come to you); otherwise Call + Directions
        ? `<a href="${esc(order.url)}"${EXT}>${esc(order.label || "Order online")}</a>`
        : S.sms ? `<a href="${smsOf(S.sms)}" aria-label="Text ${esc(S.sms)}">Text us</a>`
        : `<a href="${directions}" target="_blank" rel="noopener">Directions</a>`}</div>` : ""}`;
  });

  /* ---------- Simple fills ---------- */
  $$("[data-name]").forEach(el => (el.textContent = `${S.name} ${S.nameAccent || ""}`.trim()));
  $$("[data-phone]").forEach(el => { el.textContent = S.phone; if (el.tagName === "A") el.href = tel; });
  $$("[data-address]").forEach(el => (el.innerHTML = `${esc(A.street)}<br>${esc(`${A.city}, ${A.region} ${A.zip}`)}`));
  $$("[data-directions]").forEach(el => { el.href = directions; el.target = "_blank"; el.rel = "noopener"; });
  $$("[data-order]").forEach(el => {
    if (!order) return void (el.hidden = true);
    el.href = order.url; el.target = "_blank"; el.rel = "noopener";
  });
  $$("img[data-photo]").forEach(img => {
    const p = P[img.dataset.photo]; if (!p) return;
    const w = +img.dataset.w || 800, h = +img.dataset.h || w;
    img.src = sized(p.src, w, h);
    if (/\{w\}/.test(p.src)) img.srcset = `${sized(p.src, w, h)} 1x, ${sized(p.src, w * 2, h * 2)} 2x`; // resizing CDN: ask for 2x too
    if (!img.hasAttribute("alt")) img.alt = p.alt || "";
  });
  $$("[data-map]").forEach(el => {
    el.innerHTML = `<iframe title="Map to ${esc(S.name)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
      src="https://maps.google.com/maps?q=${encodeURIComponent(addrLine)}&z=15&output=embed"></iframe>`;
  });
  $$("[data-year]").forEach(el => (el.textContent = new Date().getFullYear()));
  if (S.founded) {
    // Accepts "YYYY-MM-DD" or a bare year ("1992" counts from Jan 1)
    const f = new Date((/^\d{4}$/.test(S.founded) ? S.founded + "-01-01" : S.founded) + "T12:00:00"), now = new Date();
    let y = now.getFullYear() - f.getFullYear();
    if (now < new Date(now.getFullYear(), f.getMonth(), f.getDate())) y--;
    $$("[data-years]").forEach(el => (el.textContent = y));
  }

  /* ---------- Hours ---------- */
  const fmt = t => {
    let [h, m] = t.split(":").map(Number);
    const ap = h >= 12 && h < 24 ? "pm" : "am"; h = h % 12 || 12;
    return m ? `${h}:${String(m).padStart(2, "0")} ${ap}` : `${h} ${ap}`;
  };
  const mins = t => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const span = ([o, c]) => { const a = mins(o); let b = mins(c); if (b <= a) b += 1440; return [a, b]; }; // past-midnight safe
  // A day can also be a string label ("By appointment"): shown as-is, treated as closed for the badge
  const rangesText = r => typeof r === "string" ? r : r ? r.map(([o, c]) => `${fmt(o)} – ${fmt(c)}`).join(", ") : "Closed";
  const rng = k => Array.isArray(H[k]) ? H[k] : [];
  const bizNow = () => new Date(new Date().toLocaleString("en-US", { timeZone: S.timezone || "America/Los_Angeles" }));

  function status() {
    const now = bizNow(), d = now.getDay(), cur = now.getHours() * 60 + now.getMinutes();
    const today = rng(DAYS[d]), yest = rng(DAYS[(d + 6) % 7]);
    for (const r of yest) { const [a, b] = span(r); if (b > 1440 && cur < b - 1440) return { open: true, text: `Open now · until ${fmt(r[1])}` }; }
    for (const r of today) { const [a, b] = span(r); if (cur >= a && cur < b) return { open: true, text: `Open now · until ${fmt(r[1])}` }; }
    const later = today.find(r => span(r)[0] > cur);
    if (later) return { open: false, text: `Closed · opens today at ${fmt(later[0])}` };
    for (let i = 1; i <= 7; i++) {
      const k = DAYS[(d + i) % 7];
      if (rng(k).length) return { open: false, text: `Closed · opens ${i === 1 ? "tomorrow" : DAY_NAMES[k]} at ${fmt(H[k][0][0])}` };
    }
    return { open: false, text: "Closed" };
  }

  if (Object.keys(H).length) {
    const s = status(), todayKey = DAYS[bizNow().getDay()];
    $$("[data-status]").forEach(el => {
      el.classList.toggle("is-open", s.open);
      el.innerHTML = `<span class="dot" aria-hidden="true"></span>${s.text}`;
    });
    $$("[data-hours]").forEach(tbl => {
      tbl.innerHTML = "<tbody>" + WEEK.map(k => {
        const cls = [k === todayKey && "today", !rng(k).length && "closed"].filter(Boolean).join(" ");
        return `<tr class="${cls}"><td>${DAY_NAMES[k]}</td><td>${rangesText(H[k])}</td></tr>`;
      }).join("") + "</tbody>";
    });
    // Compact summary: group consecutive days with identical hours
    const groups = [];
    WEEK.forEach(k => {
      const key = JSON.stringify(H[k] || null), last = groups[groups.length - 1];
      if (last && last.key === key) last.days.push(k); else groups.push({ key, days: [k] });
    });
    const short = k => DAY_NAMES[k].slice(0, 3);
    $$("[data-hours-summary]").forEach(ul => {
      ul.innerHTML = groups.map(g => {
        const label = g.days.length > 1 ? `${short(g.days[0])}–${short(g.days.at(-1))}` : short(g.days[0]);
        return `<li>${label} ${rangesText(JSON.parse(g.key))}</li>`;
      }).join("");
    });
    $$("[data-day]").forEach(el => (el.hidden = el.dataset.day !== todayKey));
  }

  /* ---------- schema.org JSON-LD ---------- */
  if (S.name) {
    const ab = { mon: "Mo", tue: "Tu", wed: "We", thu: "Th", fri: "Fr", sat: "Sa", sun: "Su" };
    const ld = {
      "@context": "https://schema.org", "@type": S.schemaType || "LocalBusiness",
      name: fullName, telephone: S.phone || undefined, email: S.email || undefined,
      priceRange: S.priceRange || undefined, foundingDate: S.founded || undefined,
      address: { "@type": "PostalAddress", streetAddress: A.street, addressLocality: A.city, addressRegion: A.region, postalCode: A.zip, addressCountry: "US" },
      openingHours: WEEK.flatMap(k => rng(k).map(([o, c]) => `${ab[k]} ${o}-${c}`)),
      sameAs: (Array.isArray(S.social) ? S.social.map(s => s.url) : Object.values(S.social || {})).filter(Boolean), // array form holds {label,url}
      hasMenu: $("#menu") ? location.href.split("#")[0] : undefined,
    };
    const tag = document.createElement("script");
    tag.type = "application/ld+json"; tag.textContent = JSON.stringify(ld);
    document.head.appendChild(tag);
  }

  /* ---------- Mobile nav ---------- */
  const toggle = $(".menu-toggle"), nav = $(".nav");
  toggle?.addEventListener("click", () => toggle.setAttribute("aria-expanded", nav.classList.toggle("open")));
  // Same-page links (index.html#visit) don't reload, so close the mobile menu on any link tap
  nav?.addEventListener("click", e => {
    if (e.target.closest("a") && nav.classList.contains("open")) { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
  });
  // Dropdowns: hover/focus opens them on desktop (CSS); the chevron button toggles them for touch + mobile
  const closeSubs = except => $$(".nav-group.open").forEach(g => {
    if (g !== except) { g.classList.remove("open"); $(".sub-toggle", g).setAttribute("aria-expanded", "false"); }
  });
  $$(".sub-toggle").forEach(btn => btn.addEventListener("click", e => {
    e.stopPropagation();
    const g = btn.closest(".nav-group");
    closeSubs(g);
    btn.setAttribute("aria-expanded", g.classList.toggle("open"));
  }));
  document.addEventListener("click", e => { if (!e.target.closest(".nav-group")) closeSubs(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeSubs(); });
  // Open a dropdown leftward if it would run past the right edge of the viewport (desktop nav only)
  const fitSubs = () => $$(".nav-group").forEach(g => {
    g.classList.remove("sub-flip");
    if (getComputedStyle(toggle).display !== "none") return;
    if ($(".sub", g).getBoundingClientRect().right > document.documentElement.clientWidth - 8) g.classList.add("sub-flip");
  });
  if (toggle) { fitSubs(); addEventListener("resize", fitSubs); document.fonts?.ready.then(fitSubs); } // re-check once web fonts change widths

  /* ---------- Menu page ---------- */
  const menuRoot = $("#menu");
  if (menuRoot && window.MENU) {
    const groups = [...new Set(MENU.map(s => s.group || ""))];
    // item[3]: "detail.html" (href) or { href, img: PHOTOS key, cap: note for the enlarged photo }
    const opts = o => typeof o === "string" ? { href: o } : o || {};
    const thumb = (n, o) => {
      const ph = o.img && P[o.img]; if (!ph) return "";
      return `<button class="item-img" type="button" data-full="${esc(sized(ph.src, 1200, 900))}" data-cap="${esc(n + (o.cap ? " · " + o.cap : ""))}" aria-label="Photo: ${esc(n)}">
        <img src="${esc(sized(ph.src, 200, 200))}" alt="${esc(ph.alt || n)}" width="100" height="100" loading="lazy"></button>`;
    };

    menuRoot.innerHTML = groups.map(g => `
      <div class="menu-group">
        ${g ? `<h2>${esc(g)}</h2>` : ""}
        <div class="menu-sections">
          ${MENU.filter(s => (s.group || "") === g).map(s => `
            <section class="menu-section${s.feature ? " feature" : ""}" id="${s.id}" aria-labelledby="${s.id}-h"${s.featureLabel ? ` data-label="${esc(s.featureLabel)}"` : ""}>
              <h3 id="${s.id}-h">${esc(s.title)}</h3>
              ${s.blurb ? `<p class="blurb">${esc(s.blurb)}</p>` : ""}
              <ul>${s.items.map(([n, p, d, raw]) => { const o = opts(raw), href = o.href, img = thumb(n, o); return `
                <li data-search="${esc((n + " " + (d || "") + " " + s.title).toLowerCase())}"${href || img ? ` class="${[href && "has-link", img && "has-img"].filter(Boolean).join(" ")}"` : ""}>
                  <div class="item-text">
                    <div class="item-line">${href ? `<a class="item-link" href="${href}">` : ""}<span class="item-name">${esc(n)}</span>${href ? `<span class="item-arrow" aria-hidden="true">→</span></a>` : ""}${p != null ? `<span class="item-dots"></span><span class="item-price">${money(p)}</span>` : ""}</div>
                    ${d ? `<div class="item-desc">${esc(d)}</div>` : ""}
                  </div>${img}
                </li>`; }).join("")}
              </ul>
              ${s.note ? `<p class="note">${esc(s.note)}</p>` : ""}
            </section>`).join("")}
        </div>
      </div>`).join("") + `<p class="no-results" hidden>Nothing matches that. Try a shorter word.</p>`;

    const chips = $(".chips");
    if (chips) {
      chips.innerHTML = MENU.map(s => `<a class="chip" href="#${s.id}">${esc(s.chip || s.title)}</a>`).join("");
      const spy = new IntersectionObserver(entries => entries.forEach(e => {
        if (!e.isIntersecting) return;
        $$(".chip", chips).forEach(c => c.classList.toggle("active", c.getAttribute("href") === "#" + e.target.id));
        $(`.chip[href="#${e.target.id}"]`, chips)?.scrollIntoView({ block: "nearest", inline: "nearest" });
      }), { rootMargin: "-160px 0px -65% 0px" });
      $$(".menu-section", menuRoot).forEach(s => spy.observe(s));
    }

    // Search matches at word starts only, so "pie" doesn't hit "pieces"
    const input = $("#menu-search");
    input?.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      const re = new RegExp("(^|[^a-z0-9])" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
      let any = false;
      $$(".menu-section", menuRoot).forEach(sec => {
        let hits = 0;
        $$("li", sec).forEach(li => {
          const name = $(".item-name", li), t = name.textContent;
          const match = !q || re.test(li.dataset.search);
          li.hidden = !match;
          if (match) hits++;
          const i = q ? t.toLowerCase().search(re) : -1;
          const at = i > -1 ? i + (t.toLowerCase()[i] === q[0] ? 0 : 1) : -1;
          name.innerHTML = match && at > -1
            ? esc(t.slice(0, at)) + "<mark>" + esc(t.slice(at, at + q.length)) + "</mark>" + esc(t.slice(at + q.length))
            : esc(t);
        });
        sec.hidden = hits === 0;
        const note = $(".note", sec); if (note) note.hidden = !!q;
        any ||= hits > 0;
      });
      $$(".menu-group", menuRoot).forEach(g => (g.hidden = !$$(".menu-section:not([hidden])", g).length));
      $(".no-results", menuRoot).hidden = any;
    });
  }

  /* ---------- Product cards (merch / retail) ----------
     <div data-products="MERCH"> renders window.MERCH: [{ name, sub, price, img, url, fit, bg, group, feature }].
     fit: "contain" letterboxes wide shots instead of cropping; bg = the tile color behind them (match the photo's backdrop).
     data-group="Tees" keeps one group; data-feature keeps items flagged feature: true; data-w = image width to request. */
  $$("[data-products]").forEach(root => {
    let list = window[root.dataset.products] || [];
    if (root.dataset.group) list = list.filter(p => p.group === root.dataset.group);
    if ("feature" in root.dataset) list = list.filter(p => p.feature);
    const w = +root.dataset.w || 700;
    root.innerHTML = list.map(p => `
      <a class="product${p.fit === "contain" ? " is-contain" : ""}" href="${esc(p.url)}"${EXT}>
        <span class="product-img"${p.bg ? ` style="background:${esc(p.bg)}"` : ""}><img src="${esc(sized(p.img, w, w))}" alt="${esc(p.name + (p.sub ? `, ${p.sub}` : ""))}" loading="lazy"></span>
        <span class="product-meta">
          <span class="product-name">${esc(p.name)}</span>
          <span class="product-price">${money(p.price).replace(/\.00$/, "")}</span>
          ${p.sub ? `<span class="product-sub">${esc(p.sub)}</span>` : ""}
        </span>
      </a>`).join("");
  });

  /* ---------- Showcase carousel (hero art) ----------
     <div data-showcase data-interval="4200"> with .slide children (img or .ph-img), one marked .is-on.
     Each slide: data-dish="Menu item name" pulls name/price/link from MENU, or data-label / data-price / data-href set them.
     Optional inside: .showcase-tag (> .showcase-name + .showcase-price) and an empty .showcase-dots.
     Auto-advances; pauses on mouse hover, keyboard focus and hidden tabs; dots, arrow keys and swipe navigate. */
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  $$("[data-showcase]").forEach(root => {
    const slides = $$(".slide", root);
    if (slides.length < 2) return;
    const tag = $(".showcase-tag", root), dotsEl = $(".showcase-dots", root);
    const tagHref = tag?.getAttribute("href") || "#"; // fallback for slides with no link of their own
    const lookup = name => {
      for (const s of window.MENU || []) {
        const it = s.items.find(i => i[0] === name);
        if (it) return { price: it[1], href: `menu.html#${s.id}` };
      }
      return {};
    };
    const info = slides.map(el => {
      const d = el.dataset, m = d.dish ? lookup(d.dish) : {};
      return { name: d.label || d.dish || "", price: d.price ?? m.price, href: d.href || m.href };
    });
    const priceText = p => p == null || p === "" ? "" : isNaN(p) ? String(p) : money(Number(p)).replace(/\.00$/, "");
    if (dotsEl) dotsEl.innerHTML = info.map((d, i) => `<button type="button" aria-label="Show ${esc(d.name || `slide ${i + 1}`)}" aria-pressed="${!i}"></button>`).join("");
    const dots = dotsEl ? [...dotsEl.children] : [];
    let idx = Math.max(0, slides.findIndex(s => s.classList.contains("is-on"))), timer = null;
    const show = (i, first) => {
      idx = (i + slides.length) % slides.length;
      slides.forEach((s, k) => { s.classList.toggle("is-on", k === idx); s.setAttribute("aria-hidden", k !== idx); });
      dots.forEach((b, k) => b.setAttribute("aria-pressed", k === idx));
      if (!tag) return;
      const d = info[idx];
      if (!first) { tag.classList.remove("swap"); void tag.offsetWidth; tag.classList.add("swap"); } // restart the fade (not on load: keeps any entrance animation)
      const n = $(".showcase-name", tag), p = $(".showcase-price", tag);
      if (n) n.textContent = d.name;
      if (p) p.textContent = priceText(d.price);
      if (tag.tagName === "A") tag.setAttribute("href", d.href || tagHref);
    };
    const play = () => { if (!reduceMotion && !timer) timer = setInterval(() => show(idx + 1), +root.dataset.interval || 4200); };
    const stop = () => { clearInterval(timer); timer = null; };
    const restart = () => { stop(); play(); };
    dots.forEach((b, i) => b.addEventListener("click", () => { show(i); restart(); }));
    dotsEl?.addEventListener("keydown", e => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      show(idx + (e.key === "ArrowRight" ? 1 : -1)); dots[idx]?.focus();
    });
    root.addEventListener("pointerenter", e => { if (e.pointerType === "mouse") stop(); });
    root.addEventListener("pointerleave", play);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", play);
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : play()));
    // Swipe on the slides' frame (touch / pen)
    const frame = slides[0].parentElement;
    let x0 = null;
    frame.style.touchAction = "pan-y";
    frame.addEventListener("pointerdown", e => { if (e.pointerType !== "mouse") x0 = e.clientX; });
    frame.addEventListener("pointerup", e => {
      if (x0 === null) return;
      const dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) { show(idx + (dx < 0 ? 1 : -1)); restart(); }
    });
    show(idx, true);
    setTimeout(play, +root.dataset.delay || 2400); // let a hero entrance finish first
  });

  /* ---------- Pointer parallax ----------
     [data-parallax] (usually the hero) sets --px / --py from -1 to 1; any .depth inside drifts by its --d (e.g. style="--d: 20px",
     negative = opposite direction). Mouse/trackpad only; off for reduced motion. */
  if (!reduceMotion && matchMedia("(pointer: fine)").matches) {
    $$("[data-parallax]").forEach(el => {
      let raf = 0;
      el.addEventListener("pointermove", e => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const r = el.getBoundingClientRect();
          el.style.setProperty("--px", ((e.clientX - r.left) / r.width * 2 - 1).toFixed(3));
          el.style.setProperty("--py", ((e.clientY - r.top) / r.height * 2 - 1).toFixed(3));
        });
      });
      el.addEventListener("pointerleave", () => { el.style.setProperty("--px", 0); el.style.setProperty("--py", 0); });
    });
  }

  /* ---------- Gallery + lightbox ---------- */
  // [data-gallery] renders window.GALLERY, or the array named by its value: <div data-gallery="PORTFOLIO">
  $$("[data-gallery]").forEach(root => {
    const list = window[root.dataset.gallery || "GALLERY"] || [];
    root.innerHTML = list.map((g, i) => g.src
      ? `<figure data-tag="${esc(g.tag || "")}"><button aria-label="Enlarge: ${esc(g.caption || g.alt)}"><img src="${esc(g.src)}" alt="${esc(g.alt)}"${g.w ? ` width="${g.w}" height="${g.h}"` : ""}${i > 2 ? ' loading="lazy"' : ""}></button>
           <figcaption>${g.tag ? `<small>${esc(g.tag)}</small>` : ""}${esc(g.caption || "")}</figcaption></figure>`
      : `<figure class="is-ph" data-tag="${esc(g.tag || "")}"><div class="ph-img">${esc(g.alt)}</div>
           <figcaption>${g.tag ? `<small>${esc(g.tag)}</small>` : ""}${esc(g.caption || "")}</figcaption></figure>`
    ).join("");
  });
  // Optional tag filter: <div class="chips" data-gallery-filters></div> → "All" + one chip per tag
  const fbar = $("[data-gallery-filters]");
  if (fbar) {
    const figs = $$(".gallery figure");
    const tags = [...new Set(figs.map(f => f.dataset.tag).filter(Boolean))];
    fbar.innerHTML = ["All", ...tags].map((t, i) => `<button class="chip${i ? "" : " active"}" aria-pressed="${!i}" data-tag="${esc(i ? t : "")}">${esc(t)}</button>`).join("");
    fbar.addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      $$("button", fbar).forEach(x => { x.classList.toggle("active", x === b); x.setAttribute("aria-pressed", x === b); });
      figs.forEach(f => (f.hidden = !!b.dataset.tag && f.dataset.tag !== b.dataset.tag));
    });
  }
  // Lightbox entries are { src, alt, cap }: gallery figures and menu photo buttons both open it
  const lb = $(".lightbox");
  if (lb) {
    const img = $("img", lb), cap = $("figcaption", lb);
    let items = [], idx = 0, lastFocus;
    const fromFigure = f => {
      const i = $("img", f), fc = $("figcaption", f);
      return { src: i.src, alt: i.alt, cap: fc ? [...fc.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join("").trim() : "" };
    };
    const fromButton = b => ({ src: b.dataset.full, alt: $("img", b).alt, cap: b.dataset.cap || "" });
    const show = i => {
      idx = (i + items.length) % items.length;
      img.src = items[idx].src; img.alt = items[idx].alt; cap.textContent = items[idx].cap;
    };
    const open = (list, i) => {
      items = list; lastFocus = document.activeElement; show(i);
      lb.classList.toggle("single", list.length < 2);
      lb.classList.add("open"); document.body.style.overflow = "hidden"; $(".lb-close", lb).focus();
    };
    const close = () => { lb.classList.remove("open"); document.body.style.overflow = ""; lastFocus?.focus(); };
    // Arrows cycle only what's currently visible (respects the gallery tag filter and menu search)
    $$(".gallery figure:not(.is-ph)").forEach(f => $("button", f).addEventListener("click", () => {
      const figs = $$(".gallery figure:not(.is-ph):not([hidden])");
      open(figs.map(fromFigure), figs.indexOf(f));
    }));
    $$(".item-img").forEach(b => b.addEventListener("click", () => {
      const btns = $$(".item-img").filter(x => !x.closest("[hidden]"));
      open(btns.map(fromButton), btns.indexOf(b));
    }));
    $(".lb-close", lb).addEventListener("click", close);
    $(".lb-prev", lb).addEventListener("click", () => show(idx - 1));
    $(".lb-next", lb).addEventListener("click", () => show(idx + 1));
    lb.addEventListener("click", e => { if (e.target === lb) close(); });
    document.addEventListener("keydown", e => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  /* ---------- Phone numbers never split across lines ----------
     Wraps every "707-200-8865" / "(555) 555-0100" in rendered text with <span class="num"> (white-space: nowrap).
     Labels around a number ("Call or text …") can still wrap; the number itself stays whole. */
  const PHONE = /(?:\(\d{3}\)\s?|\b\d{3}[-.\s])\d{3}[-.]\d{4}\b/;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: n => PHONE.test(n.nodeValue) && !n.parentElement.closest("script, style, textarea, .num")
      ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT,
  });
  const phoneNodes = [];
  while (walker.nextNode()) phoneNodes.push(walker.currentNode);
  phoneNodes.forEach(node => {
    const frag = document.createDocumentFragment();
    node.nodeValue.split(new RegExp(`(${PHONE.source})`)).forEach((part, i) => {
      if (!part) return;
      if (i % 2) { const s = document.createElement("span"); s.className = "num"; s.textContent = part; frag.appendChild(s); }
      else frag.appendChild(document.createTextNode(part));
    });
    node.replaceWith(frag);
  });

  /* ---------- Scroll reveal (runs last so rendered content is included) ---------- */
  const io = "IntersectionObserver" in window && new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -8% 0px" });
  $$(".reveal").forEach(el => (io ? io.observe(el) : el.classList.add("in")));
})();
