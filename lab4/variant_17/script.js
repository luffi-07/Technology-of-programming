// Показать/убрать ошибку у поля с data-field="key"
function setError(key, message) {
  const wrap = document.querySelector('[data-field="' + key + '"]');
  wrap.classList.toggle('invalid', message !== '');
  wrap.classList.toggle('valid', message === '');
  wrap.querySelector('.error').textContent = message;
  return message === '';
}
function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function selectedRadio(name) {
  const el = document.querySelector('input[name="' + name + '"]:checked');
  return el ? el.value : '';
}

const form = document.getElementById('regForm');
const result = document.getElementById('result');
const fields = {
  username: document.getElementById('username'),
  email: document.getElementById('email'),
  password: document.getElementById('password'),
  confirm: document.getElementById('confirm')
};

// Правила: возвращают текст ошибки или пустую строку
const rules = {
  username: function (value) {
    if (value === '') return 'Введите логин';
    if (!/^[A-Za-z0-9_]{3,}$/.test(value)) return 'Логин: минимум 3 символа, только латиница, цифры и _';
    return '';
  },
  email: function (value) {
    if (value === '') return 'Введите e-mail';
    return isEmail(value) ? '' : 'E-mail должен быть вида name@example.com';
  },
  password: function (value) {
    if (value.length < 8) return 'Пароль должен быть не короче 8 символов (сейчас ' + value.length + ')';
    if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return 'Добавьте в пароль хотя бы одну букву и одну цифру';
    return '';
  },
  confirm: function (value) {
    if (value === '') return 'Повторите пароль';
    return value === fields.password.value ? '' : 'Пароли не совпадают';
  }
};

function validateField(key) {
  const isPassword = key === 'password' || key === 'confirm';
  const value = isPassword ? fields[key].value : fields[key].value.trim();
  return setError(key, rules[key](value));
}

// Творческое: индикатор надёжности пароля
function updateMeter() {
  const value = fields.password.value;
  let score = 0;
  if (value.length >= 8) score++;
  if (value.length >= 12) score++;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  const levels = [
    { text: '—', color: '#ff6b8b' }, { text: 'слабый', color: '#ff6b8b' },
    { text: 'слабый', color: '#ff6b8b' }, { text: 'средний', color: '#ffd166' },
    { text: 'хороший', color: '#4ee1ff' }, { text: 'отличный', color: '#5df2b0' }
  ];
  const level = value === '' ? levels[0] : levels[score];
  const bar = document.getElementById('meterBar');
  bar.style.width = (value === '' ? 0 : score * 20) + '%';
  bar.style.background = level.color;
  document.getElementById('meterText').textContent = 'Надёжность: ' + level.text;
}

// Проверка при вводе
Object.keys(fields).forEach(function (key) {
  fields[key].addEventListener('input', function () {
    validateField(key);
    if (key === 'password') {
      updateMeter();
      if (fields.confirm.value !== '') validateField('confirm');
    }
  });
});

// Проверка при отправке
form.addEventListener('submit', function (event) {
  event.preventDefault();
  result.classList.remove('show');
  const ok = Object.keys(fields).map(validateField).every(Boolean);
  if (!ok) return;
  result.innerHTML = '<h2>Аккаунт создан</h2>' +
    '<p>Логин: ' + fields.username.value.trim() + '</p><p>E-mail: ' + fields.email.value.trim() + '</p>';
  result.classList.add('show');
});
