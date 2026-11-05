const operations = [];
export function addOperation(type, description, amount) {
 if (!["income","expense"].includes(type)) throw new Error("Выберите тип операции.");
 if (!description.trim()) throw new Error("Введите описание операции.");
 if (!Number.isFinite(amount) || amount <= 0) throw new Error("Сумма должна быть больше нуля.");
 operations.push({type, description:description.trim(), amount});
 return getSummary();
}
export function getOperations() { return [...operations]; }
export function getSummary() {
 const income = operations.filter(x=>x.type==="income").reduce((s,x)=>s+x.amount,0);
 const expenses = operations.filter(x=>x.type==="expense").reduce((s,x)=>s+x.amount,0);
 return {income, expenses, balance:income-expenses};
}