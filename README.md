# Saffron &amp; Sage — Restaurant Website

A fully static, five-page website built with **HTML5, CSS3 and vanilla JavaScript**
for the Web Technologies assignment (BS CS F24 — Morning &amp; Self Support).

No backend, no database, no frameworks, no CSS libraries, and deliberately no advanced
JavaScript — plain `for` loops, `if` statements and simple DOM methods throughout. Every line of HTML, CSS and
JavaScript in this repository was written for this project, and all the artwork in
`images/` is original SVG.

**Theme:** *Saffron &amp; Sage*, a modern Pakistani kitchen in the walled city of Lahore.

---

## Pages

| Page | File | What it contains |
| --- | --- | --- |
| Home | `index.html` | Three-slide hero carousel, highlight cards, signature dishes, story block, testimonials, call to action |
| About | `about.html` | Story, four values, a vertical timeline, the kitchen team, FAQ accordion |
| Menu | `menu.html` | 16 dishes with category filters, live search, an order planner, and a set-menu table |
| Gallery | `gallery.html` | Nine photographs in a mixed-size grid with a full-screen lightbox |
| Contact | `contact.html` | Validated reservation form, contact cards, opening-hours table, illustrated map |

Every page shares the same header, navigation, footer and stylesheet.

---

## JavaScript features

Six interactive features, split into one file per job.

| File | Feature | Main ideas used |
| --- | --- | --- |
| `js/main.js` | Hamburger menu, sticky-header shadow, back-to-top button, footer year, scroll reveal | `addEventListener`, `classList`, `createElement` / `appendChild` / `remove`, `getBoundingClientRect`, `Date` |
| `js/slider.js` | Auto-playing hero carousel with arrows, dots and arrow-key control | `setInterval` / `clearInterval`, index wrap-around, dots built in a loop |
| `js/menu.js` | Category filter, live search, add / remove / clear order list with a running total | `dataset`, `for` loops, an array of objects, `push` / `splice`, building list rows in the DOM |
| `js/gallery.js` | Lightbox viewer with next / previous, counter, Escape and arrow keys | array of photo objects, `hidden` property, keyboard events, focus handling |
| `js/contact.js` | Field-by-field form validation with inline messages and a success banner | `preventDefault`, `trim`, `indexOf`, character counting, date comparison |
| `js/accordion.js` | FAQ list where only one answer is open at a time | `parentElement`, adding and removing one class (CSS does the animation) |

---

## CSS

One external stylesheet, `css/style.css`, linked from all five pages and written in
sixteen labelled sections.

- **Design tokens** — colours, fonts, radii and shadows live in CSS variables on `:root`.
- **Layout** — CSS **Grid** for every card row, the menu layout, the gallery and the
  footer; **Flexbox** for the header, toolbars, buttons and card internals.
- **Typography** — Fraunces for headings, Inter for body text, with heading sizes
  stepped down at each breakpoint.
- **Responsive** — three breakpoints: `1024px` (four columns become two),
  `900px` (navigation collapses into the hamburger drawer),
  `640px` (everything becomes a single column).
- **Motion** — hover lifts, a slow zoom on the hero image, a scroll-reveal fade, and a
  `prefers-reduced-motion` block that switches all of it off for people who ask for that.

---

## Folder structure

```
Web_Assignment/
├── index.html          home
├── about.html          about us
├── menu.html           menu + order planner
├── gallery.html        photo gallery
├── contact.html        contact + reservation form
├── css/
│   └── style.css       the single stylesheet
├── js/
│   ├── main.js         shared behaviour (nav, header, back to top)
│   ├── slider.js       home page carousel
│   ├── menu.js         filter, search, order list
│   ├── gallery.js      lightbox
│   ├── contact.js      form validation
│   └── accordion.js    FAQ
├── images/             34 original SVG illustrations
├── VIVA-NOTES.md       study notes for the viva
└── README.md
```

---

## How to run

No build step and no server needed.

1. Download or clone the repository.
2. Open `index.html` in any modern browser.

An internet connection is only used to fetch the two Google fonts; without it the site
falls back to Georgia and a system sans-serif and still works completely.

---

## Git workflow

Work was done on one branch per feature and merged into `main` with `--no-ff`, so the
history shows each feature as its own merge:

```
feature-pages              semantic HTML for all five pages
feature-styles             design system, layout, artwork
feature-navbar             hamburger menu and shared page behaviour
feature-hero-slider        home page carousel
feature-menu-filter        menu filtering, search and order list
feature-gallery-lightbox   full screen photo viewer
feature-contact-form       client side form validation
feature-faq-accordion      about page FAQ
feature-responsive-fixes   small screen layout corrections
feature-gallery-artwork    redrawn gallery scenes
```

See the shape of the history with:

```bash
git log --oneline --graph --all
```

---

## Accessibility and standards

- Semantic HTML5 throughout: `header`, `nav`, `main`, `section`, `article`, `aside`,
  `figure`, `footer`, `address`, `blockquote`, `table` with `caption`, `thead` and
  `th scope`.
- Every image has an `alt` attribute; decorative icons are marked `aria-hidden`.
- The hamburger button reports `aria-expanded`, and the lightbox is an `aria-modal` dialog.
- Visible focus outlines on every interactive element, and full keyboard support for the
  slider, gallery and accordion.

---

## Credits

- Fonts: [Fraunces](https://fonts.google.com/specimen/Fraunces) and
  [Inter](https://fonts.google.com/specimen/Inter), served by Google Fonts.
- Illustrations: drawn as SVG for this project.
- Content, layout and code: original work for the Web Technologies assignment.
