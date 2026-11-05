import { changeCount, resetCount, getCount } from "./modules/counter.js";
import { createButtons, showCount } from "./modules/ui.js";
const countEl = document.querySelector("#count"), controls = document.querySelector("#controls"), message = document.querySelector("#message");
createButtons(controls, [{label:"+1",action:"plus"},{label:"−1",action:"minus"},{label:"Сбросить",action:"reset"}]);
showCount(countEl, getCount());
controls.addEventListener("click", event => {
 const action = event.target.dataset.action; if (!action) return;
 if (action === "plus") changeCount(1); else if (action === "minus") changeCount(-1); else resetCount();
 showCount(countEl, getCount()); message.textContent = "Значение успешно обновлено.";
});