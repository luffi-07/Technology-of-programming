// Вариант 4: первые 15 альбомов /albums — номер и название.
// Творческая функция: счётчик запросов и индикатор времени ответа.
const API_URL = 'https://jsonplaceholder.typicode.com/albums?_limit=15';

const loadBtn = document.querySelector('#load');
const retryBtn = document.querySelector('#retry');
const statusEl = document.querySelector('#status');
const statsEl = document.querySelector('#stats');
const results = document.querySelector('#results');

let requestCount = 0;

function setStatus(type, text) {
  statusEl.className = type;
  statusEl.textContent = text;
}

async function loadAlbums() {
  loadBtn.disabled = true;
  retryBtn.classList.add('hidden');
  setStatus('loading', 'Загрузка...');
  results.replaceChildren();
  requestCount += 1;

  const started = performance.now();
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const albums = await response.json();
    if (!Array.isArray(albums)) throw new Error('Неожиданный формат ответа');
    if (albums.length === 0) {
      setStatus('success', 'Альбомы не найдены.');
      return;
    }

    for (const album of albums) {
      const item = document.createElement('li');
      const title = document.createElement('span');
      title.className = 'title';
      title.textContent = `№${album.id}. ${album.title ?? '(без названия)'}`;
      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.textContent = `Пользователь: ${album.userId ?? '—'}`;
      item.append(title, meta);
      results.append(item);
    }

    const ms = Math.round(performance.now() - started);
    setStatus('success', `Загружено: ${albums.length}`);
    statsEl.textContent = `Запросов за сессию: ${requestCount} · время ответа: ${ms} мс`;
  } catch (error) {
    setStatus('error', `Ошибка загрузки: ${error.message}`);
    statsEl.textContent = `Запросов за сессию: ${requestCount}`;
    retryBtn.classList.remove('hidden');
  } finally {
    loadBtn.disabled = false;
  }
}

loadBtn.addEventListener('click', loadAlbums);
retryBtn.addEventListener('click', loadAlbums);
