import { useState } from 'react';
import ThemeSwitch from './components/ThemeSwitch.jsx';
import ThemePreview from './components/ThemePreview.jsx';

const THEMES = [
  { id: 'light', label: 'Светлая' },
  { id: 'dark', label: 'Тёмная' },
  { id: 'ocean', label: 'Океан' },
];

const STORAGE_KEY = 'lab11-theme';

// Читаем сохранённую тему; если её нет или значение некорректно — берём первую.
function loadTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (THEMES.some((t) => t.id === saved)) return saved;
  } catch {
    /* localStorage недоступен — используем тему по умолчанию */
  }
  return THEMES[0].id;
}

export default function App() {
  const [theme, setTheme] = useState(loadTheme); // выбранная тема
  const [changes, setChanges] = useState(0); // счётчик смен темы

  const handleChange = (id) => {
    if (id === theme) return; // повторный выбор той же темы не считается сменой
    setTheme(id);
    setChanges((c) => c + 1);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* ignore */
    }
  };

  const handleReset = () => {
    setTheme(THEMES[0].id);
    setChanges(0);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  const current = THEMES.find((t) => t.id === theme);

  return (
    <div className={`page theme-${theme}`}>
      <main className="app">
        <h1>Переключатель темы</h1>
        <ThemeSwitch
          title="Выберите тему"
          themes={THEMES}
          selected={theme}
          onChange={handleChange}
        />
        <ThemePreview themeLabel={current.label} changes={changes} />
        <button className="reset" onClick={handleReset}>
          Сброс
        </button>
      </main>
    </div>
  );
}
