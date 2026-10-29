// Вариант 3: 10 задач /todos, выполненные выделяются визуально.
// Творческая функция: счётчик выполненных задач и время ответа сервера.
const API_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=10';

const loadBtn = document.querySelector('#load');
const retryBtn = document.querySelector('#retry');
const statusEl = document.querySelector('#status');
const statsEl = document.querySelector('#stats');
const results = document.querySelector('#results');

function setStatus(type, text) {
  statusEl.className = type;
  statusEl.textContent = text;
}

function renderTodos(todos) {
  results.replaceChildren();
  for (const todo of todos) {
    const item = document.createElement('li');
    if (todo.completed) item.classList.add('done');

    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = `${todo.id}. ${todo.title ?? '(без названия)'}`;

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = todo.completed ? '✔ Выполнена' : '⏳ Не выполнена';

    item.append(title, meta);
    results.append(item);
  }
}

async function loadTodos() {
  loadBtn.disabled = true;
  retryBtn.classList.add('hidden');
  setStatus('loading', 'Загрузка...');
  results.replaceChildren();
  statsEl.textContent = '';

  const started = performance.now();
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const todos = await response.json();
    if (!Array.isArray(todos)) throw new Error('Неожиданный формат ответа');
    if (todos.length === 0) {
      setStatus('success', 'Данных нет.');
      return;
    }

    renderTodos(todos);
    const done = todos.filter((t) => t.completed).length;
    const ms = Math.round(performance.now() - started);
    setStatus('success', `Загружено: ${todos.length}`);
    statsEl.textContent = `Выполнено: ${done} из ${todos.length} · время ответа: ${ms} мс`;
  } catch (error) {
    setStatus('error', `Ошибка загрузки: ${error.message}`);
    retryBtn.classList.remove('hidden');
  } finally {
    loadBtn.disabled = false;
  }
}

loadBtn.addEventListener('click', loadTodos);
retryBtn.addEventListener('click', loadTodos);
