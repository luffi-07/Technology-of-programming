// main.js — точка входа: связывает модули и обрабатывает события.

import {
  validateTransaction, createTransaction, removeTransaction,
  filterByMonth, filterByType, sortByDateDesc,
  calculateTotals, groupExpensesByCategory, calculateLimitStatus,
} from "./modules/budget.js";
import { formatMonth, todayISO } from "./modules/format.js";
import {
  loadTransactions, saveTransactions, loadLimit, saveLimit, loadTheme, saveTheme,
} from "./modules/storage.js";
import * as ui from "./modules/ui.js";

const state = {
  transactions: loadTransactions(),
  month: todayISO().slice(0, 7),
  filter: "all",
  limit: loadLimit(),
};

/** Полная перерисовка интерфейса из состояния. */
function render() {
  const monthList = filterByMonth(state.transactions, state.month);
  const totals = calculateTotals(monthList);

  ui.setMonthTitle(formatMonth(state.month));
  ui.renderSummary(totals);
  ui.renderLimit(calculateLimitStatus(totals.expense, state.limit), state.limit);
  ui.renderChart(groupExpensesByCategory(monthList), totals.expense);
  ui.renderTransactions(sortByDateDesc(filterByType(monthList, state.filter)));
  ui.setActiveFilter(state.filter);
}

function persist() {
  if (!saveTransactions(state.transactions)) {
    ui.showToast("Не удалось сохранить данные в браузере", "error");
  }
}

// --- События -------------------------------------------------------------

// 1. Отправка формы
document.querySelector("#tx-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = ui.readForm();
  const { valid, errors } = validateTransaction(data);
  ui.showErrors(errors);
  if (!valid) {
    ui.showToast("Проверьте правильность заполнения формы", "error");
    return;
  }
  state.transactions.push(createTransaction(data));
  persist();
  // переключаемся на месяц добавленной операции
  state.month = data.date.slice(0, 7);
  document.querySelector("#month").value = state.month;
  ui.resetForm(todayISO());
  render();
  ui.showToast("Операция добавлена ✓");
});

// 2. Смена типа (доход/расход) — обновляет список категорий
document.querySelectorAll('input[name="type"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    ui.renderCategoryOptions(radio.value);
  });
});

// 3. Удаление операции (делегирование событий)
document.querySelector("#history").addEventListener("click", (event) => {
  const button = event.target.closest(".tx__delete");
  if (!button) return;
  state.transactions = removeTransaction(state.transactions, button.dataset.id);
  persist();
  render();
  ui.showToast("Операция удалена");
});

// 4. Выбор месяца
document.querySelector("#month").addEventListener("change", (event) => {
  state.month = event.target.value;
  render();
});

// 5. Фильтр по типу
document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    state.filter = chip.dataset.filter;
    render();
  });
});

// 6. Месячный лимит
document.querySelector("#limit-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const value = Number(document.querySelector("#limit-input").value.replace(",", "."));
  if (!Number.isFinite(value) || value < 0) {
    ui.showToast("Введите корректную сумму лимита", "error");
    return;
  }
  state.limit = value;
  saveLimit(value);
  render();
  ui.showToast(value > 0 ? "Лимит сохранён ✓" : "Лимит отключён");
});

// 7. Тема оформления
document.querySelector("#theme-toggle").addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  ui.applyTheme(next);
  saveTheme(next);
});

// 8. Очистка всех данных
document.querySelector("#clear-all").addEventListener("click", () => {
  if (!confirm("Удалить все операции? Это действие нельзя отменить.")) return;
  state.transactions = [];
  persist();
  render();
  ui.showToast("Все данные удалены");
});

// 9. Демо-данные
document.querySelector("#demo").addEventListener("click", () => {
  const ym = state.month;
  const demo = [
    ["income", "scholarship", 45000, "01", "Стипендия"],
    ["income", "freelance", 80000, "05", "Заказ на сайт"],
    ["expense", "housing", 60000, "02", "Аренда комнаты"],
    ["expense", "food", 18500, "04", "Продукты"],
    ["expense", "food", 4200, "09", "Кафе с друзьями"],
    ["expense", "transport", 6000, "06", "Проездной"],
    ["expense", "shopping", 25000, "10", "Кроссовки"],
    ["expense", "fun", 7500, "12", "Кино и боулинг"],
    ["expense", "study", 9000, "13", "Книги"],
    ["expense", "health", 3500, "14", "Витамины"],
  ];
  for (const [type, category, amount, day, note] of demo) {
    state.transactions.push(createTransaction({ type, category, amount, date: `${ym}-${day}`, note }));
  }
  persist();
  render();
  ui.showToast("Демо-данные добавлены");
});

// --- Запуск --------------------------------------------------------------

ui.applyTheme(loadTheme());
ui.renderCategoryOptions("expense");
document.querySelector("#date").value = todayISO();
document.querySelector("#month").value = state.month;
render();
