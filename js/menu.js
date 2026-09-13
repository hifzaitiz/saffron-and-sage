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
const orderItems = [];


/* ---------- 1 & 2. FILTER + SEARCH ---------- */

// Runs every time the visitor clicks a filter or types in the search box.
function applyFilters() {
  let visibleCount = 0;

  menuCards.forEach(function (card) {
    // data-category="mains" is read through the dataset property
    const category = card.dataset.category;
    const name = card.querySelector('.menu-name').textContent.toLowerCase();

    const matchesCategory = (activeCategory === 'all' || category === activeCategory);
    const matchesSearch = name.includes(searchText);

    if (matchesCategory && matchesSearch) {
      card.classList.remove('is-hidden');
      visibleCount++;
    } else {
      card.classList.add('is-hidden'); // the CSS rule sets display: none
    }
  });

  // Update the little line above the grid.
  if (visibleCount === menuCards.length) {
    resultCount.textContent = 'Showing all ' + menuCards.length + ' dishes';
  } else {
    resultCount.textContent = 'Showing ' + visibleCount + ' of ' + menuCards.length + ' dishes';
  }

  // Show the "nothing found" note only when nothing is left.
  emptyMessage.hidden = (visibleCount !== 0);
}

// Clicking a filter button: move the is-active class, then re-filter.
filterButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    filterButtons.forEach(function (other) {
      other.classList.remove('is-active');
    });
    button.classList.add('is-active');

    activeCategory = button.dataset.filter;
    applyFilters();
  });
});

// The "input" event fires on every keystroke, so the list filters live.
if (searchInput) {
  searchInput.addEventListener('input', function () {
    searchText = searchInput.value.trim().toLowerCase();
    applyFilters();
  });
}


/* ---------- 3. THE ORDER LIST ---------- */

// Redraws the whole panel from the orderItems array.
function renderOrder() {
  orderList.innerHTML = ''; // clear what is there before drawing again

  let total = 0;
  let pieces = 0;

  orderItems.forEach(function (item, index) {
    total += item.price * item.qty;
    pieces += item.qty;

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
    priceSpan.textContent = 'Rs ' + (item.price * item.qty).toLocaleString('en-US');

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.type = 'button';
    removeBtn.textContent = '×';
    removeBtn.setAttribute('aria-label', 'Remove ' + item.name);

    // Take one off, and drop the row completely when it reaches zero.
    removeBtn.addEventListener('click', function () {
      item.qty--;
      if (item.qty === 0) {
        orderItems.splice(index, 1); // remove 1 item at this position
      }
      renderOrder();
    });

    li.appendChild(nameSpan);
    li.appendChild(qtySpan);
    li.appendChild(priceSpan);
    li.appendChild(removeBtn);
    orderList.appendChild(li);
  });

  orderCount.textContent = pieces;
  orderTotal.textContent = 'Rs ' + total.toLocaleString('en-US');
  orderEmpty.hidden = (orderItems.length > 0); // hide the placeholder once something is added
}

// Every "Add to order" button on the page.
addButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    const name = button.dataset.name;
    const price = Number(button.dataset.price); // data attributes are text, so convert

    // Is this dish already on the list?
    const existing = orderItems.find(function (item) {
      return item.name === name;
    });

    if (existing) {
      existing.qty++;
    } else {
      orderItems.push({ name: name, price: price, qty: 1 });
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
});

// Empty the whole list.
if (clearOrder) {
  clearOrder.addEventListener('click', function () {
    orderItems.length = 0; // quickest way to empty an array
    renderOrder();
  });
}

// Draw the panel once when the page loads.
renderOrder();
