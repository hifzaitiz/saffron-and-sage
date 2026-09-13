/* =============================================================
   gallery.js — the photo viewer (lightbox) on the gallery page
   - clicking a photo opens it full screen
   - arrows, arrow keys, Escape and a click on the dark area all work
   ============================================================= */

const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentImage = 0;      // which photo is open
let lastClicked = null;    // so we can put the keyboard focus back afterwards

if (galleryItems.length > 0 && lightbox) {

  /* ---------- collect the photo details once, into an array ---------- */
  const photos = [];

  galleryItems.forEach(function (item) {
    const picture = item.querySelector('img');
    photos.push({
      src: picture.getAttribute('src'),
      alt: picture.getAttribute('alt'),
      caption: item.dataset.caption // comes from data-caption="..."
    });
  });

  /* ---------- put one photo into the viewer ---------- */
  function showImage(index) {
    // wrap around at both ends
    if (index >= photos.length) {
      index = 0;
    }
    if (index < 0) {
      index = photos.length - 1;
    }

    const photo = photos[index];
    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.alt;
    lightboxCaption.textContent = photo.caption;
    lightboxCounter.textContent = (index + 1) + ' / ' + photos.length;

    currentImage = index;
  }

  /* ---------- open and close ---------- */
  function openLightbox(index, trigger) {
    showImage(index);
    lightbox.hidden = false;                 // removes the hidden attribute
    document.body.style.overflow = 'hidden'; // freeze the page behind
    lastClicked = trigger;
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';

    if (lastClicked) {
      lastClicked.focus(); // return focus to the thumbnail that was clicked
    }
  }

  /* ---------- events ---------- */

  // Each thumbnail opens the viewer at its own position.
  galleryItems.forEach(function (item, index) {
    item.addEventListener('click', function () {
      openLightbox(index, item);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);

  lightboxNext.addEventListener('click', function () {
    showImage(currentImage + 1);
  });

  lightboxPrev.addEventListener('click', function () {
    showImage(currentImage - 1);
  });

  // Clicking the dark area (but not the picture itself) closes the viewer.
  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard shortcuts, but only while the viewer is open.
  document.addEventListener('keydown', function (event) {
    if (lightbox.hidden) {
      return; // nothing to do
    }

    if (event.key === 'Escape') {
      closeLightbox();
    }
    if (event.key === 'ArrowRight') {
      showImage(currentImage + 1);
    }
    if (event.key === 'ArrowLeft') {
      showImage(currentImage - 1);
    }
  });
}
