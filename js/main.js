/* =============================================================
   main.js — behaviour that every page on the site shares
   1. Mobile (hamburger) navigation
   2. Sticky header shadow while scrolling
   3. Back-to-top button
   4. Current year in the footer
   5. Reveal sections as they scroll into view
   ============================================================= */

// Tell the stylesheet that JavaScript is switched on.
// (The reveal animation only hides content when this class exists,
// so the site still works perfectly with JavaScript disabled.)
document.body.classList.add('js');


/* ---------- 1. MOBILE NAVIGATION ---------- */

const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');
let backdrop = null; // the dark sheet behind the open drawer

// Opens the slide-in menu and builds a backdrop element.
function openNav() {
  primaryNav.classList.add('is-open');
  navToggle.classList.add('is-open');
  navToggle.setAttribute('aria-expanded', 'true');
  navToggle.setAttribute('aria-label', 'Close menu');
  document.body.style.overflow = 'hidden'; // stop the page behind from scrolling

  // create a <div class="nav-backdrop"> and put it in the page
  backdrop = document.createElement('div');
  backdrop.className = 'nav-backdrop';
  backdrop.addEventListener('click', closeNav); // tapping outside closes the menu
  document.body.appendChild(backdrop);
}

// Closes the menu and removes the backdrop again.
function closeNav() {
  primaryNav.classList.remove('is-open');
  navToggle.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open menu');
  document.body.style.overflow = '';

  if (backdrop !== null) {
    backdrop.remove();
    backdrop = null;
  }
}

if (navToggle && primaryNav) {
  // One button that opens or closes, depending on the current state.
  navToggle.addEventListener('click', function () {
    if (primaryNav.classList.contains('is-open')) {
      closeNav();
    } else {
      openNav();
    }
  });

  // Tapping any link inside the drawer closes it as well.
  const drawerLinks = primaryNav.querySelectorAll('a');
  for (let i = 0; i < drawerLinks.length; i++) {
    drawerLinks[i].addEventListener('click', closeNav);
  }

  // The Escape key closes the drawer.
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && primaryNav.classList.contains('is-open')) {
      closeNav();
    }
  });

  // If the window is widened back to desktop size, reset everything.
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900 && primaryNav.classList.contains('is-open')) {
      closeNav();
    }
  });
}


/* ---------- 5. REVEAL ON SCROLL (set up first, used below) ---------- */

// Collect the blocks that should fade in, and mark each one.
const revealTargets = document.querySelectorAll(
  '.section-head, .highlight-card, .value-card, .dish-card, .team-card, ' +
  '.contact-card, .split-media, .split-body, .timeline-item, .quote-card, .table-wrap'
);

for (let r = 0; r < revealTargets.length; r++) {
  revealTargets[r].classList.add('reveal');
}

// Shows every block that has reached the visible part of the window.
function revealOnScroll() {
  for (let i = 0; i < revealTargets.length; i++) {
    const element = revealTargets[i];

    // getBoundingClientRect().top = distance from the top of the window.
    // window.innerHeight = the height of the window.
    // So if the top of the block is above the bottom of the window, it is on screen.
    const distanceFromTop = element.getBoundingClientRect().top;

    if (distanceFromTop < window.innerHeight - 80) {
      element.classList.add('is-visible');
    }
  }
}


/* ---------- 2, 3 & 5. SCROLL EFFECTS ---------- */

const siteHeader = document.getElementById('siteHeader');
const backToTop = document.getElementById('backToTop');

// One scroll listener handles the header shadow, the button and the fade-ins.
window.addEventListener('scroll', function () {
  const scrolled = window.scrollY; // how far down the page we are, in pixels

  if (siteHeader) {
    if (scrolled > 20) {
      siteHeader.classList.add('is-scrolled');
    } else {
      siteHeader.classList.remove('is-scrolled');
    }
  }

  if (backToTop) {
    if (scrolled > 500) {
      backToTop.classList.add('is-visible');
    } else {
      backToTop.classList.remove('is-visible');
    }
  }

  revealOnScroll();
});

if (backToTop) {
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Run it once at load, for whatever is already on screen.
revealOnScroll();


/* ---------- 4. FOOTER YEAR ---------- */

// Writes the real current year into <span id="year"> so it never goes stale.
const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}
