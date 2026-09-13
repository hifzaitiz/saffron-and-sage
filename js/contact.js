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

// Counts how many characters of a text are digits (0 to 9).
function countDigits(text) {
  let digits = 0;

  for (let i = 0; i < text.length; i++) {
    const character = text.charAt(i);

    if (character >= '0' && character <= '9') {
      digits = digits + 1;
    }
  }

  return digits;
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
  return showValid(nameInput, nameError);
}

function validateEmail() {
  const value = emailInput.value.trim();

  if (value === '') {
    return showError(emailInput, emailError, 'We need an email to confirm the booking.');
  }

  // indexOf gives the position of a character, or -1 when it is not there.
  const atPosition = value.indexOf('@');
  const dotPosition = value.lastIndexOf('.');

  // The @ must not be missing or first ...
  if (atPosition < 1) {
    return showError(emailInput, emailError, 'An email address needs an @ sign.');
  }
  // ... the dot must come after the @, with at least one letter between them,
  // and at least two letters after it (".pk", ".com").
  if (dotPosition < atPosition + 2 || dotPosition > value.length - 3) {
    return showError(emailInput, emailError, 'That email address does not look right.');
  }
  if (value.indexOf(' ') !== -1) {
    return showError(emailInput, emailError, 'An email address cannot contain a space.');
  }

  return showValid(emailInput, emailError);
}

function validatePhone() {
  const value = phoneInput.value.trim();

  if (value === '') {
    return showError(phoneInput, phoneError, 'A phone number is required for reservations.');
  }

  const digits = countDigits(value);

  if (digits < 10 || digits > 13) {
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

  /* ---------- the submit handler ---------- */
  form.addEventListener('submit', function (event) {
    event.preventDefault(); // stop the browser from reloading the page

    // Start by assuming the form is fine, then run every check.
    // All seven run on purpose, so every wrong field shows its own message.
    let isFormValid = true;

    if (validateName() === false) { isFormValid = false; }
    if (validateEmail() === false) { isFormValid = false; }
    if (validatePhone() === false) { isFormValid = false; }
    if (validateGuests() === false) { isFormValid = false; }
    if (validateDate() === false) { isFormValid = false; }
    if (validateMessage() === false) { isFormValid = false; }
    if (validateConsent() === false) { isFormValid = false; }

    if (isFormValid) {
      formSuccess.hidden = false;
      formSuccess.textContent =
        'Thank you, ' + nameInput.value.trim() + '. We have your request for ' +
        dateInput.value + ' and will confirm by email within a few hours.';

      form.reset();
      charCount.textContent = '0';

      // take the green "valid" outlines off again
      const validFields = form.querySelectorAll('.is-valid');
      for (let i = 0; i < validFields.length; i++) {
        validFields[i].classList.remove('is-valid');
      }

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
    const markedFields = form.querySelectorAll('.is-valid, .is-invalid');
    for (let i = 0; i < markedFields.length; i++) {
      markedFields[i].classList.remove('is-valid');
      markedFields[i].classList.remove('is-invalid');
    }

    const errorBoxes = form.querySelectorAll('.error-message');
    for (let i = 0; i < errorBoxes.length; i++) {
      errorBoxes[i].textContent = '';
    }

    formSuccess.hidden = true;
    charCount.textContent = '0';
  });
}
