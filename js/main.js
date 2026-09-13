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

  if (backdrop) {
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
  primaryNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

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


/* ---------- 2 & 3. SCROLL EFFECTS ---------- */

const siteHeader = document.getElementById('siteHeader');
const backToTop = document.getElementById('backToTop');

// One scroll listener handles both the header shadow and the button.
window.addEventListener('scroll', function () {
  const scrolled = window.scrollY; // how far down the page we are, in pixels

  if (siteHeader) {
    // classList.toggle(name, condition) adds the class when the condition is true
    siteHeader.classList.toggle('is-scrolled', scrolled > 20);
  }

  if (backToTop) {
    backToTop.classList.toggle('is-visible', scrolled > 500);
  }
});

if (backToTop) {
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ---------- 4. FOOTER YEAR ---------- */

// Writes the real current year into <span id="year"> so it never goes stale.
const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}


/* ---------- 5. REVEAL ON SCROLL ---------- */

// Collect the blocks that should fade in, and mark them.
const revealTargets = document.querySelectorAll(
  '.section-head, .highlight-card, .value-card, .dish-card, .team-card, ' +
  '.contact-card, .split-media, .split-body, .timeline-item, .quote-card, .table-wrap'
);

revealTargets.forEach(function (element) {
  element.classList.add('reveal');
});

// IntersectionObserver tells us when an element enters the visible screen.
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // animate once, then stop watching
      }
    });
  }, { threshold: 0.15 }); // fire when 15% of the element is on screen

  revealTargets.forEach(function (element) {
    observer.observe(element);
  });
} else {
  // Very old browser: just show everything straight away.
  revealTargets.forEach(function (element) {
    element.classList.add('is-visible');
  });
}
