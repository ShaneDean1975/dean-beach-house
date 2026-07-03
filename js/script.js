/* =========================================================
   Dean Family Beach House — interactivity
   - Gallery population + lightbox
   - Mobile nav toggle
   - Booking form (mailto fallback)
   - Footer year
   ========================================================= */

/* ---------- Gallery data ----------
   The Dean Family Beach House ("Jubilee") photos, stored in /images.
   The first item and one mid-gallery item span two columns (wide shots).
*/
const GALLERY = [
  { src: "images/gulf-shores-beach-house-rental.jpg", cap: "Gulf-front exterior", wide: true },
  { src: "images/jubilee-03.jpg", cap: "Steps to the white-sand beach" },
  { src: "images/jubilee-02.jpg", cap: "Covered deck with Gulf views" },
  { src: "images/jubilee-04.jpg", cap: "Primary bedroom — king bed" },
  { src: "images/jubilee-05.jpg", cap: "Guest bedroom — queen bed" },
  { src: "images/jubilee-06.jpg", cap: "Guest bedroom" },
  { src: "images/jubilee-08.jpg", cap: "Bedroom with deck access & Gulf view", wide: true },
  { src: "images/jubilee-07.jpg", cap: "Coastal furnishings & smart TVs" },
  { src: "images/jubilee-09.jpg", cap: "Walk-in shower bath" },
  { src: "images/jubilee-10.jpg", cap: "Bath with double vanity & soaking tub" },
  { src: "images/outdoor-1.jpg", cap: "Picnic table under the house" },
  { src: "images/outdoor-2.jpg", cap: "Outdoor shower & storage area" },
  { src: "images/outdoor-3.jpg", cap: "Enclosed outdoor shower" },
  { src: "images/outdoor-4.jpg", cap: "Beach gear provided — floats, chairs & toys" }
];

/* ---------- Build gallery ---------- */
const grid = document.getElementById("galleryGrid");
GALLERY.forEach((item, i) => {
  const fig = document.createElement("figure");
  fig.className = "gallery__item" + (item.wide ? " gallery__item--wide" : "");
  fig.dataset.index = i;
  fig.innerHTML =
    `<img src="${item.src}" alt="${item.cap}" loading="lazy" />` +
    `<figcaption class="gallery__cap">${item.cap}</figcaption>`;
  fig.addEventListener("click", () => openLightbox(i));
  grid.appendChild(fig);
});

/* ---------- Lightbox ---------- */
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
let current = 0;

