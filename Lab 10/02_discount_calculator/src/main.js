import { calculateDiscount, formatMoney } from "./modules/pricing.js";
import { readNumber } from "./modules/validation.js";
const result = document.querySelector("#result");
document.querySelector("#calculate").addEventListener("click", () => {
  try {
    const price = readNumber(document.querySelector("#price").value, "Цена");
    const discount = readNumber(document.querySelector("#discount").value, "Скидка");
    const data = calculateDiscount(price, discount);
    result.textContent = `Скидка: ${formatMoney(data.discountAmount)}. Итоговая цена: ${formatMoney(data.finalPrice)}.`;
  } catch (error) { result.textContent = error.message; }
});
document.querySelectorAll("input").forEach(input => input.addEventListener("input", () => { result.textContent = ""; }));