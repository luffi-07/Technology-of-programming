// storage.js — сохранение данных в localStorage (творческое задание).

const KEYS = {
  transactions: "budget-lab10:transactions",
  limit: "budget-lab10:limit",
  theme: "budget-lab10:theme",
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function loadTransactions() {
  const data = read(KEYS.transactions, []);
  return Array.isArray(data) ? data : [];
}

export function saveTransactions(list) {
  return write(KEYS.transactions, list);
}

export function loadLimit() {
  const value = Number(read(KEYS.limit, 0));
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function saveLimit(limit) {
  return write(KEYS.limit, limit);
}

export function loadTheme() {
  return read(KEYS.theme, "light") === "dark" ? "dark" : "light";
}

export function saveTheme(theme) {
  return write(KEYS.theme, theme);
}
