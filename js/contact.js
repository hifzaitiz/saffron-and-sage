/* =============================================================
   contact.js — validation for the reservation form
   Every field has its own small check function that returns
   true (good) or false (bad) and writes a message under the field.
   The form only "sends" when all of the checks return true.
   ============================================================= */

const form = document.getElementById('contactForm');

// the inputs
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const guestsInput = document.getElementById('guests');
const dateInput = document.getElementById('date');
const messageInput = document.getElementById('message');
const consentInput = document.getElementById('consent');

// the little <small> boxes that hold the error text
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const phoneError = document.getElementById('phoneError');
const guestsError = document.getElementById('guestsError');
const dateError = document.getElementById('dateError');
const messageError = document.getElementById('messageError');
const consentError = document.getElementById('consentError');

const formSuccess = document.getElementById('formSuccess');
const charCount = document.getElementById('charCount');
const resetBtn = document.getElementById('resetBtn');

const MAX_MESSAGE = 300;


/* ---------- two small helpers used by every check ---------- */

function showError(input, errorBox, message) {
  input.classList.add('is-invalid');
  input.classList.remove('is-valid');
  errorBox.textContent = message;
  return false;
}

function showValid(input, errorBox) {
  input.classList.remove('is-invalid');
  input.classList.add('is-valid');
  errorBox.textContent = '';
  return true;
}


/* ---------- one check per field ---------- */

function validateName() {
  const value = nameInput.value.trim(); // trim() removes spaces at both ends

  if (value === '') {
    return showError(nameInput, nameError, 'Please tell us your name.');
  }
  if (value.length < 3) {
    return showError(nameInput, nameError, 'That looks too short — at least 3 letters.');
  }
  // A regular expression: letters, spaces, apostrophes, dots and hyphens only.
  if (!/^[A-Za-z\s.'-]+$/.test(value)) {
    return showError(nameInput, nameError, 'Please use letters only.');
  }
  return showValid(nameInput, nameError);
}

function validateEmail() {
  const value = emailInput.value.trim();

  if (value === '') {
    return showError(emailInput, emailError, 'We need an email to confirm the booking.');
  }
  // something @ something . at least two letters
  if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(value)) {
    return showError(emailInput, emailError, 'That email address does not look right.');
  }
  return showValid(emailInput, emailError);
}

function validatePhone() {
  const value = phoneInput.value.trim();

  if (value === '') {
    return showError(phoneInput, phoneError, 'A phone number is required for reservations.');
  }
  // Keep only the digits, then count them.
  const digits = value.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 13) {
    return showError(phoneInput, phoneError, 'Enter a valid number, for example 03001234567.');
  }
  return showValid(phoneInput, phoneError);
}

function validateGuests() {
  if (guestsInput.value === '') {
    return showError(guestsInput, guestsError, 'Choose how many people are coming.');
  }
  return showValid(guestsInput, guestsError);
}

function validateDate() {
  if (dateInput.value === '') {
    return showError(dateInput, dateError, 'Pick the date you would like to visit.');
  }

  const chosen = new Date(dateInput.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // ignore the time, compare whole days only

  if (chosen < today) {
    return showError(dateInput, dateError, 'That date has already passed.');
  }
  return showValid(dateInput, dateError);
}

function validateMessage() {
  const value = messageInput.value.trim();

  if (value === '') {
    return showError(messageInput, messageError, 'Tell us a little about the booking.');
  }
  if (value.length < 10) {
    return showError(messageInput, messageError, 'A few more words, please (at least 10 characters).');
  }
  if (value.length > MAX_MESSAGE) {
    return showError(messageInput, messageError, 'Please keep it under ' + MAX_MESSAGE + ' characters.');
  }
  return showValid(messageInput, messageError);
}

function validateConsent() {
  if (!consentInput.checked) {
    consentError.textContent = 'Please tick the box so we may contact you.';
    return false;
  }
  consentError.textContent = '';
  return true;
}


/* ---------- check a field as soon as the visitor leaves it ---------- */

if (form) {
  nameInput.addEventListener('blur', validateName);
  emailInput.addEventListener('blur', validateEmail);
  phoneInput.addEventListener('blur', validatePhone);
  guestsInput.addEventListener('change', validateGuests);
  dateInput.addEventListener('change', validateDate);
  messageInput.addEventListener('blur', validateMessage);
  consentInput.addEventListener('change', validateConsent);

  /* ---------- live character counter ---------- */
  messageInput.setAttribute('maxlength', MAX_MESSAGE);

  messageInput.addEventListener('input', function () {
    charCount.textContent = messageInput.value.length;
  });

  /* ---------- a visitor cannot pick a date in the past ---------- */
  const todayValue = new Date().toISOString().split('T')[0]; // "2026-09-13"
  dateInput.setAttribute('min', todayValue);

  /* ---------- the submit handler ---------- */
  form.addEventListener('submit', function (event) {
    event.preventDefault(); // stop the browser from reloading the page

    // Run every check. They are stored first so that all messages appear,
    // not just the first failing one.
    const results = [
      validateName(),
      validateEmail(),
      validatePhone(),
      validateGuests(),
      validateDate(),
      validateMessage(),
      validateConsent()
    ];

    const isFormValid = results.every(function (result) {
      return result === true;
    });

    if (isFormValid) {
      formSuccess.hidden = false;
      formSuccess.textContent =
        'Thank you, ' + nameInput.value.trim() + '. We have your request for ' +
        dateInput.value + ' and will confirm by email within a few hours.';

      form.reset();
      charCount.textContent = '0';

      // take the green "valid" outlines off again
      form.querySelectorAll('.is-valid').forEach(function (field) {
        field.classList.remove('is-valid');
      });

      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      formSuccess.hidden = true;

      // Jump to the first field that failed.
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.focus();
      }
    }
  });

  /* ---------- clearing the form clears the messages too ---------- */
  resetBtn.addEventListener('click', function () {
    form.querySelectorAll('.is-valid, .is-invalid').forEach(function (field) {
      field.classList.remove('is-valid', 'is-invalid');
    });
    form.querySelectorAll('.error-message').forEach(function (box) {
      box.textContent = '';
    });
    formSuccess.hidden = true;
    charCount.textContent = '0';
  });
}
