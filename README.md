# Dean Family Beach House — Website

A single-page vacation-rental website for the **Dean Family Beach House**, a beachfront
home at **5993 Beach Boulevard, Fort Morgan, AL 36542**. Modeled on the look and
functions of the Prickett Properties "Never Blue" listing page.

## Files

```
dean-beach-house/
├── index.html        # page content & structure
├── css/styles.css    # all styling (coastal teal / sand / sunset palette)
├── js/script.js      # gallery + lightbox, mobile nav, booking form
└── README.md
```

## How to view it

Just open `index.html` in any browser — no build step required.

## Content

The real listing content has been imported from the home's existing
"Jubilee Beach House" listing:

- **Photos** — 10 real photos live in `images/` (`jubilee-01.jpg` … `jubilee-10.jpg`)
  and are wired into the `GALLERY` array in `js/script.js`.
- **Specs** — 3 bedrooms / 2 baths / sleeps 10, ~2,000 sq ft.
- **Beds** — 1 king, 1 queen, 1 full, 4 bunk beds.
- **Amenities, description, and reviews** — taken from the live listing.
- **Rates** — real 2026 seasonal nightly rates (summer $400, spring $375,
  fall $350, winter $325), with a 7-night Sat-to-Sat minimum in summer.

### ✏️ Still to update

1. **Phone number** — the placeholder `(251) 555-1234` appears in the top bar,
   booking section, and footer. Find/replace it with the real booking number.
   (Email is already set to `shane@deancamper.com`.)
2. **Rates** — confirm the imported 2026 numbers are current before each season.

### To swap or add photos

Drop new images into `images/` and edit the `GALLERY` array in `js/script.js`
(`src` + `cap`). The first item and one mid-gallery item span two columns — use
your best wide shots there. The hero background is set in `css/styles.css`
(`.hero { background: url("../images/…") }`).

## Booking form

The form has no backend yet — on submit it opens the visitor's email app with a
pre-filled booking request to `shane@deancamper.com` (a "mailto" link). To collect
submissions automatically instead, point the form at a form service:

- **Formspree** (easiest): set the form's `action` to your Formspree URL and
  `method="post"`, then remove the `e.preventDefault()` handler in `script.js`.
- **Netlify Forms**: add `netlify` to the `<form>` tag if you host on Netlify.

## Hosting (free options)

This is a static site, so it can be hosted for free on:
- **Netlify** or **Vercel** — drag-and-drop the folder, or connect a Git repo.
- **GitHub Pages** — push to a repo and enable Pages.

You can then point a custom domain (e.g. `deanfamilybeachhouse.com`) at it.
