// Вариант 16. Канбан-доска (localStorage). Структура: [{id, title, status}]
const KEY = "lab8_kanban";
const COLUMNS = [
  { status: "plan", name: "План" },
  { status: "work", name: "В работе" },
  { status: "done", name: "Готово" }
];
const form = document.querySelector("#form");
const input = document.querySelector("#card");
const board = document.querySelector("#board");
const error = document.querySelector("#error");
const valid = new Set(COLUMNS.map(c => c.status));

function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(d) ? d.filter(c => c && typeof c.title === "string" && valid.has(c.status)) : [];
  } catch { return []; }
}
let cards = load();

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(cards)); }
  catch { error.textContent = "Хранилище недоступно."; }
  render();
}

function move(card, step) {
  const i = COLUMNS.findIndex(c => c.status === card.status) + step;
  if (i < 0 || i >= COLUMNS.length) return;
  card.status = COLUMNS[i].status;   // перенос между колонками
  save();
}

function button(text, cls, handler) {
  const b = document.createElement("button");
  b.textContent = text;
  if (cls) b.className = cls;
  b.addEventListener("click", handler);
  return b;
}

function render() {
  board.replaceChildren();
  COLUMNS.forEach((col, idx) => {
    const section = document.createElement("section");
    section.className = "column";
    const items = cards.filter(c => c.status === col.status);
    const h = document.createElement("h2");
    h.textContent = col.name;
    const count = document.createElement("span");
    count.className = "muted";
    count.textContent = items.length;
    h.append(count);
    section.append(h);
    if (!items.length) {
      const p = document.createElement("p");
      p.className = "empty";
      p.textContent = "Пусто";
      section.append(p);
    }
    items.forEach(card => {
      const div = document.createElement("div");
      div.className = "kcard";
      const t = document.createElement("div");
      t.textContent = card.title;
      const actions = document.createElement("div");
      actions.className = "actions";
      if (idx > 0) actions.append(button("←", "ghost", () => move(card, -1)));
      if (idx < COLUMNS.length - 1) actions.append(button("→", "ghost", () => move(card, 1)));
      actions.append(button("Удалить", "danger", () => { cards = cards.filter(c => c.id !== card.id); save(); }));
      div.append(t, actions);
      section.append(div);
    });
    board.append(section);
  });
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const title = input.value.trim();
  if (!title) { error.textContent = "Введите название карточки."; return; }
  error.textContent = "";
  cards.push({ id: Date.now() + Math.random(), title, status: "plan" });
  input.value = "";
  save();
});

render();
