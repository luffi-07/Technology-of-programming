// ===== Общее ядро SPA: вкладки, активное состояние, localStorage, клавиатура =====
const KEY = "lab7_v14";
const content = document.querySelector("#content");
const tabs = [...document.querySelectorAll("[data-page]")];

// Создание элемента; текст вставляется через textContent (без innerHTML)
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}
function btn(text, onClick, cls) {
  const b = el("button", "btn " + (cls || ""), text);
  b.type = "button";
  b.addEventListener("click", onClick);
  return b;
}
function empty(text) { return el("p", "empty", text); }

let current, viewMap, go;
function render() {
  content.replaceChildren(viewMap[current]());
  if (typeof afterRender === "function") afterRender();
}
function init(v) {
  viewMap = v;
  const keys = Object.keys(v);
  go = function (k) {
    current = k;
    tabs.forEach(t => {
      const a = t.dataset.page === k;
      t.classList.toggle("active", a);
      t.setAttribute("aria-selected", a);
      t.tabIndex = a ? 0 : -1;
    });
    try { localStorage.setItem(KEY, k); } catch (e) {}
    render();
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => go(t.dataset.page));
    t.addEventListener("keydown", e => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const n = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
      n.focus();
      go(n.dataset.page);
    });
  });
  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  go(keys.includes(saved) ? saved : keys[0]);
}
// ===== Конец ядра =====

const items = [
  { id: 1, text: "Сдать лабораторную работу", list: "today" },
  { id: 2, text: "Подготовить доклад", list: "week" },
  { id: 3, text: "Купить учебник", list: "archive" }
];
let nextId = 4, error = "";
const names = { today: "Сегодня", week: "Неделя", archive: "Архив" };
// Куда можно перенести запись из каждого раздела
const moves = {
  today: [["week", "На неделю"], ["archive", "В архив"]],
  week: [["today", "На сегодня"], ["archive", "В архив"]],
  archive: [["today", "Вернуть на сегодня"], [null, "Удалить"]]
};

function afterRender() {
  tabs.forEach(t => {
    t.querySelector(".cnt").textContent = items.filter(i => i.list === t.dataset.page).length || "";
  });
}
function listView(list) {
  const w = el("div");
  const f = el("form");
  const inp = el("input");
  inp.type = "text";
  inp.placeholder = "Новая запись в «" + names[list] + "»";
  inp.setAttribute("aria-label", "Текст записи");
  const add = el("button", "btn", "Добавить");
  add.type = "submit";
  f.append(inp, add);
  f.addEventListener("submit", e => {
    e.preventDefault();
    const text = inp.value.trim();
    if (!text) { error = "Введите текст записи."; render(); return; }
    error = "";
    items.push({ id: nextId++, text, list });
    render();
  });
  w.append(f);
  if (error) { w.append(el("p", "err", error)); error = ""; }
  const sel = items.filter(i => i.list === list);
  if (!sel.length) { w.append(empty("В разделе «" + names[list] + "» пока нет записей.")); return w; }
  const st = el("div", "stack");
  sel.forEach(i => {
    const r = el("div", "row");
    const ctl = el("span");
    moves[list].forEach(([to, label]) => ctl.append(btn(label, () => {
      if (to) i.list = to; else items.splice(items.indexOf(i), 1);
      render();
    }, "ghost")));
    r.append(el("span", 0, i.text), ctl);
    st.append(r);
  });
  w.append(st);
  return w;
}
const views = {
  today: () => listView("today"),
  week: () => listView("week"),
  archive: () => listView("archive")
};
init(views);
