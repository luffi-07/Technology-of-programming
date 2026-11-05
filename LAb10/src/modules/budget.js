// budget.js — бизнес-логика бюджета (без работы с DOM).

export const CATEGORIES = {
  expense: [
    { id: "food", name: "Еда", icon: "🍽️", color: "#f97316" },
    { id: "transport", name: "Транспорт", icon: "🚌", color: "#3b82f6" },
    { id: "housing", name: "Жильё", icon: "🏠", color: "#8b5cf6" },
    { id: "shopping", name: "Покупки", icon: "🛍️", color: "#ec4899" },
    { id: "fun", name: "Развлечения", icon: "🎬", color: "#eab308" },
    { id: "health", name: "Здоровье", icon: "💊", color: "#ef4444" },
    { id: "study", name: "Учёба", icon: "📚", color: "#14b8a6" },
    { id: "other", name: "Другое", icon: "📦", color: "#64748b" },
  ],
  income: [
    { id: "salary", name: "Зарплата", icon: "💼", color: "#22c55e" },
    { id: "scholarship", name: "Стипендия", icon: "🎓", color: "#06b6d4" },
    { id: "freelance", name: "Подработка", icon: "💻", color: "#84cc16" },
    { id: "gift", name: "Подарок", icon: "🎁", color: "#f472b6" },
    { id: "other_in", name: "Другое", icon: "💰", color: "#a3a3a3" },
  ],
};

export const MAX_AMOUNT = 1_000_000_000;
export const MAX_NOTE_LENGTH = 60;

/** Найти категорию по типу и id. */
export function findCategory(type, categoryId) {
  return (CATEGORIES[type] || []).find((c) => c.id === categoryId) || null;
}

/** Преобразовать введённую строку в число (допускается запятая). */
export function parseAmount(value) {
  const text = String(value ?? "").trim().replace(/\s/g, "").replace(",", ".");
  if (text === "") return NaN;
  return Number(text);
}

/** Проверка данных формы. Возвращает { valid, errors: {поле: сообщение} }. */
export function validateTransaction({ type, category, amount, date, note }) {
  const errors = {};

  if (type !== "income" && type !== "expense") {
    errors.type = "Выберите тип операции.";
  }

  if (!findCategory(type, category)) {
    errors.category = "Выберите категорию.";
  }

  const sum = parseAmount(amount);
  if (String(amount ?? "").trim() === "") {
    errors.amount = "Введите сумму.";
  } else if (!Number.isFinite(sum)) {
    errors.amount = "Сумма должна быть числом.";
  } else if (sum <= 0) {
    errors.amount = "Сумма должна быть больше нуля.";
  } else if (sum > MAX_AMOUNT) {
    errors.amount = "Сумма слишком большая (максимум 1 000 000 000).";
  }

  if (!date) {
    errors.date = "Укажите дату.";
  } else if (Number.isNaN(new Date(date).getTime())) {
    errors.date = "Дата указана неверно.";
  }

  if (String(note ?? "").length > MAX_NOTE_LENGTH) {
    errors.note = `Заметка не длиннее ${MAX_NOTE_LENGTH} символов.`;
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/** Создать объект операции (данные должны быть уже проверены). */
export function createTransaction({ type, category, amount, date, note }) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    category,
    amount: Math.round(parseAmount(amount) * 100) / 100,
    date,
    note: String(note ?? "").trim(),
  };
}

/** Удалить операцию по id (возвращает новый массив). */
export function removeTransaction(list, id) {
  return list.filter((t) => t.id !== id);
}

/** Операции за месяц в формате "ГГГГ-ММ". */
export function filterByMonth(list, month) {
  if (!month) return [...list];
  return list.filter((t) => t.date.startsWith(month));
}

/** Фильтр по типу: all | income | expense. */
export function filterByType(list, type) {
  if (type === "income" || type === "expense") {
    return list.filter((t) => t.type === type);
  }
  return [...list];
}

/** Сортировка: новые сверху. */
export function sortByDateDesc(list) {
  return [...list].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
}

/** Итоги: доходы, расходы, баланс. */
export function calculateTotals(list) {
  let income = 0;
  let expense = 0;
  for (const t of list) {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  }
  income = Math.round(income * 100) / 100;
  expense = Math.round(expense * 100) / 100;
  return { income, expense, balance: Math.round((income - expense) * 100) / 100 };
}

/** Расходы по категориям для диаграммы. */
export function groupExpensesByCategory(list) {
  const map = new Map();
  for (const t of list) {
    if (t.type !== "expense") continue;
    map.set(t.category, (map.get(t.category) || 0) + t.amount);
  }
  const total = [...map.values()].reduce((s, v) => s + v, 0);
  return [...map.entries()]
    .map(([id, amount]) => {
      const cat = findCategory("expense", id);
      return {
        id,
        name: cat ? cat.name : id,
        color: cat ? cat.color : "#64748b",
        amount,
        share: total > 0 ? amount / total : 0,
      };
    })
    .sort((a, b) => b.amount - a.amount);
}

/** Состояние месячного лимита расходов. */
export function calculateLimitStatus(spent, limit) {
  if (!Number.isFinite(limit) || limit <= 0) {
    return { enabled: false, percent: 0, left: 0, status: "off" };
  }
  const percent = Math.min(100, Math.round((spent / limit) * 100));
  const left = Math.round((limit - spent) * 100) / 100;
  let status = "ok";
  if (spent > limit) status = "over";
  else if (spent / limit >= 0.8) status = "warn";
  return { enabled: true, percent, left, status };
}
