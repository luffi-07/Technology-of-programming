const value = document.querySelector("#value");
const plus = document.querySelector("#plus");
const minus = document.querySelector("#minus");
const reset = document.querySelector("#reset");
const message = document.querySelector("#message");

let count = 0;

function updateCounter() {
    value.textContent = count;
    message.textContent = count === 0 ? "Значение сброшено." : "Текущее значение: " + count;
}

plus.addEventListener("click", () => {
    count++;
    updateCounter();
});

minus.addEventListener("click", () => {
    count--;
    updateCounter();
});

reset.addEventListener("click", () => {
    count = 0;
    updateCounter();
});
