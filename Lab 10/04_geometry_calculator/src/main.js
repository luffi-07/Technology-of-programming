import { rectangle, circle } from "./modules/geometry.js";
import { round } from "./modules/format.js";
const shape = document.querySelector("#shape"), result = document.querySelector("#result");
const rectFields = document.querySelector("#rectangleFields"), circleFields = document.querySelector("#circleFields");
shape.addEventListener("change", () => { const isCircle = shape.value === "circle"; rectFields.hidden = isCircle; circleFields.hidden = !isCircle; result.textContent = ""; });
document.querySelector("#calculate").addEventListener("click", () => {
 try {
  const data = shape.value === "circle" ? circle(Number(document.querySelector("#radius").value)) : rectangle(Number(document.querySelector("#length").value), Number(document.querySelector("#width").value));
  result.textContent = `Площадь: ${round(data.area)}. Периметр: ${round(data.perimeter)}.`;
 } catch(e) { result.textContent = e.message; }
});