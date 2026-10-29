// Вариант 5: 12 фотографий /photos — название и миниатюра.
// Если изображение недоступно, вместо него показывается текст.
// Творческая функция: избранное (хранится в памяти страницы, счётчик обновляется).
const API_URL = 'https://jsonplaceholder.typicode.com/photos?_limit=12';

const loadBtn = document.querySelector('#load');
const retryBtn = document.querySelector('#retry');
const statusEl = document.querySelector('#status');
const statsEl = document.querySelector('#stats');
const results = document.querySelector('#results');

const favorites = new Set();

function setStatus(type, text) {
  statusEl.className = type;
  statusEl.textContent = text;
}

function updateStats() {
  statsEl.textContent = `В избранном: ${favorites.size}`;
}

function isSafeUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

function createThumb(photo) {
  const fallback = () => {
    const box = document.createElement('div');
    box.className = 'fallback';
    box.textContent = 'Изображение недоступно';
    return box;
  };

  if (!photo.thumbnailUrl || !isSafeUrl(photo.thumbnailUrl)) return fallback();

  const img = document.createElement('img');
  img.className = 'thumb';
  img.alt = photo.title ?? 'Миниатюра';
  img.loading = 'lazy';
  img.src = photo.thumbnailUrl;
  img.addEventListener('error', () => img.replaceWith(fallback()));
  return img;
}

function createItem(photo) {
  const item = document.createElement('li');

  const title = document.createElement('div');
  title.className = 'meta';
  title.textContent = `${photo.id}. ${photo.title ?? '(без названия)'}`;

  const fav = document.createElement('button');
  fav.className = 'fav';
  fav.type = 'button';
  fav.textContent = favorites.has(photo.id) ? '★' : '☆';
  fav.setAttribute('aria-label', 'Добавить в избранное');
  fav.addEventListener('click', () => {
    if (favorites.has(photo.id)) favorites.delete(photo.id);
    else favorites.add(photo.id);
    fav.textContent = favorites.has(photo.id) ? '★' : '☆';
    updateStats();
  });

  item.append(createThumb(photo), title, fav);
  return item;
}

async function loadPhotos() {
  loadBtn.disabled = true;
  retryBtn.classList.add('hidden');
  setStatus('loading', 'Загрузка...');
  results.replaceChildren();

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const photos = await response.json();
    if (!Array.isArray(photos)) throw new Error('Неожиданный формат ответа');
    if (photos.length === 0) {
      setStatus('success', 'Фотографии не найдены.');
      return;
    }

    for (const photo of photos) results.append(createItem(photo));
    setStatus('success', `Загружено: ${photos.length}`);
    updateStats();
  } catch (error) {
    setStatus('error', `Ошибка загрузки: ${error.message}`);
    retryBtn.classList.remove('hidden');
  } finally {
    loadBtn.disabled = false;
  }
}

loadBtn.addEventListener('click', loadPhotos);
retryBtn.addEventListener('click', loadPhotos);
