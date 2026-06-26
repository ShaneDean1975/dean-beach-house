/* =========================================================
   Dean Family Beach House — interactivity
   - Gallery population + lightbox
   - Mobile nav toggle
   - Booking form (mailto fallback)
   - Footer year
   ========================================================= */

/* ---------- Gallery data ----------
   PLACEHOLDER PHOTOS: these point to free Unsplash beach images so the
   site looks complete out of the box. Replace each `src` with your own
   photos (drop them in an /images folder and use e.g. "images/living.jpg").
   The first item spans two columns — make it your best "hero" shot.
*/
const GALLERY = [
  { src: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80", cap: "Beachfront exterior", wide: true },
  { src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80", cap: "Open living room" },
  { src: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=800&q=80", cap: "Fully equipped kitchen" },
  { src: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80", cap: "Primary bedroom" },
  { src: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80", cap: "Guest bedroom" },
  { src: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=800&q=80", cap: "Bathroom" },
  { src: "https://images.unsplash.com/photo-1437846972679-9e6e537be46e?auto=format&fit=crop&w=800&q=80", cap: "Dining area" },
  { src: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1200&q=80", cap: "Gulf-front deck", wide: true },
  { src: "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?auto=format&fit=crop&w=800&q=80", cap: "Sunset over the Gulf" },
  { src: "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?auto=format&fit=crop&w=800&q=80", cap: "White sand beach" },
  { src: "https://images.unsplash.com/photo-1468413253725-0d5181091126?auto=format&fit=crop&w=800&q=80", cap: "Beach views" },
  { src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=80", cap: "Coastal mornings" }
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

/* ---------- Booking form ----------
   With no backend, this composes an email to the owner via the user's mail
   client. To accept submissions automatically, point `action` at a service
   like Formspree/Netlify Forms, or wire up your own endpoint — see README.
*/
const OWNER_EMAIL = "shane@deancamper.com";
const form = document.getElementById("bookForm");
const status = document.getElementById("bookStatus");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  status.className = "book__status";
  status.textContent = "";

  if (!form.checkValidity()) {
    status.classList.add("is-err");
    status.textContent = "Please fill in the required fields.";
    form.reportValidity();
    return;
  }

  const d = Object.fromEntries(new FormData(form).entries());

  if (d.checkin && d.checkout && d.checkout <= d.checkin) {
    status.classList.add("is-err");
    status.textContent = "Check-out must be after check-in.";
    return;
  }

  const subject = `Booking Request — Dean Family Beach House (${d.checkin} to ${d.checkout})`;
  const body =
    `Name: ${d.firstName} ${d.lastName}\n` +
    `Email: ${d.email}\n` +
    `Phone: ${d.phone || "—"}\n` +
    `Check-in: ${d.checkin}\n` +
    `Check-out: ${d.checkout}\n` +
    `Guests: ${d.guests}\n` +
    `Pet: ${d.pet}\n\n` +
    `Message:\n${d.message || "—"}\n`;

  window.location.href =
    `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  status.classList.add("is-ok");
  status.textContent = "Opening your email app to send the request… If nothing happens, email " + OWNER_EMAIL + " directly.";
  form.reset();
});

/* ---------- Footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
