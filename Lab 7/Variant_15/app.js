// ===== Общее ядро SPA: вкладки, активное состояние, localStorage, клавиатура =====
const KEY = "lab7_v15";
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

const questions = [
  { q: "Что означает аббревиатура SPA?", o: ["Single Page Application", "Simple Program Access", "Static Page Archive"], a: 0 },
  { q: "Какой метод добавляет обработчик события?", o: ["onEvent()", "addEventListener()", "listen()"], a: 1 },
  { q: "Что безопаснее для вставки пользовательского текста?", o: ["innerHTML", "document.write", "textContent"], a: 2 },
  { q: "Как получить значение атрибута data-page у элемента?", o: ["el.dataset.page", "el.data.page", "el.page"], a: 0 },
  { q: "Почему fetch() к локальным файлам лучше запускать через HTTP-сервер?", o: ["Так быстрее", "Из file:// браузер блокирует запросы", "Иначе не работает CSS"], a: 1 }
];
const answers = new Array(questions.length).fill(null);
let result = null, error = "";

const views = {
  questions() {
    const w = el("div");
    questions.forEach((q, qi) => {
      const fs = el("fieldset");
      fs.append(el("legend", 0, (qi + 1) + ". " + q.q));
      q.o.forEach((text, oi) => {
        const lb = el("label", "opt");
        const r = el("input");
        r.type = "radio";
        r.name = "q" + qi;
        r.checked = answers[qi] === oi;
        r.addEventListener("change", () => { answers[qi] = oi; });
        lb.append(r, " " + text);
        fs.append(lb);
      });
      w.append(fs);
    });
    if (error) { w.append(el("p", "err", error)); error = ""; }
    w.append(btn("Проверить ответы", () => {
      const left = answers.filter(a => a === null).length;
      if (left) { error = "Остались вопросы без ответа: " + left + "."; render(); return; }
      result = answers.reduce((s, a, i) => s + (a === questions[i].a ? 1 : 0), 0);
      go("results");
    }));
    return w;
  },
  results() {
    if (result === null) {
      const w = el("div");
      w.append(empty("Результата пока нет. Ответьте на все вопросы и нажмите «Проверить ответы»."),
        btn("К вопросам", () => go("questions")));
      return w;
    }
    const w = el("div", "stack");
    const pct = Math.round(result / questions.length * 100);
    w.append(el("h2", 0, "Результат: " + result + " из " + questions.length + " (" + pct + "%)"));
    questions.forEach((q, i) => {
      const okAns = answers[i] === q.a;
      const r = el("div", "row");
      r.append(el("span", 0, (i + 1) + ". " + q.q),
        el("span", okAns ? "ok" : "bad", okAns ? "Верно" : "Неверно. Правильно: " + q.o[q.a]));
      w.append(r);
    });
    w.append(btn("Пройти заново", () => { answers.fill(null); result = null; go("questions"); }, "ghost"));
    return w;
  },
  rules() {
    const c = el("article", "card");
    c.append(el("h3", 0, "Правила"));
    ["В тесте " + questions.length + " вопросов, в каждом один верный ответ.",
     "Нужно ответить на все вопросы, иначе проверка не запустится.",
     "Результат появится на вкладке «Результаты»."].forEach(t => c.append(el("p", 0, t)));
    return c;
  }
};
init(views);
