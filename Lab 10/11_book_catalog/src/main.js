import { books, filterBooks, sortBooks } from "./modules/books.js";
import { renderBooks } from "./modules/ui.js";
const search = document.querySelector("#search"), sort = document.querySelector("#sort"), catalog = document.querySelector("#catalog"), info = document.querySelector("#info");
function update() { const found = sortBooks(filterBooks(books, search.value), sort.value); renderBooks(catalog, found); info.textContent = `Найдено книг: ${found.length}`; }
search.addEventListener("input", update); sort.addEventListener("change", update); update();