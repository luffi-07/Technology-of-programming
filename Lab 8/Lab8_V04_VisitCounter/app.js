// Вариант 4. Счетчик посещений: общее число — localStorage, за вкладку — sessionStorage
const KEY = "lab8_visits";
const SKEY = "lab8_visits_session";
const countEl = document.querySelector("#count");
const lastEl = document.querySelector("#last");
const sessionEl = document.querySelector("#session");
const error = document.querySelector("#error");

function load(storage, key, fallback) {
  try {
    const data = JSON.parse(storage.getItem(key) || "null");
    return data && typeof data === "object" ? data : fallback;
  } catch { return fallback; }
}

let data = load(localStorage, KEY, { count: 0, last: null });
data.count = Number.isFinite(Number(data.count)) ? Number(data.count) : 0;
const previous = data.last;      // дата предыдущего посещения
data.last = new Date().toISOString();

let session = load(sessionStorage, SKEY, { count: 0 });
session.count = Number.isFinite(Number(session.count)) ? Number(session.count) : 0;

function show() {
  countEl.textContent = data.count;
  lastEl.textContent = previous
    ? "Предыдущее посещение: " + new Date(previous).toLocaleString("ru-RU")
    : "Это первое посещение.";
  sessionEl.textContent = "Открытий в этой вкладке: " + session.count;
}

data.count += 1;
session.count += 1;
try {
  localStorage.setItem(KEY, JSON.stringify(data));
  sessionStorage.setItem(SKEY, JSON.stringify(session));
} catch { error.textContent = "Хранилище недоступно (запустите через Live Server)."; }
show();

document.querySelector("#reset").addEventListener("click", () => {
  localStorage.removeItem(KEY);
  sessionStorage.removeItem(SKEY);
  data = { count: 0, last: null }; session = { count: 0 };
  lastEl.textContent = "Счётчик сброшен. Обновите страницу, чтобы начать заново.";
  countEl.textContent = 0;
  sessionEl.textContent = "";
});
