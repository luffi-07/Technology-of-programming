export function readNumber(value, field) {
  if (value.trim() === "") throw new Error(`Заполните поле «${field}».`);
  const number = Number(value);
  if (!Number.isFinite(number)) throw new Error(`Поле «${field}» должно быть числом.`);
  return number;
}