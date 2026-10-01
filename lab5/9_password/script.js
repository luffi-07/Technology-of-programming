const passwordInput = document.querySelector("#password");
const lengthRule = document.querySelector("#lengthRule");
const digitRule = document.querySelector("#digitRule");
const result = document.querySelector("#result");

function checkPassword(password) {
  return {
    length: password.length >= 8,
    digit: /\d/.test(password)
  };
}

function updateRule(element, condition) {
  element.classList.toggle("ok", condition);
  element.classList.toggle("bad", !condition);
}

passwordInput.addEventListener("input", () => {
  const password = passwordInput.value;
  const checks = checkPassword(password);

  updateRule(lengthRule, checks.length);
  updateRule(digitRule, checks.digit);

  if (checks.length && checks.digit) {
    result.textContent = "Пароль соответствует требованиям.";
    result.className = "ok";
  } else {
    result.textContent = "Пароль пока не соответствует требованиям.";
    result.className = "bad";
  }
});