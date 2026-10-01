const numberInput = document.querySelector("#number");
const calculateButton = document.querySelector("#calculate");
const clearButton = document.querySelector("#clear");
const result = document.querySelector("#result");

function calculateSum(n) {
  let sum = 0;
  const numbers = [];

  for (let i = 1; i <= n; i++) {
    numbers.push(i);
    sum += i;
  }

  return { numbers, sum };
}

calculateButton.addEventListener("click", () => {
  const n = Number(numberInput.value);

  if (!Number.isInteger(n) || n < 1) {
    result.textContent = "Ошибка: введите целое число N больше или равно 1.";
    return;
  }

  const data = calculateSum(n);
  result.innerHTML = `<p><strong>Числа:</strong> ${data.numbers.join(", ")}</p>
                      <p><strong>Сумма:</strong> ${data.sum}</p>`;
});

numberInput.addEventListener("input", () => {
  if (Number(numberInput.value) > 1000) {
    result.textContent = "Для удобства отображения рекомендуется N не больше 1000.";
  }
});

clearButton.addEventListener("click", () => {
  numberInput.value = "";
  result.textContent = "";
});