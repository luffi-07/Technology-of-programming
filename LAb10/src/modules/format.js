// format.js — форматирование сумм, дат и месяцев (по-русски).

const MONTHS = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

const MONTHS_SHORT = [
  "янв.", "февр.", "мар.", "апр.", "мая", "июн.",
  "июл.", "авг.", "сент.", "окт.", "нояб.", "дек.",
];

const moneyFormatter = new Intl.NumberFormat("ru-RU", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** 1234.5 -> "1 234,50 ₸" */
export function formatMoney(amount) {
  const value = Number.isFinite(amount) ? amount : 0;
  return `${moneyFormatter.format(value)} ₸`;
}

/** Со знаком: доход "+", расход "−". */
export function formatSigned(amount, type) {
  const sign = type === "income" ? "+" : "−";
  return `${sign}${formatMoney(amount)}`;
}

/** "2026-11-05" -> "5 нояб. 2026" */
export function formatDate(iso) {
  const [y, m, d] = String(iso).split("-").map(Number);
  if (!y || !m || !d) return String(iso);
  return `${d} ${MONTHS_SHORT[m - 1]} ${y}`;
}

/** "2026-11" -> "Ноябрь 2026" */
export function formatMonth(ym) {
  const [y, m] = String(ym).split("-").map(Number);
  if (!y || !m) return "Все время";
  return `${MONTHS[m - 1]} ${y}`;
}

/** 0.256 -> "26%" */
export function formatPercent(share) {
  return `${Math.round(share * 100)}%`;
}

/** Сегодняшняя дата "ГГГГ-ММ-ДД" по местному времени. */
export function todayISO() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}
