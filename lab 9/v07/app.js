// Вариант 7: данные пользователя /users/{id} — имя, город, компания.
// Творческая функция: счётчик запросов и время ответа сервера.
const BASE_URL = 'https://jsonplaceholder.typicode.com/users';

const form = document.querySelector('#form');
const input = document.querySelector('#user-id');
const loadBtn = document.querySelector('#load');
const retryBtn = document.querySelector('#retry');
const statusEl = document.querySelector('#status');
const statsEl = document.querySelector('#stats');
const results = document.querySelector('#results');

let requestCount = 0;
let lastId = null;

function setStatus(type, text) {
  statusEl.className = type;
  statusEl.textContent = text;
}

function addLine(parent, label, value) {
  const p = document.createElement('p');
  const strong = document.createElement('strong');
  strong.textContent = `${label}: `;
  p.append(strong, document.createTextNode(value ?? '—'));
  parent.append(p);
}

function renderUser(user) {
  results.replaceChildren();
  const card = document.createElement('article');
  card.className = 'card';

  const title = document.createElement('h2');
  title.textContent = user.name ?? '(имя не указано)';
  card.append(title);

  addLine(card, 'Город', user.address?.city);
  addLine(card, 'Компания', user.company?.name);
  results.append(card);
}

async function loadUser(id) {
  lastId = id;
  loadBtn.disabled = true;
  retryBtn.classList.add('hidden');
  setStatus('loading', 'Загрузка...');
  results.replaceChildren();
  requestCount += 1;

  const started = performance.now();
  try {
    const response = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`);
    if (response.status === 404) {
      setStatus('error', `Пользователь с ID ${id} не найден.`);
      return;
    }
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const user = await response.json();
    if (!user || typeof user !== 'object' || user.id === undefined) {
      setStatus('error', `Данные для ID ${id} отсутствуют.`);
      return;
    }

    renderUser(user);
    setStatus('success', 'Пользователь загружен.');
  } catch (error) {
    setStatus('error', `Ошибка загрузки: ${error.message}`);
    retryBtn.classList.remove('hidden');
  } finally {
    const ms = Math.round(performance.now() - started);
    statsEl.textContent = `Запросов: ${requestCount} · время ответа: ${ms} мс`;
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
  loadUser(id);
});

retryBtn.addEventListener('click', () => {
  if (lastId !== null) loadUser(lastId);
});
