/* ============================================================
   SITE DATA: the only file that holds business facts.
   Masthead, footer, mobile bar, hours, open-now badge, map,
   JSON-LD, price list and team portraits all render from here.

   Sources (all captured 2026-09-25):
   · thepaintedladynapavalley.com: all 30 pages in sitemap.xml, incl. hidden
     bios.html + summerween.html, and the 38 /store/ product pages
   · Bio pages alli/alec/sharon/courtney/logan/toni.html: the text is baked into
     PNG images; it was transcribed by eye from the images
   · thepaintedladynapavalley.glossgenius.com (their booking site): services,
     packages, team, hours, cancellation policy, 1 client review
   · skincarebycourt.com (Courtney's booking site, linked from their nav)
   Never invent facts. Unknown → "" / null and a visible placeholder.
   ============================================================ */

const BOOK = "https://thepaintedladynapavalley.glossgenius.com/";

window.SITE = {
  name: "The Painted Lady",
  nameAccent: "",
  tagline: "Tanning & Spa · Napa Valley",
  phone: "707.251.5633",
  email: "alliparx@gmail.com",                 // mailto on their homepage
  order: { label: "Book now", url: BOOK },      // GlossGenius: header button + mobile bar
  address: { street: "1643 Jefferson Street", city: "Napa", region: "CA", zip: "94559" },
  cross: "Corner of Jefferson & C",              // contact.html: "(the corner of Jefferson & C)"
  timezone: "America/Los_Angeles",
  founded: "2011",                               // "Spring of 2011", Saint Helena (Alli's bio)
  schemaType: "TanningSalon",
  priceRange: "$$",
  social: {
    instagram: "https://www.instagram.com/thepaintedladytanningandspa/",
    facebook: "https://www.facebook.com/ThePaintedLadySalon/",
  },
  nav: [
    { label: "The Tan", href: "tanning.html" },
    { label: "Wellness", href: "wellness.html" },
    { label: "Price List", href: "menu.html" },
    { label: "The Cast", href: "team.html" },
    { label: "Glow Guide", href: "guide.html" },
    { label: "Visit", href: "visit.html" },
  ],
  // Mobile spray tans: homepage lists all five; airbrush page omits Yountville
  areas: ["Napa", "Sonoma", "Saint Helena", "Yountville", "Calistoga", "and beyond"],
  footerBlurb: "The Napa Valley's most charming, lavish, dripping-in-champagne-and-diamonds tanning spa.",
  footerNote: "Prices may change. Call to confirm.",
};

/* Hours: contact.html and GlossGenius agree. */
window.HOURS = {
  mon: [["09:00", "20:00"]],
  tue: [["09:00", "20:00"]],
  wed: [["09:00", "20:00"]],
  thu: [["09:00", "20:00"]],
  fri: [["09:00", "20:00"]],
  sat: [["09:00", "20:00"]],
  sun: [["11:00", "17:00"]],
};

/* Photos (hotlinked from the client's own hosts; see handoff). */
const UP = "https://www.thepaintedladynapavalley.com/uploads/2/3/3/9/23398226/";
window.PHOTOS = {
  // Local copies (2026-09-28, with the user's OK), resized to 2x their largest display width:
  team:       { src: "img/photos/team.jpg",   // 1400×875 · from their GlossGenius cover image (1728×1080, 2.35 MB)
                alt: "The Painted Lady team laughing together outside the pink storefront at 1643 Jefferson Street" },
  team14:     { src: "img/photos/team-14.jpg", // 1400×933 · from their homepage, background-images/291416006.jpg (2000×1333, 872 KB)
                alt: "The Painted Lady team outside the salon holding gold balloons shaped like the number 14" },
  storefront: { src: "img/photos/storefront.jpg", // 989×503 · from contact.html, 1422742983.png (PNG → JPEG, 1.1 MB → 174 KB)
                alt: "The pink cottage at 1643 Jefferson Street with black-and-white striped awnings and a crepe myrtle in bloom" },
  // Still hotlinked from the old Weebly site:
  soltron:    { src: UP + "img-7973_orig.jpg", alt: "The Soltron Wildcat tanning bed, lit blue" },          // 800×1067
  essence:    { src: UP + "8497607_orig.jpg", alt: "The red Ergoline Essence 48 stand-up tanning booth" }, // 604×800
  elixir:     { src: UP + "9227117.jpg", alt: "The Dr. Müller Elixir tanning bed, lid open" },           // 547×371
  solarix:    { src: UP + "solarix_orig.jpg", alt: "The Solarix X2 high-pressure tanning bed" },          // 494×398
  matrix:     { src: UP + "matrix-2_orig.jpg", alt: "The Matrix high-pressure tanning bed glowing violet" }, // 1100×721
  beautyAngel:{ src: UP + "9972794_orig.jpg", alt: "The Beauty Angel red light therapy booth" },          // 538×800
  sauna:      { src: UP + "published/sauna.jpg", alt: "The cedar infrared sauna cabin" },                 // 441×410
};

