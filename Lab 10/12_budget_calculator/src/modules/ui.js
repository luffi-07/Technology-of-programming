import { money } from "./format.js";
export function renderSummary(element, summary) {
 element.innerHTML = `<div>Доходы<strong>${money(summary.income)}</strong></div><div>Расходы<strong>${money(summary.expenses)}</strong></div><div>Баланс<strong>${money(summary.balance)}</strong></div>`;
}
export function renderOperations(element, operations) {
 element.innerHTML = "";
 operations.forEach(op => { const li=document.createElement("li"); li.textContent=`${op.type==="income"?"Доход":"Расход"}: ${op.description} — ${money(op.amount)}`; element.append(li); });
 if (!operations.length) element.textContent="Операций пока нет.";
}