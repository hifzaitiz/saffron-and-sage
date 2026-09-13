/* =============================================================
   accordion.js — the FAQ list on the about page
   Clicking a question opens its answer and closes the others,
   so only a single answer is ever open.

   All this file does is add or remove the class "is-open".
   The sliding animation itself is done in CSS.
   ============================================================= */

const accordionTriggers = document.querySelectorAll('.accordion-trigger');
const accordionItems = document.querySelectorAll('.accordion-item');

for (let i = 0; i < accordionTriggers.length; i++) {

  accordionTriggers[i].addEventListener('click', function () {
    // The button sits inside <h3>, which sits inside <article class="accordion-item">.
    // parentElement twice walks up to that article.
    const item = this.parentElement.parentElement;

    // Was this question already open before the click?
    const wasOpen = item.classList.contains('is-open');

    // Close every question first.
    for (let j = 0; j < accordionItems.length; j++) {
      accordionItems[j].classList.remove('is-open');
      accordionItems[j].querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
    }

    // Then open this one — unless it was the one already open,
    // in which case the click simply closed it.
    if (wasOpen === false) {
      item.classList.add('is-open');
      this.setAttribute('aria-expanded', 'true');
    }
  });
}
