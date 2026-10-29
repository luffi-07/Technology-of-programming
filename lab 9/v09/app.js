// Вариант 9: загрузить /todos и фильтровать: все / выполненные / невыполненные.
// Творческая функция: количество задач прямо на кнопках фильтра.
const API_URL = 'https://jsonplaceholder.typicode.com/todos';

const loadBtn = document.querySelector('#load');
const retryBtn = document.querySelector('#retry');
const filterButtons = document.querySelectorAll('#filters button');
const statusEl = document.querySelector('#status');
const statsEl = document.querySelector('#stats');
const results = document.querySelector('#results');

const LABELS = { all: 'Все', done: 'Выполненные', undone: 'Невыполненные' };
let todos = [];
let currentFilter = 'all';

function setStatus(type, text) {
  statusEl.className = type;
  statusEl.textContent = text;
}

function applyFilter(list, filter) {
  if (filter === 'done') return list.filter((t) => t.completed);
  if (filter === 'undone') return list.filter((t) => !t.completed);
  return list;
}

function updateFilterButtons() {
  for (const btn of filterButtons) {
    const f = btn.dataset.filter;
    btn.textContent = `${LABELS[f]} (${applyFilter(todos, f).length})`;
    btn.disabled = todos.length === 0;
    btn.classList.toggle('active', f === currentFilter);
  }
}

function render() {
  const visible = applyFilter(todos, currentFilter);
  results.replaceChildren();

  for (const todo of visible) {
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

  updateFilterButtons();
  statsEl.textContent = `Показано: ${visible.length} из ${todos.length}`;
  if (visible.length === 0) setStatus('success', 'Нет задач для этого фильтра.');
  else setStatus('success', `Загружено: ${todos.length}`);
}

async function loadTodos() {
  loadBtn.disabled = true;
  retryBtn.classList.add('hidden');
  setStatus('loading', 'Загрузка...');
  results.replaceChildren();
  statsEl.textContent = '';

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('Неожиданный формат ответа');
    todos = data;
    if (todos.length === 0) {
      setStatus('success', 'Данных нет.');
      updateFilterButtons();
      return;
    }
    render();
  } catch (error) {
    setStatus('error', `Ошибка загрузки: ${error.message}`);
    retryBtn.classList.remove('hidden');
  } finally {
    loadBtn.disabled = false;
  }
}

for (const btn of filterButtons) {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;
    render();
  });
}
loadBtn.addEventListener('click', loadTodos);
retryBtn.addEventListener('click', loadTodos);
