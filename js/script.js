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
  { src: "images/jubilee-01.jpg", cap: "Gulf-front exterior", wide: true },
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
  { src: "images/outdoor-3.jpg", cap: "Enclosed outdoor shower" }
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
