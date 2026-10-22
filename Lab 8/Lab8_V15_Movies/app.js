// Вариант 15. Каталог фильмов с фильтрацией (localStorage)
const KEY = "lab8_movies";
const form = document.querySelector("#form");
const titleInp = document.querySelector("#movieTitle");
const genreInp = document.querySelector("#genre");
const ratingInp = document.querySelector("#rating");
const filter = document.querySelector("#filter");
const list = document.querySelector("#list");
const error = document.querySelector("#error");

function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(d)
      ? d.filter(m => m && typeof m.title === "string" && typeof m.genre === "string" && Number.isFinite(Number(m.rating)))
      : [];
  } catch { return []; }
}
let movies = load();

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(movies)); }
  catch { error.textContent = "Хранилище недоступно."; }
  render();
}

// Обновляет список жанров в фильтре, сохраняя выбранное значение
function updateFilter() {
  const current = filter.value;
  const genres = [...new Set(movies.map(m => m.genre))].sort();
  filter.replaceChildren(new Option("Все жанры", ""));
  genres.forEach(g => filter.append(new Option(g, g)));
  filter.value = genres.includes(current) ? current : "";
}

function render() {
  updateFilter();
  list.replaceChildren();
  const shown = movies.filter(m => !filter.value || m.genre === filter.value);
  if (!shown.length) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = movies.length ? "Нет фильмов в этом жанре." : "Каталог пуст. Добавьте первый фильм.";
    list.append(li);
    return;
  }
  shown.forEach(m => {
    const li = document.createElement("li");
    const info = document.createElement("span");
    const strong = document.createElement("strong");
    strong.textContent = m.title;
    info.append(strong, ` — ${m.genre}, рейтинг ${m.rating}`);
    const del = document.createElement("button");
    del.textContent = "Удалить";
    del.className = "danger";
    del.addEventListener("click", () => { movies = movies.filter(x => x.id !== m.id); save(); });
    li.append(info, del);
    list.append(li);
  });
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const title = titleInp.value.trim(), genre = genreInp.value.trim(), rating = Number(ratingInp.value);
  if (!title || !genre || ratingInp.value === "") { error.textContent = "Заполните все поля."; return; }
  if (!Number.isFinite(rating) || rating < 1 || rating > 10) { error.textContent = "Рейтинг должен быть от 1 до 10."; return; }
  error.textContent = "";
  movies.push({ id: Date.now() + Math.random(), title, genre, rating });
  titleInp.value = ""; genreInp.value = ""; ratingInp.value = "";
  save();
});
filter.addEventListener("change", render);

render();
