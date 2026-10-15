// ===== Общее ядро SPA: вкладки, активное состояние, localStorage, клавиатура =====
const KEY = "lab7_v11";
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

const products = [
  { id: 1, n: "Наушники", p: 15000 },
  { id: 2, n: "Клавиатура", p: 22000 },
  { id: 3, n: "Мышь", p: 9000 },
  { id: 4, n: "Веб-камера", p: 18000 },
  { id: 5, n: "Коврик для мыши", p: 3500 }
];
const cart = {};   // id -> количество
const money = n => n.toLocaleString("ru-RU") + " ₸";
const count = () => Object.values(cart).reduce((s, q) => s + q, 0);

function afterRender() {
  tabs.find(t => t.dataset.page === "cart").querySelector(".cnt").textContent = count() || "";
}
const views = {
  goods() {
    const g = el("div", "grid");
    products.forEach(p => {
      const c = el("article", "card");
      c.append(el("h3", 0, p.n), el("p", "price", money(p.p)),
        btn("В корзину", () => { cart[p.id] = (cart[p.id] || 0) + 1; render(); }));
      if (cart[p.id]) c.append(el("p", "muted", "В корзине: " + cart[p.id]));
      g.append(c);
    });
    return g;
  },
  cart() {
    const items = products.filter(p => cart[p.id]);
    if (!items.length) return empty("Корзина пуста. Добавьте товары на вкладке «Товары».");
    const w = el("div", "stack");
    let sum = 0;
    items.forEach(p => {
      sum += p.p * cart[p.id];
      const r = el("div", "row");
      const q = el("span", 0, String(cart[p.id]));
      const ctl = el("span");
      ctl.append(
        btn("−", () => { if (--cart[p.id] <= 0) delete cart[p.id]; render(); }, "ghost"),
        q,
        btn("+", () => { cart[p.id]++; render(); }, "ghost"),
        btn("Удалить", () => { delete cart[p.id]; render(); }, "ghost"));
      r.append(el("span", 0, p.n + " — " + money(p.p)), ctl, el("strong", 0, money(p.p * cart[p.id])));
      w.append(r);
    });
    w.append(el("h2", 0, "Итого: " + money(sum) + " (товаров: " + count() + ")"));
    return w;
  },
  about() {
    const c = el("article", "card");
    c.append(el("h3", 0, "О магазине"), el("p", 0, "Продаём компьютерную периферию. Доставка по городу за 1–2 дня."));
    return c;
  }
};
init(views);
