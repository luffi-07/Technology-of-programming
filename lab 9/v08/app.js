// Вариант 8: публикации загружаются один раз, поиск по заголовку — на клиенте.
// Творческая функция: подсветка найденного фрагмента (через <mark>, без innerHTML).
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

const loadBtn = document.querySelector('#load');
const retryBtn = document.querySelector('#retry');
const searchInput = document.querySelector('#search');
const statusEl = document.querySelector('#status');
const statsEl = document.querySelector('#stats');
const results = document.querySelector('#results');

let allPosts = [];

function setStatus(type, text) {
  statusEl.className = type;
  statusEl.textContent = text;
}

// Безопасная подсветка: строим текстовые узлы и <mark> вручную.
function appendHighlighted(parent, text, query) {
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  let pos = 0;
  while (q) {
    const idx = lower.indexOf(q, pos);
    if (idx === -1) break;
    parent.append(document.createTextNode(text.slice(pos, idx)));
    const mark = document.createElement('mark');
    mark.textContent = text.slice(idx, idx + q.length);
    parent.append(mark);
    pos = idx + q.length;
  }
  parent.append(document.createTextNode(text.slice(pos)));
}

function render() {
  const query = searchInput.value.trim();
  const filtered = allPosts.filter((p) =>
    String(p.title ?? '').toLowerCase().includes(query.toLowerCase())
  );

  results.replaceChildren();
  for (const post of filtered) {
    const item = document.createElement('li');
    const title = document.createElement('span');
    title.className = 'title';
    title.append(`${post.id}. `);
    appendHighlighted(title, String(post.title ?? '(без названия)'), query);
    item.append(title);
    results.append(item);
  }

  statsEl.textContent = `Найдено: ${filtered.length} из ${allPosts.length}`;
  if (filtered.length === 0) {
    setStatus('success', 'По вашему запросу ничего не найдено.');
  } else {
    setStatus('success', `Загружено: ${allPosts.length}`);
  }
}

async function loadPosts() {
  loadBtn.disabled = true;
  retryBtn.classList.add('hidden');
  searchInput.disabled = true;
  setStatus('loading', 'Загрузка...');
  results.replaceChildren();
  statsEl.textContent = '';

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const posts = await response.json();
    if (!Array.isArray(posts)) throw new Error('Неожиданный формат ответа');
    allPosts = posts;
    if (allPosts.length === 0) {
      setStatus('success', 'Данных нет.');
      return;
    }

    searchInput.disabled = false;
    render();
  } catch (error) {
    setStatus('error', `Ошибка загрузки: ${error.message}`);
    retryBtn.classList.remove('hidden');
  } finally {
    loadBtn.disabled = false;
  }
}

loadBtn.addEventListener('click', loadPosts);
retryBtn.addEventListener('click', loadPosts);
searchInput.addEventListener('input', render);
