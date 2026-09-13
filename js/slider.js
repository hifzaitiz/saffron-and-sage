/* =============================================================
   slider.js — the image slider on the home page
   - shows one slide at a time
   - arrows and dots move between slides
   - plays automatically, and pauses while the mouse is over it
   ============================================================= */

const slides = document.querySelectorAll('.hero-slide');
const prevButton = document.getElementById('sliderPrev');
const nextButton = document.getElementById('sliderNext');
const dotsBox = document.getElementById('sliderDots');
const slider = document.getElementById('heroSlider');

let currentSlide = 0;    // which slide is showing right now
let autoPlayTimer = null; // the id returned by setInterval, so we can stop it
const SLIDE_DELAY = 6000; // milliseconds each slide stays on screen

// Only run if this page actually has a slider.
if (slides.length > 0) {

  /* ---------- build one dot per slide ---------- */
  slides.forEach(function (slide, index) {
    const dot = document.createElement('button');
    dot.className = 'slider-dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', 'Go to slide ' + (index + 1));

    if (index === 0) {
      dot.classList.add('is-active');
    }

    // Clicking a dot jumps straight to that slide.
    dot.addEventListener('click', function () {
      showSlide(index);
      restartAutoPlay();
    });

    dotsBox.appendChild(dot);
  });

  const dots = dotsBox.querySelectorAll('.slider-dot');

  /* ---------- show one slide, hide the rest ---------- */
  function showSlide(index) {
    // Wrap around: after the last slide comes the first one again.
    if (index >= slides.length) {
      index = 0;
    }
    if (index < 0) {
      index = slides.length - 1;
    }

    slides.forEach(function (slide) {
      slide.classList.remove('is-active');
    });
    dots.forEach(function (dot) {
      dot.classList.remove('is-active');
    });

    slides[index].classList.add('is-active');
    dots[index].classList.add('is-active');

    currentSlide = index; // remember where we are
  }

  /* ---------- arrows ---------- */
  nextButton.addEventListener('click', function () {
    showSlide(currentSlide + 1);
    restartAutoPlay();
  });

  prevButton.addEventListener('click', function () {
    showSlide(currentSlide - 1);
    restartAutoPlay();
  });

  /* ---------- automatic playback ---------- */
  function startAutoPlay() {
    // setInterval runs the function again and again on a timer
    autoPlayTimer = setInterval(function () {
      showSlide(currentSlide + 1);
    }, SLIDE_DELAY);
  }

  function stopAutoPlay() {
    clearInterval(autoPlayTimer);
  }

  // After a manual click, reset the timer so the next slide gets a full turn.
  function restartAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  // Pause while someone is reading a slide with the mouse on it.
  slider.addEventListener('mouseenter', stopAutoPlay);
  slider.addEventListener('mouseleave', startAutoPlay);

  // Left and right arrow keys also work.
  document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight') {
      showSlide(currentSlide + 1);
      restartAutoPlay();
    }
    if (event.key === 'ArrowLeft') {
      showSlide(currentSlide - 1);
      restartAutoPlay();
    }
  });

  startAutoPlay();
}
