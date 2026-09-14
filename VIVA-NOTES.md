# Viva preparation notes

Everything the examiner is likely to point at, and what to say about it.
Read this next to the actual files — do not memorise it, understand it.

---

## 1. The thirty-second summary

> "It is a five-page static restaurant website. HTML gives the structure, one external
> stylesheet gives the presentation, and six small JavaScript files give the behaviour.
> There is no server — everything runs in the browser."

The code sticks to basics on purpose: `for` loops, `if` statements, functions, arrays and
objects, and ordinary DOM methods. There are no regular expressions, no array helpers
like `find` or `every`, and nothing from a library.

---

## 2. HTML questions

### Which semantic tags did you use and why?

| Tag | Where | Why that tag |
| --- | --- | --- |
| `<header>` | top bar of every page | It is the introductory block of the page |
| `<nav>` | the menu links | It is a block of navigation links |
| `<main>` | wraps all page content | The main content, one per page |
| `<section>` | each band of the page | A thematic grouping with its own heading |
| `<article>` | each card, each FAQ item | A self-contained piece that would still make sense alone |
| `<aside>` | order panel, contact sidebar | Related to the main content but not part of it |
| `<figure>` / `<figcaption>` | map, lightbox image | An image with a caption attached to it |
| `<address>` | contact page address | Contact details for the nearest article or body |
| `<blockquote>` / `<cite>` | testimonials | A quotation and its source |
| `<table>` | set menus, opening hours | Real two-dimensional data, not layout |
| `<footer>` | bottom of every page | Closing information for the page |

### Why is the `<script>` tag at the bottom of `<body>`?

Because the browser reads the page top to bottom. If the script ran in `<head>`,
`document.getElementById('navToggle')` would return `null` — the button would not exist
yet. Putting scripts last means the HTML is already parsed.

### Why `novalidate` on the form?

`novalidate` turns off the browser's own error bubbles so my JavaScript in
`js/contact.js` is in charge of every message. Without it the browser would stop the
submit before my code ever ran.

### Why do the tables have `<caption>`, `<thead>` and `scope`?

`<caption>` names the table, `<thead>` separates the header row from the data, and
`scope="col"` / `scope="row"` tell a screen reader which heading a cell belongs to.

---

## 3. CSS questions

### The box model

`box-sizing: border-box` is set on every element in the reset at the top of
`style.css`. It means a declared `width` includes padding and border, so a card set to
300px stays 300px even after 22px of padding. Without it the box would be 344px wide
and the grid would break.

### Selectors and specificity

Specificity counts (id, class, element):
- `.btn` → 0,1,0
- `.btn-primary:hover` → 0,2,0 (wins over `.btn`)
- `.site-header.is-scrolled` → 0,2,0
- `#navToggle` → 1,0,0 (an id beats any number of classes)

I kept the stylesheet almost entirely class-based so nothing needs `!important`.
Ids are used as JavaScript hooks, not for styling.

### Flexbox vs Grid — where and why

**Grid** (two-dimensional, I decide rows *and* columns):
- `.grid-3` / `.grid-4` — `grid-template-columns: repeat(4, 1fr)` gives four equal cards.
- `.menu-layout` — `1fr 320px`: the dish grid takes the space left over, the order panel
  is a fixed 320px.
- `.gallery-grid` — three columns, and `.gallery-item-wide` uses `grid-column: span 2`.

**Flexbox** (one-dimensional, content in a line):
- `.header-inner` — `justify-content: space-between` pushes the logo and nav apart.
- `.menu-body` — `flex-direction: column` plus `margin-top: auto` on the button, which
  pushes every "Add to order" button to the bottom so the cards line up.

### How does the text resize on small screens?

Plainly: each heading has one normal size, and the media queries at the bottom of the
stylesheet give it a smaller size. `.section-title` is 42px by default, 34px under
900px wide, and 28px under 640px.

### Positioning

- `position: sticky` on `.site-header` — normal flow until it hits `top: 0`, then it pins.
- `position: absolute` on `.hero-slide` — stacks all slides on top of each other so they
  can cross-fade; the active one is `position: relative` so it gives the hero its height.
- `position: fixed` on `.lightbox` and `.back-to-top` — positioned against the viewport,
  so they stay put while the page scrolls.

