// Запуск: node tests/test.mjs
// Проверка бизнес-логики (budget.js, format.js) без браузера.
import {
  validateTransaction, createTransaction, calculateTotals,
  calculateLimitStatus, groupExpensesByCategory, removeTransaction, filterByMonth,
} from "../src/modules/budget.js";
import { formatMoney, formatMonth, formatDate } from "../src/modules/format.js";

let passed = 0;
let failed = 0;
const norm = (s) => String(s).replace(/[  ]/g, " ");

function test(name, actual, expected) {
  const ok = norm(actual) === norm(expected);
  ok ? passed++ : failed++;
  console.log(`${ok ? "OK  " : "FAIL"} | ${name} | ожидалось: ${expected} | получено: ${actual}`);
}

const base = { type: "expense", category: "food", amount: "1500", date: "2026-11-05", note: "Обед" };

test("Тест 1: корректные данные", validateTransaction(base).valid, true);
test("Тест 2: пустая сумма", validateTransaction({ ...base, amount: "" }).errors.amount, "Введите сумму.");
test("Тест 3: сумма — не число", validateTransaction({ ...base, amount: "abc" }).errors.amount, "Сумма должна быть числом.");
test("Тест 4a: граничное значение 0", validateTransaction({ ...base, amount: "0" }).errors.amount, "Сумма должна быть больше нуля.");
test("Тест 4b: граничное значение 0,01", validateTransaction({ ...base, amount: "0,01" }).valid, true);
test("Тест 5: расход больше дохода -> отрицательный баланс",
  calculateTotals([
    createTransaction({ ...base, type: "income", category: "salary", amount: "1000" }),
    createTransaction({ ...base, amount: "2500" }),
  ]).balance, -1500);
test("Тест 6: отсутствие даты", validateTransaction({ ...base, date: "" }).errors.date, "Укажите дату.");
test("Тест 7: лимит превышен", calculateLimitStatus(120000, 100000).status, "over");
test("Тест 8: лимит почти исчерпан", calculateLimitStatus(85000, 100000).status, "warn");
test("Тест 9: удаление операции",
  removeTransaction([{ id: "a" }, { id: "b" }], "a").length, 1);
test("Тест 10: фильтр по месяцу",
  filterByMonth([{ date: "2026-10-30" }, { date: "2026-11-01" }], "2026-11").length, 1);
test("Тест 11: доли категорий в сумме = 1",
  Math.round(groupExpensesByCategory([
    { type: "expense", category: "food", amount: 30 },
    { type: "expense", category: "fun", amount: 70 },
  ]).reduce((s, g) => s + g.share, 0) * 100) / 100, 1);
test("Тест 12: форматирование суммы", formatMoney(1234.5), "1 234,50 ₸");
test("Тест 13: форматирование месяца", formatMonth("2026-11"), "Ноябрь 2026");
test("Тест 14: форматирование даты", formatDate("2026-11-05"), "5 нояб. 2026");

console.log(`\nИтог: пройдено ${passed}, провалено ${failed}`);
process.exit(failed ? 1 : 0);
