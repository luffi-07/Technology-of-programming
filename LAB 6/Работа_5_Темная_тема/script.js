const button = document.querySelector("#themeBtn");
const text = document.querySelector("#text");

button.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        button.textContent = "Светлая тема";
        text.textContent = "Сейчас включена темная тема.";
    } else {
        button.textContent = "Темная тема";
        text.textContent = "Сейчас включена светлая тема.";
    }
});
