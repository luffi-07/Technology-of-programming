export function renderBooks(container, items) {
 container.innerHTML = "";
 if (!items.length) { container.textContent = "Книги не найдены."; return; }
 items.forEach(book => {
  const card = document.createElement("article"); card.className = "book";
  const title = document.createElement("h3"); title.textContent = book.title;
  const author = document.createElement("p"); author.textContent = `Автор: ${book.author}`;
  const year = document.createElement("p"); year.className = "muted"; year.textContent = `${book.year} год • ${book.genre}`;
  card.append(title,author,year); container.append(card);
 });
}