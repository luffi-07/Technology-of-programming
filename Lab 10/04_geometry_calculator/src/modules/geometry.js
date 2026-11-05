export function rectangle(length, width) {
  validate(length, "Длина"); validate(width, "Ширина");
  return { area: length * width, perimeter: 2 * (length + width) };
}
export function circle(radius) {
  validate(radius, "Радиус");
  return { area: Math.PI * radius ** 2, perimeter: 2 * Math.PI * radius };
}
function validate(value, name) {
  if (!Number.isFinite(value) || value <= 0) throw new Error(`${name} должен быть больше нуля.`);
}