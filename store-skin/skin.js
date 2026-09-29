/* THE PAINTED LADY: masthead + footer for the Weebly store (shop.thepaintedladynapavalley.com).
   Served from this site and loaded by one <script> tag in Weebly → Settings → SEO → Footer Code
   (see _weebly/README.md), so it runs at the end of <body>. Edit here + push; the store picks it up.
   - swaps Weebly's header/menu/footer for the main site's chrome, every link pointing back to www;
   - keeps Weebly's own Cart link (moved into the masthead, so its count + mini cart still work);
   - old info pages left on the store domain forward to their new home on www;
   - prices: every deal shows its regular price; only the VIP Pass (tagged here for skin.css) shows its sale. */
(function () {
  if (window.__tplSkin) return; window.__tplSkin = true;
  var WWW = "https://www.thepaintedladynapavalley.com/";
  var BOOK = "https://thepaintedladynapavalley.glossgenius.com/";
  var TEL = "tel:+17072515633", PHONE = "707.251.5633";
  var SALE = /vip[\s_-]*pass/i; // deals that keep their struck-through regular price (SITE.shopShowSale on the main site)
  var SKIP = /\breiki\b/i;      // discontinued: hidden from the grid (EXCLUDE in _build/sync_shop.py)
  var path = location.pathname;

  /* Old Weebly info pages still live on this domain: send visitors to the new site (same map as the main site's redirect stubs) */
  if (path === "/" || path === "/index.html") { location.replace("/store/c1/Featured_Products.html"); return; } // the old Weebly home: the store's front door is its product list
  var MOVED = {
    "/uv.html": "tanning.html#beds", "/soltron-wildcat.html": "tanning.html#beds", "/ergoline-essence-48.html": "tanning.html#beds",
    "/dr-muller-elixir.html": "tanning.html#beds", "/solarix-2.html": "tanning.html#beds", "/matrix.html": "tanning.html#beds",
    "/spray.html": "tanning.html#airbrush", "/airbrush-spray-tan.html": "tanning.html#airbrush", "/mystic-spray-tan.html": "tanning.html#mystic",
    "/frequently-asked-questions.html": "guide.html#faq", "/dha.html": "guide.html#dha",
    "/red-light.html": "wellness.html#red-light", "/the-beauty-angel.html": "wellness.html#red-light", "/sauna.html": "wellness.html#sauna",
    "/skin-care-by-court.html": "wellness.html#skin", "/massage.html": "wellness.html#massage",
    "/safe-haven-massage-with-logan.html": "wellness.html#massage", "/goddess-healing-hands.html": "wellness.html#massage",
    "/prices.html": "menu.html", "/contact.html": "visit.html", "/bios.html": "team.html", "/bios1.html": "team.html",
    "/alli.html": "team.html#alli", "/alec.html": "team.html#alec", "/sharon.html": "team.html#sharon",
    "/courtney.html": "team.html#courtney", "/logan.html": "team.html#logan", "/toni.html": "team.html#toni"
  };
  if (Object.prototype.hasOwnProperty.call(MOVED, path)) { location.replace(WWW + MOVED[path]); return; }

  var NAV = [["The Tan", "tanning.html"], ["Wellness", "wellness.html"], ["Price List", "menu.html"], ["Shop", "shop.html"],
             ["The Cast", "team.html"], ["Glow Guide", "guide.html"], ["Visit", "visit.html"]];
  var half = 5; // 5 left, 2 right: the right side also carries Cart + Book now
  var link = function (n) { return '<a href="' + WWW + n[1] + '"' + (n[1] === "shop.html" ? ' aria-current="page"' : "") + ">" + n[0] + "</a>"; };
  var EXT = ' target="_blank" rel="noopener"';

  var top = document.createElement("div");
  top.className = "tpl-top";
  top.innerHTML =
    '<a class="tpl-skip" href="#wrapper">Skip to content</a>' +
    '<div class="tpl-announce"><div class="tpl-wrap">' +
      '<span>1643 Jefferson St · Napa</span>' +
      '<span class="tpl-announce-mid">Deals &amp; gift certificates · Secure checkout</span>' +
      '<a href="' + TEL + '">' + PHONE + "</a>" +
    "</div></div>" +
    '<header class="tpl-mast"><div class="tpl-wrap tpl-mast-row">' +
      '<div class="tpl-mast-l">' +
        '<button class="tpl-menu-btn" type="button" aria-label="Menu" aria-expanded="false" aria-controls="tpl-overlay"><span class="tpl-burger" aria-hidden="true"><i></i><i></i></span><span class="tpl-menu-label">Menu</span></button>' +
        '<nav class="tpl-nav" aria-label="Main">' + NAV.slice(0, half).map(link).join("") + "</nav>" +
      "</div>" +
      '<a class="tpl-wordmark" href="' + WWW + '" aria-label="The Painted Lady, home"><span class="tpl-wm-main">The Painted Lady</span><span class="tpl-wm-sub">Tanning &amp; Spa · Napa Valley</span></a>' +
      '<div class="tpl-mast-r">' +
        '<nav class="tpl-nav" aria-label="More">' + NAV.slice(half).map(link).join("") + "</nav>" +
        '<ul class="tpl-cart"></ul>' +
        '<a class="tpl-btn" href="' + BOOK + '"' + EXT + ">Book now</a>" +
      "</div>" +
    "</div></header>" +
    '<div class="tpl-band"><div class="tpl-wrap"><p>The Shop · Deals &amp; gift certificates</p><a href="' + WWW + 'shop.html">← All deals on the main site</a></div></div>' +
    '<div class="tpl-overlay" id="tpl-overlay" role="dialog" aria-modal="true" aria-label="Menu" hidden>' +
      '<div class="tpl-overlay-top"><a class="tpl-wordmark" href="' + WWW + '"><span class="tpl-wm-main">The Painted Lady</span></a>' +
        '<button class="tpl-overlay-close" type="button">Close ✕</button></div>' +
      "<ol>" + [["Home", ""]].concat(NAV).map(function (n, i) { return '<li><a href="' + WWW + n[1] + '"><small>' + ("0" + i).slice(-2) + "</small>" + n[0] + "</a></li>"; }).join("") + "</ol>" +
      '<a class="tpl-btn" href="' + BOOK + '"' + EXT + ">Book now</a>" +
    "</div>";
  document.body.insertBefore(top, document.body.firstChild);

  /* Weebly's Cart link: moved (not copied) so its live count and mini cart keep working */
  var cart = document.querySelector("#navigation .wsite-nav-cart, .wsite-nav-cart");
  if (cart) top.querySelector(".tpl-cart").appendChild(cart);

  /* Phone menu */
  var btn = top.querySelector(".tpl-menu-btn"), ov = top.querySelector(".tpl-overlay");
  var setMenu = function (open) {
    ov.hidden = !open; btn.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("tpl-locked", open);
    (open ? ov.querySelector(".tpl-overlay-close") : btn).focus();
  };
  btn.addEventListener("click", function () { setMenu(true); });
  ov.querySelector(".tpl-overlay-close").addEventListener("click", function () { setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !ov.hidden) setMenu(false); });

  /* Footer */
  var foot = document.createElement("footer");
  foot.className = "tpl-foot";
  foot.innerHTML =
    '<div class="tpl-awning" aria-hidden="true"></div><div class="tpl-wrap">' +
    '<p class="tpl-foot-mark" aria-hidden="true">The Painted Lady</p>' +
    '<div class="tpl-foot-grid">' +
      "<div><h4>The Shop</h4><p>Deals, packages and gift certificates for Napa's pink palace of tanning. Checkout is secure; your deal is ready to use at the salon.</p>" +
        '<p><a href="' + WWW + 'shop.html">Browse every deal →</a></p></div>' +
      '<div><h4>Visit</h4><p>1643 Jefferson Street<br>Napa, CA 94559<br>Corner of Jefferson &amp; C</p><p><a href="' + TEL + '">' + PHONE + "</a></p></div>" +
      "<div><h4>Hours</h4><p>Mon–Sat 9 am – 8 pm<br>Sunday 11 am – 5 pm</p></div>" +
      "<div><h4>Explore</h4><ul>" + [["Home", ""]].concat(NAV).map(function (n) { return '<li><a href="' + WWW + n[1] + '">' + n[0] + "</a></li>"; }).join("") + "</ul></div>" +
    "</div>" +
    '<div class="tpl-foot-base"><span>© ' + new Date().getFullYear() + " The Painted Lady Tanning &amp; Spa · Napa, California</span>" +
      '<span><a href="https://www.instagram.com/thepaintedladytanningandspa/"' + EXT + '>Instagram</a> · <a href="https://www.facebook.com/ThePaintedLadySalon/"' + EXT + ">Facebook</a></span></div>" +
    "</div>";
  var wrap = document.querySelector(".body-wrap") || document.body;
  wrap.appendChild(foot);

  /* VIP Pass keeps its sale price; discontinued services (Reiki) drop out of the grid, as on the main site */
  document.querySelectorAll(".wsite-com-category-product-wrap, .product-grid__item").forEach(function (card) {
    var name = (card.querySelector(".wsite-com-category-product-name, .product-grid__title") || card).textContent;
    if (SALE.test(name)) card.classList.add("tpl-sale");
    if (SKIP.test(name)) (card.closest(".wsite-com-column") || card).style.display = "none";
    /* Product blocks print "<struck regular> sale" as bare text, so CSS can't pick the regular price: keep only it */
    var reg = !SALE.test(name) && card.querySelector(".product-grid__price .product-grid__sale");
    if (reg) reg.parentNode.textContent = reg.textContent.trim();
  });
  /* Product blocks on ordinary pages sit in a masonry grid Weebly measures once; re-measure after our fonts arrive */
  if (document.querySelector(".product-grid") && document.fonts) document.fonts.ready.then(function () { window.dispatchEvent(new Event("resize")); });
  var title = document.querySelector("#wsite-com-product-info .product-title");
  if (title && SALE.test(title.textContent)) document.documentElement.classList.add("tpl-sale-page");

  document.documentElement.classList.add("tpl-on"); // only now hide Weebly's own chrome (if this script fails, the store still has a menu)
})();
