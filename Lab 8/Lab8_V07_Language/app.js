// Вариант 7. Выбор языка интерфейса (localStorage)
const KEY = "lab8_lang";
const DICT = {
  ru: { title: "Выбор языка", langLabel: "Язык интерфейса:", greeting: "Здравствуйте!", desc: "Выбранный язык сохраняется и восстанавливается после обновления страницы.", reset: "Сбросить язык" },
  kk: { title: "Тілді таңдау", langLabel: "Интерфейс тілі:", greeting: "Сәлеметсіз бе!", desc: "Таңдалған тіл сақталады және бетті жаңартқаннан кейін қайта көрсетіледі.", reset: "Тілді бастапқы күйге келтіру" },
  en: { title: "Language selection", langLabel: "Interface language:", greeting: "Hello!", desc: "The selected language is saved and restored after the page is reloaded.", reset: "Reset language" }
};
const select = document.querySelector("#lang");
const error = document.querySelector("#error");

function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) || "null");
    return d && typeof d.lang === "string" && DICT[d.lang] ? d.lang : "ru";
  } catch { return "ru"; }
}
let lang = load();

function apply() {
  const t = DICT[lang];
  document.documentElement.lang = lang;
  document.title = t.title;
  document.querySelector("#title").textContent = t.title;
  for (const id of ["langLabel", "greeting", "desc", "reset"]) {
    document.querySelector("#" + id).textContent = t[id];
  }
  select.value = lang;
}

select.addEventListener("change", () => {
  lang = DICT[select.value] ? select.value : "ru";
  try { localStorage.setItem(KEY, JSON.stringify({ lang })); error.textContent = ""; }
  catch { error.textContent = "Storage unavailable."; }
  apply();
});
document.querySelector("#reset").addEventListener("click", () => {
  localStorage.removeItem(KEY); lang = "ru"; apply();
});

apply();
