// Вариант 12. Таблица студентов (localStorage)
const KEY = "lab8_students";
const form = document.querySelector("#form");
const fio = document.querySelector("#fio");
const group = document.querySelector("#group");
const score = document.querySelector("#score");
const rows = document.querySelector("#rows");
const avg = document.querySelector("#avg");
const error = document.querySelector("#error");

function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(d)
      ? d.filter(s => s && typeof s.fio === "string" && typeof s.group === "string" && Number.isFinite(Number(s.score)))
      : [];
  } catch { return []; }
}
let students = load();

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(students)); }
  catch { error.textContent = "Хранилище недоступно."; }
  render();
}

function render() {
  rows.replaceChildren();
  if (!students.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 4; td.className = "empty"; td.textContent = "Студентов пока нет.";
    tr.append(td); rows.append(tr);
    avg.textContent = "";
    return;
  }
  students.forEach(s => {
    const tr = document.createElement("tr");
    for (const v of [s.fio, s.group, s.score]) {
      const td = document.createElement("td");
      td.textContent = v;
      tr.append(td);
    }
    const td = document.createElement("td");
    const del = document.createElement("button");
    del.textContent = "Удалить";
    del.className = "danger";
    del.addEventListener("click", () => { students = students.filter(x => x.id !== s.id); save(); });
    td.append(del); tr.append(td); rows.append(tr);
  });
  const mean = students.reduce((sum, s) => sum + Number(s.score), 0) / students.length;
  avg.textContent = "Средний балл: " + mean.toFixed(1);
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const name = fio.value.trim(), grp = group.value.trim(), sc = Number(score.value);
  if (!name || !grp || score.value === "") { error.textContent = "Заполните все поля."; return; }
  if (!Number.isFinite(sc) || sc < 0 || sc > 100) { error.textContent = "Балл должен быть от 0 до 100."; return; }
  error.textContent = "";
  students.push({ id: Date.now() + Math.random(), fio: name, group: grp, score: sc });
  fio.value = ""; group.value = ""; score.value = "";
  save();
});

render();
