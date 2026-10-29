// Вариант 11: комментарии /posts/{id}/comments — авторы и тексты.
// Творческая функция: счётчик комментариев и время ответа сервера.
const BASE_URL = 'https://jsonplaceholder.typicode.com/posts';

const form = document.querySelector('#form');
const input = document.querySelector('#post-id');
const loadBtn = document.querySelector('#load');
const retryBtn = document.querySelector('#retry');
const statusEl = document.querySelector('#status');
const statsEl = document.querySelector('#stats');
const results = document.querySelector('#results');

let lastId = null;

function setStatus(type, text) {
  statusEl.className = type;
  statusEl.textContent = text;
}

function renderComments(comments) {
  results.replaceChildren();
  for (const c of comments) {
    const item = document.createElement('li');

    const author = document.createElement('span');
    author.className = 'title';
    author.textContent = c.name ?? '(без имени)';

    const email = document.createElement('div');
    email.className = 'meta';
    email.textContent = c.email ?? 'email не указан';

    const body = document.createElement('p');
    body.textContent = c.body ?? '(текст отсутствует)';

    item.append(author, email, body);
    results.append(item);
  }
}

async function loadComments(id) {
  lastId = id;
  loadBtn.disabled = true;
  retryBtn.classList.add('hidden');
  setStatus('loading', 'Загрузка...');
  results.replaceChildren();
  statsEl.textContent = '';

  const started = performance.now();
  try {
    const response = await fetch(`${BASE_URL}/${encodeURIComponent(id)}/comments`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const comments = await response.json();
    if (!Array.isArray(comments)) throw new Error('Неожиданный формат ответа');
    if (comments.length === 0) {
      setStatus('error', `Для публикации с ID ${id} комментарии не найдены.`);
      return;
    }

    renderComments(comments);
    const ms = Math.round(performance.now() - started);
    setStatus('success', `Загружено комментариев: ${comments.length}`);
    statsEl.textContent = `Публикация №${id} · время ответа: ${ms} мс`;
  } catch (error) {
    setStatus('error', `Ошибка загрузки: ${error.message}`);
    retryBtn.classList.remove('hidden');
  } finally {
    loadBtn.disabled = false;
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const id = Number(input.value);
  if (!Number.isInteger(id) || id < 1) {
    setStatus('error', 'Введите целое положительное число.');
    return;
  }
  loadComments(id);
});

retryBtn.addEventListener('click', () => {
  if (lastId !== null) loadComments(lastId);
});