/* Team portraits. On the old site each bio page is one image (text + portrait). The portrait
   was cropped out of it into img/cast/*.jpg (2026-09-25, with the user's OK); the original
   image and pixel box are noted per person. tpl.js still re-crops to each frame's shape
   (box = the region to show; here the whole JPG). Titles, bios and "inspired by" lines
   are transcribed from those images. */
const CAST_IMG = "img/cast/";
window.CAST = [
  {
    id: "alli", name: "Alli Parks", role: "Proprietress", color: "#abc3c2",
    src: CAST_IMG + "alli.jpg", nat: [636, 860], box: [0, 0, 636, 860],         // from 448506749.png @ 1068,174–1704,1034
    inspired: "",
    look: "Cover girl, April 1956",
    bio: [
      "In the spring of 2011, with only a hammer and a dream, Alli Parks transformed an itty-bitty 216-square-foot office suite into The Painted Lady.",
      "Located in Saint Helena, the first Painted Lady contained only a desk, a Mystic Tan booth, and a couple of free restaurant benches that she found on the side of the road. Miss Parks used to lock herself in the Mystic Tan booth and sob due to lack of clients, money, or hope of any kind. Miss Parks often reflects on these hideous times while wistfully gazing out the window of The Painted Lady’s G6. But then the flight attendant arrives with a frosty glass of Dom Pérignon and an exquisite cheese plate, causing Miss Parks to quickly forget about her struggles of yesteryear.",
      "These days Miss Parks’ business thrives at its expansive, shimmering pink palace at 1643 Jefferson Street. When she’s not painting the town bronze, Miss Parks enjoys champagne, lounging, remodeling her luxurious penthouse and instagramming her cat/soulmate, Francine.",
    ],
    tags: ["Founder", "Since 2011"],
  },
  {
    id: "alec", name: "Alec Zerba", role: "Glow Guru", color: "#4d190f",
    src: CAST_IMG + "alec.jpg", nat: [518, 414], box: [0, 0, 518, 414],         // from 1183739284.png @ 688,158–1206,572
    inspired: "Tudor history and Queen Elizabeth I",
    bio: [
      "Since the summer of 2018, I’ve been in and out like a fabulous tanning trend—always leaving my mark of glow! Your go-to tanning expert and licensed cosmetologist, here to turn your skin into a sun-kissed masterpiece! With a flair for all things glow, I’ll have you radiating confidence and catching compliments like it’s a full-time job.",
      "My secret? A dash of expertise, a sprinkle of fun, and only the best products to ensure you look fabulous—because who says tanning can’t be a little cheeky? When I’m not bronzing up my clients, you’ll find me getting lost in a good book.",
    ],
    tags: ["Tanning", "Licensed cosmetologist", "Since 2018"],
  },
  {
    id: "sharon", name: "Sharon Bailey", role: "Tanning Czar", color: "#3d595d",
    src: CAST_IMG + "sharon.jpg", nat: [562, 748], box: [0, 0, 562, 748],       // from 1994404210.png @ 1102,150–1664,898
    inspired: "’60s beach culture with a dash of mountain vibes",
    bio: [
      "As a Napa Native (Napkin), I love being a part of this community and working with the caring team here at the Painted Lady. As an established member of Team Tan I enjoy spray tanning like painting: each client is a beautiful canvas.",
      "As a Reiki Practitioner/Energy Worker here at The Painted Lady I enjoy bringing peace and healing to those who need it.", // from the older bios.html + Reiki listing ("book with Sharon Bailey")
      "I love music, being outdoors and being in the pool swimming laps.",
    ],
    tags: ["Spray tanning", "Reiki"],
  },
  {
    id: "courtney", name: "Courtney Rowe", role: "Radiance Representative", color: "#a3624e",
    src: CAST_IMG + "courtney.jpg", nat: [502, 756], box: [0, 0, 502, 756],     // from 639326930.png @ 1134,162–1636,918
    inspired: "the ’70s Flower Power feminist movement",
    bio: [
      "Skincare, tan skin and makeup; these are a few of her favorite things! Courtney started at The Painted Lady after getting her Esthetician license in August 2019. She went to beauty school at Lytle’s Beauty College in Santa Rosa, so ask her skin questions (she loves it!). She is the waxing and shaping queen, a true brow wiz!",
      "When she’s not turning the town of Napa into a bronze haze, she spends her time at concerts, traveling the world, and downing a few (or more) glasses with her besties at a winery!",
    ],
    tags: ["Esthetician", "Skin Care by Court", "Since 2019"],
    link: { label: "Skin Care by Court", url: "https://www.skincarebycourt.com/" },
  },
  {
    id: "logan", name: "Logan Stockton", role: "Relaxation Specialist", color: "#5b5c5f",
    src: CAST_IMG + "logan.jpg", nat: [606, 742], box: [0, 0, 606, 742],        // from 861108627.png @ 1154,146–1760,888
    inspired: "early Americana farmers",
    bio: [
      "I am a licensed and certified massage therapist dedicated to helping clients achieve relaxation, pain relief, and rejuvenation. Trained in Swedish, deep tissue, sports massage, and trigger point therapy, I create personalized treatments tailored to each client’s unique needs and goals.",
      "My passion for therapeutic touch and commitment to ongoing education allow me to provide thoughtful, effective care for everyone from athletes to those simply seeking stress relief.",
    ],
    tags: ["Massage", "Licensed since 2021"],
  },
  {
    id: "toni", name: "Toni Frazier", role: "Master of Massagecraft", color: "#000000",
    src: CAST_IMG + "toni.jpg", nat: [576, 708], box: [0, 0, 576, 708],         // from 1717583731.png @ 1024,178–1600,886
    inspired: "a deep interest in Egyptian history",
    bio: [
      "Healing is serious business—but that doesn’t mean it can’t feel good. At Goddess Healing Hands, I bring caring hands, good energy, and a whole lot of heart to every session.",
      "From customized massage and Reiki to compassionate post-op care, my goal is simple: help you hurt less, stress less, and leave feeling a little more like yourself again. Mind, body, spirit—let’s get the whole crew back in alignment.",
      "When I am not working I enjoy listening to music and dancing or spend time with my family bowling.",
    ],
    tags: ["Massage", "Reiki", "Post-op care"],
  },
];