function openLightbox(i) {
  current = i;
  lbImg.src = GALLERY[i].src;
  lbImg.alt = GALLERY[i].cap;
  lb.classList.add("is-open");
  lb.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  lb.classList.remove("is-open");
  lb.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
function step(dir) {
  current = (current + dir + GALLERY.length) % GALLERY.length;
  lbImg.src = GALLERY[current].src;
  lbImg.alt = GALLERY[current].cap;
}

document.getElementById("lbClose").addEventListener("click", closeLightbox);
document.getElementById("lbPrev").addEventListener("click", () => step(-1));
document.getElementById("lbNext").addEventListener("click", () => step(1));
lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
document.addEventListener("keydown", (e) => {
  if (!lb.classList.contains("is-open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});

/* ---------- Mobile nav ---------- */
const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");
navToggle.addEventListener("click", () => nav.classList.toggle("is-open"));
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => nav.classList.remove("is-open"))
);

/* ---------- Booking form (one-click via relay) ----------
   Submits straight from the site: the form posts JSON to a Cloudflare
   Worker relay, which creates the entry in the owner's Wufoo account
   through Wufoo's API (email notifications + entry log still fire).
   The Wufoo API key lives only in the relay, never in this site.
*/
const RELAY_URL = "https://gulf-shores-booking-relay.beachhouse.workers.dev/";
const form = document.getElementById("bookForm");
const status = document.getElementById("bookStatus");

const val = (id) => document.getElementById(id).value;

if (form) form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.className = "book__status";
  status.textContent = "";

  if (!form.checkValidity()) {
    status.classList.add("is-err");
    status.textContent = "Please fill in the required fields.";
    form.reportValidity();
    return;
  }

  const checkin = val("bfCheckin");   // yyyy-mm-dd
  const checkout = val("bfCheckout");
  if (checkin && checkout && checkout <= checkin) {
    status.classList.add("is-err");
    status.textContent = "Check-out must be after check-in.";
    return;
  }

  const [inY, inM, inD] = checkin.split("-");
  const [outY, outM, outD] = checkout.split("-");
  const digits = val("bfPhone").replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");

  const payload = {
    "Field1": val("bfFirst").trim(),
    "Field2": val("bfLast").trim(),
    "Field3": val("bfEmail").trim(),
    "Field4": digits.slice(0, 3),
    "Field4-1": digits.slice(3, 6),
    "Field4-2": digits.slice(6, 10),
    "Field5-1": inM, "Field5-2": inD, "Field5": inY,
    "Field6-1": outM, "Field6-2": outD, "Field6": outY,
    "Field10": val("bfGuests"),
    "website": val("bfWebsite")   // honeypot — humans leave it empty
  };

  const btn = form.querySelector("button[type=submit]");
  btn.disabled = true;
  status.classList.add("is-ok");
  status.textContent = "Sending your request…";

  try {
    const resp = await fetch(RELAY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const out = await resp.json();
    if (out.ok) {
      status.className = "book__status is-ok";
      status.textContent = "Request sent! We'll be in touch soon — usually the same day.";
      form.reset();
    } else {
      throw new Error(out.error || "send failed");
    }
  } catch (err) {
    status.className = "book__status is-err";
    status.textContent = "Sorry — something went wrong sending your request. Please call (618) 954-9645 or email us instead.";
  } finally {
    btn.disabled = false;
  }
});

/* ---------- Availability calendar ----------
   To update bookings, edit the two values below:
   • RENTED_THROUGH — every date on or before this date shows as Rented.
   • BOOKED_DATES   — additional individual booked dates ("YYYY-MM-DD").
*/
const RENTED_THROUGH = "2026-07-03";
const BOOKED_DATES = ["2026-07-10", "2026-07-11"];

(function () {
  const grid = document.getElementById("calGrid");
  if (!grid) return;
  const monthLabel = document.getElementById("calMonth");
  const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MONTHS = ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"];
  const today = new Date();
  let viewY = today.getFullYear();
  let viewM = today.getMonth();

  const key = (y, m, d) =>
    y + "-" + String(m + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");
  const isRented = (k) => k <= RENTED_THROUGH || BOOKED_DATES.includes(k);

  function render() {
    monthLabel.textContent = MONTHS[viewM] + " " + viewY;
    grid.innerHTML = "";
    DOW.forEach((d) => {
      const el = document.createElement("div");
      el.className = "cal__dow";
      el.textContent = d;
      grid.appendChild(el);
    });
    const firstDay = new Date(viewY, viewM, 1).getDay();
    const daysInMonth = new Date(viewY, viewM + 1, 0).getDate();
    for (let i = 0; i < firstDay; i++) {
      const el = document.createElement("div");
      el.className = "cal__day cal__day--empty";
      grid.appendChild(el);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const k = key(viewY, viewM, d);
      const rented = isRented(k);
      const el = document.createElement("div");
      el.className = "cal__day " + (rented ? "cal__day--rented" : "cal__day--avail");
      el.textContent = d;
      el.title = rented ? "Rented" : "Available";
      grid.appendChild(el);
    }
  }

  document.getElementById("calPrev").addEventListener("click", () => {
    viewM--; if (viewM < 0) { viewM = 11; viewY--; } render();
  });
  document.getElementById("calNext").addEventListener("click", () => {
    viewM++; if (viewM > 11) { viewM = 0; viewY++; } render();
  });
  render();
})();

/* ---------- Logo scrolls to top ----------
   #top sits on the sticky header, which is always in view, so a plain
   anchor jump does nothing. Scroll to the very top explicitly instead.
*/
const brandLink = document.querySelector('a.brand[href="#top"]');
if (brandLink) {
  brandLink.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------- Obfuscated email links ----------
   The address is stored in pieces in data attributes and assembled here,
   so it never appears as scrape-able text in the page source.
*/
document.querySelectorAll(".email-link").forEach((a) => {
  const addr = a.dataset.u + "@" + a.dataset.d + "." + a.dataset.t;
  a.href = "mailto:" + addr;
  a.textContent = addr;
});

/* ---------- Footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