### Media queries (the responsive plan)

```css
@media (max-width: 1024px)  /* 4 columns → 2, menu layout stacks   */
@media (max-width: 900px)   /* nav becomes a hamburger drawer      */
@media (max-width: 640px)   /* everything becomes one column       */
```

They are **max-width** queries, so the desktop layout is the default and each
breakpoint overrides it going down. Be ready to open DevTools and drag the width.

### Why do the links not get a box around them when clicked?

The focus ring is written with `:focus-visible`, not `:focus`:

```css
a:focus-visible, button:focus-visible { outline: 3px solid var(--saffron); }
```

`:focus` matches whenever an element has focus, including after a mouse click, which
put an orange box around every nav link you clicked. `:focus-visible` lets the browser
decide: it shows the ring when someone is navigating by keyboard (where it is needed)
and leaves it off for mouse clicks. Press Tab on the page to see it appear.

### How does the hamburger drawer actually move?

`.main-nav` is `position: fixed` with `transform: translateX(100%)` — parked exactly one
of its own widths off the right edge. The class `.is-open` sets `translateX(0)` and the
`transition` animates between the two.

---

## 4. JavaScript questions

### Events used

`click`, `input`, `change`, `blur`, `submit`, `keydown`, `scroll`, `resize`,
`mouseenter`, `mouseleave` — all attached with `addEventListener`, never with inline
`onclick` attributes, so behaviour stays out of the HTML.

### DOM methods used, and where

| Method | Where | What it does |
| --- | --- | --- |
| `getElementById` / `querySelector` / `querySelectorAll` | everywhere | find elements |
| `classList.add` / `remove` / `toggle` / `contains` | everywhere | switch CSS states |
| `createElement` + `appendChild` | slider dots, order rows, nav backdrop | build new elements |
| `.remove()` | closing the drawer | delete an element |
| `textContent` | counters, error messages | write text safely |
| `dataset` | `data-category`, `data-price`, `data-caption` | read custom attributes |
| `setAttribute` | `aria-expanded`, date `min` | change attributes |
| `parentElement` | accordion | step up to the parent element |
| `getBoundingClientRect()` | scroll reveal | where an element sits in the window |

### Explain the slider loop

`showSlide(index)` first wraps the number: if it is past the last slide it becomes 0, if
it is below 0 it becomes the last. Then it removes `is-active` from every slide and dot,
adds it to the chosen one, and stores the number in `currentSlide`. `setInterval` calls
`showSlide(currentSlide + 1)` every 6 seconds; `clearInterval` stops it on hover or after
a manual click so the new slide gets a full turn.

### Explain the order planner

`orderItems` is an array of objects, `{ name, price, qty }`.

- **Searching:** `findItemIndex(name)` is my own function. It loops through the array,
  and if it finds a matching name it returns that position; if the loop finishes without
  a match it returns `-1`.
- **Add:** if the position is `-1` the dish is new, so `push` a new object. Otherwise
  `orderItems[position].qty = orderItems[position].qty + 1`.
- **Remove:** take one off the quantity, and when it reaches 0,
  `splice(position, 1)` deletes that row from the array.
- **Clear:** `orderItems = []` — a brand new empty array.
- **Render:** `renderOrder()` empties the list with `innerHTML = ''`, then loops the
  array and builds one `<li>` per item, adding price × quantity to a running total.

The whole panel is redrawn from the array every time — the array is the truth, the HTML
is just a picture of it.

### Explain the validation logic

Each field has its own function that returns `true` or `false` and writes a message into
the `<small class="error-message">` under it.

**The email check** uses `indexOf`, which gives the position of a character, or `-1`
when it is not there:

```js
const atPosition = value.indexOf('@');
const dotPosition = value.lastIndexOf('.');
```

Then three rules: the `@` must not be missing or first (`atPosition < 1`), the dot must
come at least two places after the `@`, and there must be at least two letters after the
dot. `lastIndexOf` is used so `hifza@mail.co.uk` is judged on the final dot.

**The phone check** calls my own `countDigits()` function, which walks through the text
one character at a time and counts the ones between `'0'` and `'9'`. That way spaces,
dashes and `+92` are ignored and only the digits are counted.

