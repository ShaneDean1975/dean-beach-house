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

## ✏️ Things to customize (placeholders are marked)

Everything below is filled with reasonable **placeholder** content. Update it with
the home's real details:

1. **Photos** — `js/script.js`, the `GALLERY` array near the top. The images
   currently point to free Unsplash beach stock photos. Replace each `src` with
   your own pictures: create an `images/` folder, drop photos in, and set
   `src: "images/living-room.jpg"`, etc. The first photo and the deck photo span
   two columns — use your best wide shots there. Also swap the hero background
   image in `css/styles.css` (`.hero { background: ... }`).

2. **Bed/bath/guest counts** — currently **4 BR / 3 BA / sleeps 10**. Search
   `index.html` for these numbers (hero stats, "At a Glance" card, Rooms section)
   and update to match the actual home.

3. **Rates** — the Rates section uses estimate placeholders
   (summer ~$3,200/wk, spring/fall ~$2,200/wk, winter ~$2,400/mo). Update with
   your real pricing in `index.html`.

4. **Phone number** — placeholder `(251) 555-1234` appears in the top bar, the
   booking section, and the footer. Find/replace it with the real number.
   (Email is already set to `shane@deancamper.com`.)

5. **Room details, amenities, descriptions** — adjust the text in `index.html`
   to reflect the actual home.

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
