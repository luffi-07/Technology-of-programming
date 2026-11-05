export function calculateDiscount(price, percent) {
  if (!Number.isFinite(price) || price < 0) throw new Error("Цена должна быть неотрицательным числом.");
  if (!Number.isFinite(percent) || percent < 0 || percent > 100) throw new Error("Скидка должна быть от 0 до 100%.");
  const discountAmount = price * percent / 100;
  return { discountAmount, finalPrice: price - discountAmount };
}
export function formatMoney(value) {
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 }).format(value) + " ₸";
}