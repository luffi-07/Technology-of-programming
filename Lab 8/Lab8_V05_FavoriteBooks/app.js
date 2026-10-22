// Вариант 5. Избранные книги (localStorage)
const KEY = "lab8_books";
const form = document.querySelector("#form");
const titleInp = document.querySelector("#bookTitle");
const authorInp = document.querySelector("#author");
const list = document.querySelector("#list");
const error = document.querySelector("#error");

function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(d) ? d.filter(b => b && typeof b.title === "string" && typeof b.author === "string") : [];
  } catch { return []; }
}
let books = load();

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(books)); }
  catch { error.textContent = "Хранилище недоступно."; }
  render();
}

function render() {
  list.replaceChildren();
  if (!books.length) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "Избранных книг пока нет.";
    list.append(li);
    return;
  }
  books.forEach(b => {
    const li = document.createElement("li");
    const info = document.createElement("span");
    const strong = document.createElement("strong");
    strong.textContent = b.title;
    info.append(strong, " — " + b.author);
    const del = document.createElement("button");
    del.textContent = "Удалить";
    del.className = "danger";
    del.addEventListener("click", () => { books = books.filter(x => x.id !== b.id); save(); });
    li.append(info, del);
    list.append(li);
  });
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const title = titleInp.value.trim();
  const author = authorInp.value.trim();
  if (!title || !author) { error.textContent = "Заполните название и автора."; return; }
  error.textContent = "";
  books.push({ id: Date.now() + Math.random(), title, author });
  titleInp.value = ""; authorInp.value = "";
  save();
});

render();
