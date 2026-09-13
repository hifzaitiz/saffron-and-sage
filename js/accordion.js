/* =============================================================
   accordion.js — the FAQ list on the about page
   Clicking a question opens its answer and closes the other one,
   so only a single answer is ever open.
   ============================================================= */

const accordionTriggers = document.querySelectorAll('.accordion-trigger');

accordionTriggers.forEach(function (trigger) {
  trigger.addEventListener('click', function () {
    // closest() walks up the tree until it finds the matching parent
    const item = trigger.closest('.accordion-item');
    const panel = item.querySelector('.accordion-panel');
    const isOpen = item.classList.contains('is-open');

    // First close everything.
    document.querySelectorAll('.accordion-item').forEach(function (other) {
      other.classList.remove('is-open');
      other.querySelector('.accordion-panel').style.maxHeight = null;
      other.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
    });

    // Then open this one — unless it was the one already open,
    // in which case the click simply closed it.
    if (!isOpen) {
      item.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');

      // scrollHeight is the full height the answer needs. Setting it as
      // max-height lets the CSS transition animate the opening.
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  });
});
