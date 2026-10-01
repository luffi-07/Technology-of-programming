const countElement = document.querySelector("#count");
const message = document.querySelector("#message");
const plusButton = document.querySelector("#plus");
const minusButton = document.querySelector("#minus");
const resetButton = document.querySelector("#reset");

let count = 0;

function updateCounter() {
  countElement.textContent = count;
  message.textContent = `Текущее значение: ${count}`;
}

plusButton.addEventListener("click", () => {
  count++;
  updateCounter();
});

minusButton.addEventListener("click", () => {
  count--;
  updateCounter();
});

resetButton.addEventListener("click", () => {
  count = 0;
  updateCounter();
});

// Дополнительная функция: двойной клик по числу устанавливает счётчик в 10.
countElement.addEventListener("dblclick", () => {
  count = 10;
  updateCounter();
});