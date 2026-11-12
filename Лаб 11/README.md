# Лабораторная работа № 11 — React: компоненты, props, state

Выполнены варианты **2, 3 и 4** (React + JavaScript, сборка Vite).

| Вариант | Папка | Содержание |
|---|---|---|
| 2 | `variant2-student-card` | Карточка студента: подробности показываются/скрываются |
| 3 | `variant3-theme-switch` | Переключатель темы (с сохранением в localStorage) |
| 4 | `variant4-mini-timer` | Мини-таймер: кнопки добавляют и уменьшают минуты |

Отчёт (схема компонентов, таблицы тестов, props/state, вывод, контрольные вопросы) — в файле `REPORT.md`.

## Запуск (для каждого варианта отдельно)

```bash
node -v && npm -v          # проверить установку Node.js
cd variant2-student-card   # или variant3-theme-switch / variant4-mini-timer
npm install
npm run dev                # открыть адрес из терминала (обычно http://localhost:5173)
```

Каталог `node_modules` в архив не включён — он создаётся командой `npm install`.
