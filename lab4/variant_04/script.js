// Показать/убрать ошибку у поля с data-field="key"
function setError(key, message) {
  const wrap = document.querySelector('[data-field="' + key + '"]');
  wrap.classList.toggle('invalid', message !== '');
  wrap.classList.toggle('valid', message === '');
  wrap.querySelector('.error').textContent = message;
  return message === '';
}
function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function selectedRadio(name) {
  const el = document.querySelector('input[name="' + name + '"]:checked');
  return el ? el.value : '';
}

const form = document.getElementById('courseForm');
const result = document.getElementById('result');
const phoneInput = document.getElementById('phone');

// Творческое: счётчик цифр в номере телефона
phoneInput.addEventListener('input', function () {
  const digits = phoneInput.value.replace(/\D/g, '').length;
  document.getElementById('phoneHint').textContent = 'Цифр: ' + digits + ' (нужно от 10 до 12)';
});

form.addEventListener('submit', function (event) {
  event.preventDefault();
  result.classList.remove('show');

  const name = document.getElementById('name').value.trim();
  const phone = phoneInput.value.trim();
  const digits = phone.replace(/\D/g, '');
  const direction = document.getElementById('direction').value;
  const format = selectedRadio('format');

  const results = [];
  results.push(setError('name', name === '' ? 'Введите имя' : ''));

  let phoneMessage = '';
  if (phone === '') phoneMessage = 'Введите номер телефона';
  else if (/[^\d\s+()-]/.test(phone)) phoneMessage = 'В телефоне допустимы только цифры, пробелы, +, - и скобки';
  else if (digits.length < 10 || digits.length > 12) phoneMessage = 'Телефон должен содержать от 10 до 12 цифр';
  results.push(setError('phone', phoneMessage));

  results.push(setError('direction', direction === '' ? 'Выберите направление обучения' : ''));
  results.push(setError('format', format === '' ? 'Выберите формат обучения' : ''));

  if (!results.every(Boolean)) return;

  result.innerHTML = '<h2>Заявка отправлена</h2>' +
    '<p>Имя: ' + name + '</p><p>Телефон: ' + phone + '</p>' +
    '<p>Направление: ' + direction + '</p><p>Формат: ' + format + '</p>';
  result.classList.add('show');
});
