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

const form = document.getElementById('orderForm');
const result = document.getElementById('result');
const productSelect = document.getElementById('product');
const quantityInput = document.getElementById('quantity');

function getExtras() {
  return Array.from(document.querySelectorAll('input[name="extra"]:checked'));
}
function priceOf(element) {
  return element ? Number(element.dataset.price) : 0;
}
function calcTotal() {
  const qty = Number(quantityInput.value);
  const unit = priceOf(productSelect.options[productSelect.selectedIndex]);
  const delivery = priceOf(document.querySelector('input[name="delivery"]:checked'));
  const extras = getExtras().reduce(function (sum, box) { return sum + priceOf(box); }, 0);
  const goods = qty > 0 ? unit * qty : 0;
  return goods + delivery + extras;
}
// Творческое: итоговая стоимость обновляется на лету
function updateTotal() {
  document.getElementById('total').textContent = 'Итого: ' + calcTotal().toLocaleString('ru-RU') + ' ₸';
}
form.addEventListener('input', updateTotal);
form.addEventListener('change', updateTotal);

form.addEventListener('submit', function (event) {
  event.preventDefault();
  result.classList.remove('show');

  const product = productSelect.value;
  const qtyText = quantityInput.value.trim();
  const qty = Number(qtyText);
  const delivery = selectedRadio('delivery');

  const results = [];
  results.push(setError('product', product === '' ? 'Выберите товар' : ''));

  let qtyMessage = '';
  if (qtyText === '') qtyMessage = 'Введите количество';
  else if (!Number.isInteger(qty)) qtyMessage = 'Количество должно быть целым числом';
  else if (qty <= 0) qtyMessage = 'Количество должно быть больше нуля';
  results.push(setError('quantity', qtyMessage));

  results.push(setError('delivery', delivery === '' ? 'Выберите способ доставки' : ''));
  results.push(setError('extras', ''));

  if (!results.every(Boolean)) return;

  const extras = getExtras().map(function (box) { return box.value; });
  result.innerHTML = '<h2>Заказ принят</h2>' +
    '<p>Товар: ' + product + ' × ' + qty + '</p><p>Доставка: ' + delivery + '</p>' +
    '<p>Услуги: ' + (extras.length ? extras.join(', ') : 'не выбраны') + '</p>' +
    '<p><b>К оплате: ' + calcTotal().toLocaleString('ru-RU') + ' ₸</b></p>';
  result.classList.add('show');
});
updateTotal();
