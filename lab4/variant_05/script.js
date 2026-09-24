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

const form = document.getElementById('surveyForm');
const result = document.getElementById('result');
const comment = document.getElementById('comment');

// Творческое: счётчик символов комментария
comment.addEventListener('input', function () {
  document.getElementById('commentCount').textContent = comment.value.length + ' / 200';
});

form.addEventListener('submit', function (event) {
  event.preventDefault();
  result.classList.remove('show');

  const name = document.getElementById('name').value.trim();
  const rating = selectedRadio('rating');
  const text = comment.value.trim();

  const results = [];
  results.push(setError('name', name === '' ? 'Введите имя' : ''));
  results.push(setError('rating', rating === '' ? 'Поставьте оценку от 1 до 5' : ''));

  let commentMessage = '';
  if (text === '') commentMessage = 'Напишите комментарий';
  else if (text.length < 10) commentMessage = 'Комментарий слишком короткий: минимум 10 символов (сейчас ' + text.length + ')';
  results.push(setError('comment', commentMessage));

  results.push(setError('agree', document.getElementById('agree').checked ? '' : 'Подтвердите согласие на обработку ответа'));

  if (!results.every(Boolean)) return;

  result.innerHTML = '<h2>Спасибо за ответ!</h2>' +
    '<p>Имя: ' + name + '</p><p>Оценка: ' + '★'.repeat(Number(rating)) + '☆'.repeat(5 - Number(rating)) + ' (' + rating + '/5)</p>' +
    '<p>Комментарий: ' + text + '</p>';
  result.classList.add('show');
});
