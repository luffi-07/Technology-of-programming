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

const form = document.getElementById('subForm');
const result = document.getElementById('result');
const boxes = Array.from(document.querySelectorAll('input[name="topic"]'));
const toggleAll = document.getElementById('toggleAll');

function getTopics() {
  return boxes.filter(function (box) { return box.checked; }).map(function (box) { return box.value; });
}
function updateCounter() {
  const count = getTopics().length;
  document.getElementById('topicCount').textContent = 'Выбрано тем: ' + count;
  toggleAll.textContent = count === boxes.length ? 'Снять все' : 'Выбрать все';
}
boxes.forEach(function (box) { box.addEventListener('change', updateCounter); });

// Творческое: кнопка «Выбрать все / Снять все»
toggleAll.addEventListener('click', function () {
  const check = getTopics().length !== boxes.length;
  boxes.forEach(function (box) { box.checked = check; });
  updateCounter();
});

form.addEventListener('submit', function (event) {
  event.preventDefault();
  result.classList.remove('show');

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const topics = getTopics();

  const results = [];
  results.push(setError('name', name === '' ? 'Введите имя' : ''));

  let emailMessage = '';
  if (email === '') emailMessage = 'Введите e-mail';
  else if (!isEmail(email)) emailMessage = 'E-mail должен быть вида name@example.com';
  results.push(setError('email', emailMessage));

  results.push(setError('topics', topics.length === 0 ? 'Выберите хотя бы одну тему' : ''));

  if (!results.every(Boolean)) return;

  result.innerHTML = '<h2>Подписка оформлена</h2>' +
    '<p>' + name + ', мы будем писать на ' + email + '</p><p>Темы: ' + topics.join(', ') + '</p>';
  result.classList.add('show');
});
