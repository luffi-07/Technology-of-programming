// ui.js — всё, что связано с DOM. Никакой бизнес-логики.

import { CATEGORIES, findCategory } from "./budget.js";
import { formatMoney, formatSigned, formatDate, formatPercent } from "./format.js";

const $ = (selector) => document.querySelector(selector);

/** Заполнить список категорий в зависимости от типа операции. */
export function renderCategoryOptions(type) {
  const select = $("#category");
  select.replaceChildren();
  for (const cat of CATEGORIES[type]) {
    const option = document.createElement("option");
    option.value = cat.id;
    option.textContent = `${cat.icon} ${cat.name}`;
    select.append(option);
  }
}

/** Карточки: баланс, доходы, расходы. */
export function renderSummary({ income, expense, balance }) {
  $("#balance").textContent = formatMoney(balance);
  $("#income").textContent = formatMoney(income);
  $("#expense").textContent = formatMoney(expense);
  $("#balance-card").dataset.state = balance < 0 ? "negative" : "positive";
}

/** Прогресс месячного лимита. */
export function renderLimit(status, limit) {
  const box = $("#limit-box");
  const bar = $("#limit-bar");
  const text = $("#limit-text");
  box.dataset.status = status.status;

  if (!status.enabled) {
    bar.style.width = "0%";
    text.textContent = "Лимит не задан — установите его, чтобы следить за расходами.";
    return;
  }
  bar.style.width = `${status.percent}%`;
  if (status.status === "over") {
    text.textContent = `Лимит превышен на ${formatMoney(Math.abs(status.left))}`;
  } else {
    text.textContent = `Использовано ${status.percent}% · осталось ${formatMoney(status.left)}`;
  }
  $("#limit-input").value = limit;
}

/** Кольцевая диаграмма расходов (conic-gradient) и легенда. */
export function renderChart(groups, totalExpense) {
  const donut = $("#donut");
  const legend = $("#legend");
  legend.replaceChildren();

  if (groups.length === 0) {
    donut.style.background = "var(--track)";
    $("#donut-total").textContent = formatMoney(0);
    const empty = document.createElement("li");
    empty.className = "legend__empty";
    empty.textContent = "Расходов в этом месяце пока нет";
    legend.append(empty);
    return;
  }

  let start = 0;
  const parts = groups.map((g) => {
    const end = start + g.share * 100;
    const part = `${g.color} ${start.toFixed(2)}% ${end.toFixed(2)}%`;
    start = end;
    return part;
  });
  donut.style.background = `conic-gradient(${parts.join(", ")})`;
  $("#donut-total").textContent = formatMoney(totalExpense);

  for (const g of groups) {
    const li = document.createElement("li");
    li.className = "legend__item";

    const dot = document.createElement("span");
    dot.className = "legend__dot";
    dot.style.background = g.color;

    const name = document.createElement("span");
    name.className = "legend__name";
    name.textContent = g.name;

    const value = document.createElement("span");
    value.className = "legend__value";
    value.textContent = `${formatMoney(g.amount)} · ${formatPercent(g.share)}`;

    li.append(dot, name, value);
    legend.append(li);
  }
}

/** Список операций. */
export function renderTransactions(list) {
  const ul = $("#history");
  ul.replaceChildren();
  $("#empty").hidden = list.length > 0;

  for (const t of list) {
    const cat = findCategory(t.type, t.category);

    const li = document.createElement("li");
    li.className = "tx";

    const icon = document.createElement("span");
    icon.className = "tx__icon";
    icon.textContent = cat ? cat.icon : "•";
    icon.style.background = `${cat ? cat.color : "#64748b"}22`;

    const info = document.createElement("div");
    info.className = "tx__info";
    const title = document.createElement("strong");
    title.textContent = cat ? cat.name : "Без категории";
    const sub = document.createElement("small");
    sub.textContent = t.note ? `${t.note} · ${formatDate(t.date)}` : formatDate(t.date);
    info.append(title, sub);

    const amount = document.createElement("span");
    amount.className = `tx__amount tx__amount--${t.type}`;
    amount.textContent = formatSigned(t.amount, t.type);

    const del = document.createElement("button");
    del.className = "tx__delete";
    del.type = "button";
    del.dataset.id = t.id;
    del.title = "Удалить операцию";
    del.setAttribute("aria-label", "Удалить операцию");
    del.textContent = "✕";

    li.append(icon, info, amount, del);
    ul.append(li);
  }
}

/** Прочитать данные формы. */
export function readForm() {
  return {
    type: document.querySelector('input[name="type"]:checked').value,
    category: $("#category").value,
    amount: $("#amount").value,
    date: $("#date").value,
    note: $("#note").value,
  };
}

/** Показать ошибки под полями (или очистить). */
export function showErrors(errors = {}) {
  for (const field of ["amount", "date", "note", "category"]) {
    const el = $(`#error-${field}`);
    el.textContent = errors[field] || "";
    $(`#${field}`).classList.toggle("invalid", Boolean(errors[field]));
  }
}

export function resetForm(today) {
  $("#amount").value = "";
  $("#note").value = "";
  $("#date").value = today;
  showErrors();
  $("#amount").focus();
}

/** Уведомление-тост. */
let toastTimer;
export function showToast(message, kind = "ok") {
  const toast = $("#toast");
  toast.textContent = message;
  toast.dataset.kind = kind;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

export function setMonthTitle(text) {
  $("#month-title").textContent = text;
}

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  $("#theme-toggle").textContent = theme === "dark" ? "☀️" : "🌙";
}

export function setActiveFilter(type) {
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.filter === type);
  });
}
