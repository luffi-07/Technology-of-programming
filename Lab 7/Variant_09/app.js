// ===== Общее ядро SPA: вкладки, активное состояние, localStorage, клавиатура =====
const KEY = "lab7_v9";
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

const courses = [
  { id: 1, n: "Основы JavaScript", h: 24, d: "Переменные, функции, DOM." },
  { id: 2, n: "HTML и CSS", h: 18, d: "Семантика, Flexbox, Grid." },
  { id: 3, n: "Алгоритмы", h: 30, d: "Сортировки, поиск, сложность." },
  { id: 4, n: "Базы данных", h: 28, d: "SQL, нормализация, индексы." }
];
const enrolled = new Set();

function afterRender() {
  tabs.find(t => t.dataset.page === "my").querySelector(".cnt").textContent = enrolled.size || "";
}
const views = {
  courses() {
    const g = el("div", "grid");
    courses.forEach(c => {
      const card = el("article", "card");
      const on = enrolled.has(c.id);
      const b = btn(on ? "Вы записаны" : "Записаться", () => { enrolled.add(c.id); render(); });
      b.disabled = on;
      card.append(el("h3", 0, c.n), el("p", 0, c.d), el("p", "muted", c.h + " ч"), b);
      g.append(card);
    });
    return g;
  },
  my() {
    const list = courses.filter(c => enrolled.has(c.id));
    if (!list.length) return empty("Вы пока не записаны ни на один курс. Откройте вкладку «Курсы».");
    const w = el("div", "stack");
    list.forEach(c => {
      const r = el("div", "row");
      r.append(el("span", 0, c.n + " (" + c.h + " ч)"), btn("Отписаться", () => { enrolled.delete(c.id); render(); }, "ghost"));
      w.append(r);
    });
    const total = list.reduce((s, c) => s + c.h, 0);
    w.append(el("p", "muted", "Всего часов: " + total));
    return w;
  },
  info() {
    const c = el("article", "card");
    c.append(el("h3", 0, "Как проходит обучение"),
      el("p", 0, "Занятия онлайн, два раза в неделю. Запись и отмена записи выполняются без перезагрузки страницы."),
      el("p", "muted", "Связь: courses@example.com"));
    return c;
  }
};
init(views);
