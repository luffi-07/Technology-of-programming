// Вариант 1. Список покупок (localStorage)
const KEY = "lab8_shopping";
const form = document.querySelector("#form");
const input = document.querySelector("#item");
const list = document.querySelector("#list");
const error = document.querySelector("#error");

// Чтение с защитой от пустого хранилища и поврежденного JSON
function load() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(data) ? data.filter(x => x && typeof x.name === "string") : [];
  } catch { return []; }
}
let items = load();

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(items)); }
  catch { error.textContent = "Хранилище недоступно (запустите через Live Server)."; }
  render();
}

function render() {
  list.replaceChildren();
  if (!items.length) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "Список пуст. Добавьте первый товар.";
    list.append(li);
    return;
  }
  items.forEach(item => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = item.name;
    const del = document.createElement("button");
    del.textContent = "Удалить";
    del.className = "danger";
    del.addEventListener("click", () => { items = items.filter(i => i.id !== item.id); save(); });
    li.append(span, del);
    list.append(li);
  });
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const name = input.value.trim();
  if (!name) { error.textContent = "Введите название товара."; return; }
  error.textContent = "";
  items.push({ id: Date.now() + Math.random(), name });
  input.value = "";
  save();
});

document.querySelector("#clear").addEventListener("click", () => {
  items = []; localStorage.removeItem(KEY); render();
});

render();
