// Вариант 10. Мини-дневник: запись с датой, просмотр, удаление (JSON + localStorage)
const KEY = "lab8_diary";
const form = document.querySelector("#form");
const dateInp = document.querySelector("#date");
const textInp = document.querySelector("#text");
const list = document.querySelector("#list");
const error = document.querySelector("#error");

function today() {
  const d = new Date();
  return new Date(d - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}
dateInp.value = today();

function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(d) ? d.filter(e => e && typeof e.date === "string" && typeof e.text === "string") : [];
  } catch { return []; }
}
let entries = load();

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(entries)); }
  catch { error.textContent = "Хранилище недоступно."; }
  render();
}

function render() {
  list.replaceChildren();
  if (!entries.length) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "Записей пока нет. Напишите первую.";
    list.append(li);
    return;
  }
  [...entries].sort((a, b) => b.date.localeCompare(a.date)).forEach(en => {
    const li = document.createElement("li");
    const box = document.createElement("div");
    const h = document.createElement("strong");
    h.textContent = new Date(en.date + "T00:00:00").toLocaleDateString("ru-RU");
    const p = document.createElement("div");
    p.textContent = en.text;
    p.style.whiteSpace = "pre-wrap";
    box.append(h, p);
    const del = document.createElement("button");
    del.textContent = "Удалить";
    del.className = "danger";
    del.addEventListener("click", () => { entries = entries.filter(x => x.id !== en.id); save(); });
    li.append(box, del);
    list.append(li);
  });
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const text = textInp.value.trim();
  if (!text) { error.textContent = "Введите текст записи."; return; }
  if (!dateInp.value) { error.textContent = "Выберите дату."; return; }
  error.textContent = "";
  entries.push({ id: Date.now() + Math.random(), date: dateInp.value, text });
  textInp.value = "";
  save();
});

render();