On submit:
1. `event.preventDefault()` stops the page reloading.
2. `isFormValid` starts as `true`, then all seven checks run — deliberately all of them,
   so every wrong field shows its own message, not just the first one.
3. Any check that returns `false` sets `isFormValid = false`.
4. If it is still true: show the success banner and `form.reset()`. If not: `focus()`
   the first field that has the `is-invalid` class.

**What happens on valid input:** green border, error text cleared, success banner with
the name and date, form cleared.
**What happens on invalid input:** red border, red message under the field, no submit,
and the cursor jumps to the first problem.

### Explain the accordion

The JavaScript only adds and removes one class. On click it walks up from the button to
its item with `this.parentElement.parentElement` (button → `<h3>` → `<article>`), notes
whether that item was already open, removes `is-open` from every item, and adds it back
to this one unless it was the one already open — which is what makes a second click
close it.

The sliding is pure CSS:

```css
.accordion-panel            { max-height: 0;     overflow: hidden;
                              transition: max-height 0.35s ease; }
.accordion-item.is-open
  .accordion-panel          { max-height: 400px; }
```

400px is simply bigger than the tallest answer, and `max-height` only sets a limit, so
the panel still ends up exactly as tall as its text.

### Explain the fade-in when you scroll

`revealOnScroll()` in `main.js` loops through the marked blocks and asks one question
about each:

```js
const distanceFromTop = element.getBoundingClientRect().top;
if (distanceFromTop < window.innerHeight - 80) {
  element.classList.add('is-visible');
}
```

`getBoundingClientRect().top` is how far the element is below the top of the **window**
(it goes down as you scroll). `window.innerHeight` is the height of the window. So if
the element's top has come above the bottom of the window, it is on screen and gets the
class. The `- 80` just waits until it is properly in view rather than peeking.

The function runs on every `scroll` event, and once when the page loads so that whatever
is already on screen is shown immediately.

### Why does `main.js` add a `js` class to the body?

So the fade-in only hides content when JavaScript is running:

```css
.js .reveal { opacity: 0; }
```

If JavaScript is switched off, the class is never added, nothing is hidden, and the
whole site still reads perfectly. That is called progressive enhancement.

---

## 5. Live modifications they might ask for

| Task | Do this |
| --- | --- |
| Change the brand colour | `--saffron` in `:root`, line ~30 of `style.css`. Everything follows. |
| Add a menu item | Copy any `<article class="card menu-card">` in `menu.html`, change the name, price, `data-category` and the button's `data-name` / `data-price`. |
| Add a slide | Copy an `<article class="hero-slide">` in `index.html`. The dot is created automatically because `slider.js` loops over the slides. |
| Make the slider faster | `SLIDE_DELAY` at the top of `slider.js`. |
| Add a gallery photo | Add a `<button class="gallery-item">` with the next `data-index` and a `data-caption`. |
| Change a breakpoint | The `@media` values in section 16 of `style.css`. |
| Make the name field require 5 letters | `value.length < 3` → `< 5` in `validateName()`. |
| Change cards per row | `grid-template-columns: repeat(4, 1fr)` → `repeat(3, 1fr)` in `.grid-4`. |
| Turn the hamburger on earlier | `@media (max-width: 900px)` → a larger number. |

---

## 6. Git questions

```bash
git log --oneline --graph --all   # show the branch and merge history
git branch -a                     # list every feature branch
```

Say: "I made a branch per feature, committed as I went, and merged each one into `main`
with `--no-ff` so the merge stays visible in the history instead of being flattened."

---

## 7. Weak spots — be honest about these

- The order planner is **not** a real shopping cart: nothing is stored or sent anywhere,
  and it resets on refresh. It is a planner, and the page says so.
- The contact form does not email anybody. A static site has no server to send with;
  validation is the part that belongs to the browser.
- **The photographs are not mine.** They come from Wikimedia Commons under Creative
  Commons licences, and every one is credited by photographer and licence in
  `CREDITS.md` and in the footer of every page. Say this plainly if asked — using
  properly licensed and credited photos is normal practice; pretending you shot them
  is not. The logo, the contact-page map and the three team portraits *are* my own
  SVG drawings.
- The team portraits stayed as drawings on purpose: putting a stranger's photograph
  under a made-up chef's name would be misleading.
