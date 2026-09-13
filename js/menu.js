/* =============================================================
   menu.js — the interactive parts of the menu page
   1. Filter the dishes by course (All / Starters / Mains ...)
   2. Search dishes by name while typing
   3. Build an order list: add, remove, count and total
   ============================================================= */

/* ---------- grab the elements we need ---------- */
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('dishSearch');
const menuCards = document.querySelectorAll('.menu-card');
const resultCount = document.getElementById('resultCount');
const emptyMessage = document.getElementById('emptyMessage');

const addButtons = document.querySelectorAll('.add-btn');
const orderList = document.getElementById('orderList');
const orderEmpty = document.getElementById('orderEmpty');
const orderCount = document.getElementById('orderCount');
const orderTotal = document.getElementById('orderTotal');
const clearOrder = document.getElementById('clearOrder');

// Two pieces of state that remember what the visitor has chosen.
let activeCategory = 'all';
let searchText = '';

// The order is an array of objects: { name, price, qty }
let orderItems = [];


/* ---------- 1 & 2. FILTER + SEARCH ---------- */

// Runs every time the visitor clicks a filter or types in the search box.
function applyFilters() {
  let visibleCount = 0;

  for (let i = 0; i < menuCards.length; i++) {
    const card = menuCards[i];

    // data-category="mains" is read through the dataset property
    const category = card.dataset.category;
    const name = card.querySelector('.menu-name').textContent.toLowerCase();

    // Does this card pass both tests?
    const matchesCategory = (activeCategory === 'all' || category === activeCategory);
    const matchesSearch = (name.indexOf(searchText) !== -1);

    if (matchesCategory && matchesSearch) {
      card.classList.remove('is-hidden');
      visibleCount = visibleCount + 1;
    } else {
      card.classList.add('is-hidden'); // the CSS rule sets display: none
    }
  }

  // Update the little line above the grid.
  if (visibleCount === menuCards.length) {
    resultCount.textContent = 'Showing all ' + menuCards.length + ' dishes';
  } else {
    resultCount.textContent = 'Showing ' + visibleCount + ' of ' + menuCards.length + ' dishes';
  }

  // Show the "nothing found" note only when nothing is left.
  if (visibleCount === 0) {
    emptyMessage.hidden = false;
  } else {
    emptyMessage.hidden = true;
  }
}

// Clicking a filter button: move the is-active class, then re-filter.
for (let i = 0; i < filterButtons.length; i++) {
  filterButtons[i].addEventListener('click', function () {
    // take the class off every button ...
    for (let j = 0; j < filterButtons.length; j++) {
      filterButtons[j].classList.remove('is-active');
    }
    // ... then put it on the one that was clicked
    this.classList.add('is-active');

    activeCategory = this.dataset.filter;
    applyFilters();
  });
}

// The "input" event fires on every keystroke, so the list filters live.
if (searchInput) {
  searchInput.addEventListener('input', function () {
    searchText = searchInput.value.trim().toLowerCase();
    applyFilters();
  });
}


/* ---------- 3. THE ORDER LIST ---------- */

// Looks for a dish in the order and gives back its position,
// or -1 when it is not on the list yet.
function findItemIndex(name) {
  for (let i = 0; i < orderItems.length; i++) {
    if (orderItems[i].name === name) {
      return i;
    }
  }
  return -1;
}

// Redraws the whole panel from the orderItems array.
function renderOrder() {
  orderList.innerHTML = ''; // clear what is there before drawing again

  let total = 0;
  let pieces = 0;

  for (let i = 0; i < orderItems.length; i++) {
    const item = orderItems[i];
    const linePrice = item.price * item.qty;

    total = total + linePrice;
    pieces = pieces + item.qty;

    // <li class="order-item"> ... </li>
    const li = document.createElement('li');
    li.className = 'order-item';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'order-item-name';
    nameSpan.textContent = item.name;

    const qtySpan = document.createElement('span');
    qtySpan.className = 'order-item-qty';
    qtySpan.textContent = '× ' + item.qty;

    const priceSpan = document.createElement('span');
    priceSpan.textContent = 'Rs ' + linePrice;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.type = 'button';
    removeBtn.textContent = '×';
    removeBtn.setAttribute('aria-label', 'Remove ' + item.name);

    // Take one off, and drop the row completely when it reaches zero.
    removeBtn.addEventListener('click', function () {
      const position = findItemIndex(item.name);

      orderItems[position].qty = orderItems[position].qty - 1;

      if (orderItems[position].qty === 0) {
        orderItems.splice(position, 1); // remove 1 item at this position
      }

      renderOrder();
    });

    li.appendChild(nameSpan);
    li.appendChild(qtySpan);
    li.appendChild(priceSpan);
    li.appendChild(removeBtn);
    orderList.appendChild(li);
  }

  orderCount.textContent = pieces;
  orderTotal.textContent = 'Rs ' + total;

  // hide the placeholder once something is added
  if (orderItems.length > 0) {
    orderEmpty.hidden = true;
  } else {
    orderEmpty.hidden = false;
  }
}

// Every "Add to order" button on the page.
for (let i = 0; i < addButtons.length; i++) {
  addButtons[i].addEventListener('click', function () {
    const button = this;
    const name = button.dataset.name;
    const price = Number(button.dataset.price); // data attributes are text, so convert

    // Is this dish already on the list?
    const position = findItemIndex(name);

    if (position === -1) {
      orderItems.push({ name: name, price: price, qty: 1 });
    } else {
      orderItems[position].qty = orderItems[position].qty + 1;
    }

    renderOrder();

    // Quick visual confirmation on the button itself.
    button.classList.add('is-added');
    button.textContent = 'Added ✓';

    setTimeout(function () {
      button.classList.remove('is-added');
      button.textContent = 'Add to order';
    }, 1200); // milliseconds
  });
}

// Empty the whole list.
if (clearOrder) {
  clearOrder.addEventListener('click', function () {
    orderItems = []; // a brand new empty array
    renderOrder();
  });
}

// Draw the panel once when the page loads.
renderOrder();