/* Price list. Rendered by menu.html; other pages read single prices via [data-price="section:Item"].
   Source: prices.html (+ spray/uv/red-light pages), GlossGenius services & packages.
   Items: [name, price, description?, extra?]  price: number | "200+" | null */
window.MENU = [
  {
    id: "airbrush", title: "Lavish Airbrush Tan", group: "Spray tans", chip: "Airbrush",
    blurb: "Hand-applied, organic and paraben-free. Lasts 7–12 days.",
    items: [
      ["Lavish Airbrush Tan", 60, "Shower after 5–7 hours"],
      ["Lavish Airbrush Tan Express", 80, "Shower after 2–4 hours"],
      ["Airbrush + Finishing Powder", 70, "No sticky feeling, just a light shimmer"],
      ["Express + Finishing Powder", 90],
      ["Lavish Legs Only", 40],
      ["Lavish Legs Express", 60],
      ["Five Lavish Tans", 210],
      ["Ten Lavish Tans", 310],
      ["Five Lavish Express Tans", 310],
      ["Ten Lavish Express Tans", 510],
      ["Test patch", null, "Complimentary · 5 minutes"],
    ],
    note: "Free spray tan extending lotion or spray with the purchase of 10 sessions.",
  },
  {
    id: "on-location", title: "On Location", group: "Spray tans", chip: "On location",
    blurb: "The Painted Lady comes right to you: Napa, Sonoma, Saint Helena, Yountville, Calistoga and beyond.",
    items: [
      ["Lavish on Location", 200],
      ["Lavish Express on Location", 250],
    ],
  },
  {
    id: "mystic", title: "Mystic Tan", group: "Spray tans", chip: "Mystic",
    blurb: "A private booth and an even, cocoa-bronze tan in under five minutes. No appointment needed.",
    items: [
      ["One Session", 40],
      ["Five Sessions", 140],
      ["Ten Sessions", 240],
      ["Twenty Sessions", 410],
      ["Unlimited Monthly", 90],
    ],
    note: "Free spray tan extending lotion or spray with the purchase of 10 sessions.",
  },
  {
    id: "uv", title: "UV Tanning", group: "UV tanning", chip: "UV",
    blurb: "The Soltron Wildcat, Dr. Müller Elixir and Ergoline Essence 48. Walk in only.",
    items: [
      ["One Session", 33],
      ["Five Sessions", 66],
      ["Ten Sessions", 110],
      ["One Month Unlimited", 99],
      ["Two Months Unlimited", 165],
      ["Three Months Unlimited", 209],
      ["Four Months Unlimited", 231, "Any bottle of tanning lotion free"],
    ],
    note: "Federal indoor tanning tax included.",
  },
  {
    id: "high-pressure", title: "High-Pressure UV", group: "UV tanning", chip: "High pressure",
    blurb: "The Matrix and Solarix X2: mostly UVA, for a deeper tan in fewer sessions.",
    items: [
      ["One Session", 49.5],
      ["Five Sessions", 159.5],
      ["Ten Sessions", 286],
      ["Twenty Sessions", 517],
      ["One Month Unlimited", 165],
      ["Two Months Unlimited", 275],
      ["Three Months Unlimited", 341],
      ["Four Months Unlimited", 363, "Any bottle of tanning lotion free"],
      ["High-Pressure Upgrade", 22, "Upgrade a regular session"],
    ],
    note: "Federal indoor tanning tax included.",
  },
  {
    id: "cocktails", title: "The Cocktails", group: "UV tanning", chip: "Cocktails",
    blurb: "A UV session, shaken with something extra.",
    items: [
      ["The Cocktail", 60.5, "UV tan + Mystic Tan"],
      ["The Top Shelf", 82.5, "UV tan + Lavish airbrush tan"],
      ["The Top Shelf Express", 99, "UV tan + Lavish Express"],
      ["The Beauty Combo", 49.5, "UV tan + red light therapy"],
    ],
    note: "Federal indoor tanning tax included.",
  },
  {
    id: "red-light", title: "Red Light Therapy", group: "Wellness", chip: "Red light",
    blurb: "The Beauty Angel: 633 nm red light and a vibration platform. No UV.",
    items: [
      ["One Session", 20],
      ["Ten Sessions", 80],
      ["One Month Unlimited", 80],
      ["Two Months Unlimited", 140],
      ["Three Months Unlimited", 180],
    ],
  },
  {
    id: "sauna", title: "Infrared Sauna", group: "Wellness", chip: "Sauna",
    blurb: "The Zen Den: a private infrared sauna with shower access. By appointment.",
    items: [
      ["One Session", 30, "60 minutes"],
      ["Five Sessions", 130],
      ["Ten Sessions", 230],
      ["Twenty Sessions", 400],
      ["Unlimited Monthly", 200],
    ],
  },
  {
    id: "massage", title: "Massage", group: "Wellness", chip: "Massage",
    blurb: "With Logan or Toni. By appointment.",
    items: [
      ["30-Minute Stretch", 40],
      ["60-Minute Signature Massage", 100],
      ["90-Minute Signature Massage", 130],
      ["2-Hour Signature Massage", "200+"],
    ],
  },
  {
    id: "reiki", title: "Reiki", group: "Wellness", chip: "Reiki",
    blurb: "Hands-on energy work with Sharon or Toni. By appointment.",
    items: [["One-Hour Session", 70]],
  },
  {
    id: "skin", title: "Skin Care by Court", group: "Wellness", chip: "Facials",
    blurb: "Korean-skincare facials with Courtney Rowe, licensed esthetician. Booked directly with Courtney.",
    items: [
      ["Signature Facial", null, "Deep cleanse, exfoliation, extractions if needed, massage and nourishing masks", "wellness.html#skin"],
      ["Express Facial", null, "Cleanse, exfoliate and hydrate in minimal time", "wellness.html#skin"],
      ["Glass Skin Facial", null, "Deep hydration and refined texture for a dewy, luminous finish · 90 minutes", "wellness.html#skin"],
      ["Calm + Reset Facial", null, "Soothes redness and strengthens the skin barrier", "wellness.html#skin"],
    ],
  },
  {
    id: "vip", title: "The VIP Pass", group: "Membership", chip: "VIP Pass",
    feature: true, featureLabel: "So fetch",
    blurb: "One calendar year of unlimited high-pressure tanning, UV tanning, Mystic tanning, red light therapy and infrared sauna. Buy now, start whenever.",
    items: [["VIP Pass, one year", 1000, "Plus one 60-minute massage, one F+R candle, 20% off tanning lotion, a birthday shout-out on our Instagram and a pink lanyard with your photo"]],
  },
];

window.GALLERY = [];
