// Вариант 3. Настройки темы и размера текста (localStorage)
const KEY = "lab8_settings";
const DEFAULTS = { theme: "light", size: 16 };
const themeSel = document.querySelector("#theme");
const sizeInp = document.querySelector("#size");
const sizeOut = document.querySelector("#sizeOut");
const error = document.querySelector("#error");

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!s || typeof s !== "object") return { ...DEFAULTS };
    const theme = s.theme === "dark" ? "dark" : "light";
    const size = Number(s.size);
    return { theme, size: size >= 12 && size <= 28 ? size : DEFAULTS.size };
  } catch { return { ...DEFAULTS }; }
}
let settings = load();

function apply() {
  document.documentElement.dataset.theme = settings.theme;
  document.documentElement.style.fontSize = settings.size + "px";
  themeSel.value = settings.theme;
  sizeInp.value = settings.size;
  sizeOut.textContent = settings.size + " px";
}

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(settings)); error.textContent = ""; }
  catch { error.textContent = "Хранилище недоступно."; }
  apply();
}

themeSel.addEventListener("change", () => { settings.theme = themeSel.value; save(); });
sizeInp.addEventListener("input", () => { settings.size = Number(sizeInp.value); save(); });
document.querySelector("#reset").addEventListener("click", () => {
  settings = { ...DEFAULTS }; localStorage.removeItem(KEY); apply();
});

apply();
