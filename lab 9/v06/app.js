// Вариант 6: получить одну публикацию /posts/{id}, вывести заголовок и текст.
// Творческая функция: история последних запросов (кнопки быстрого повтора).
const BASE_URL = 'https://jsonplaceholder.typicode.com/posts';

const form = document.querySelector('#form');
const input = document.querySelector('#post-id');
const loadBtn = document.querySelector('#load');
const retryBtn = document.querySelector('#retry');
const statusEl = document.querySelector('#status');
const statsEl = document.querySelector('#stats');
const results = document.querySelector('#results');

const history = [];
let lastId = null;

function setStatus(type, text) {
  statusEl.className = type;
  statusEl.textContent = text;
}

function renderHistory() {
  statsEl.replaceChildren();
  if (history.length === 0) return;
  statsEl.append('Последние запросы: ');
  for (const id of history) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'secondary';
    b.textContent = `#${id}`;
    b.addEventListener('click', () => {
      input.value = id;
      loadPost(id);
    });
    statsEl.append(b, ' ');
  }
}

function renderPost(post) {
  results.replaceChildren();
  const card = document.createElement('article');
  card.className = 'card';

  const title = document.createElement('h2');
  title.textContent = post.title ?? '(без заголовка)';

  const body = document.createElement('p');
  body.textContent = post.body ?? '(текст отсутствует)';

  const meta = document.createElement('p');
  meta.className = 'meta';
  meta.textContent = `ID: ${post.id} · userId: ${post.userId ?? '—'}`;

  card.append(title, body, meta);
  results.append(card);
}

async function loadPost(id) {
  lastId = id;
  loadBtn.disabled = true;
  retryBtn.classList.add('hidden');
  setStatus('loading', 'Загрузка...');
  results.replaceChildren();

  try {
    const response = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`);
    if (response.status === 404) {
      setStatus('error', `Публикация с ID ${id} не найдена.`);
      return;
    }
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const post = await response.json();
    if (!post || typeof post !== 'object' || post.id === undefined) {
      setStatus('error', `Данные для ID ${id} отсутствуют.`);
      return;
    }

    renderPost(post);
    setStatus('success', 'Публикация загружена.');
    if (!history.includes(id)) {
      history.unshift(id);
      if (history.length > 5) history.pop();
    }
    renderHistory();
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
  loadPost(id);
});

retryBtn.addEventListener('click', () => {
  if (lastId !== null) loadPost(lastId);
});
