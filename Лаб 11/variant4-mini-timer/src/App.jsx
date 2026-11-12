import Timer from './components/Timer.jsx';

export default function App() {
  return (
    <main className="app">
      <h1>Мини-таймер</h1>
      <p className="app__hint">
        Начальное значение, шаг и максимум приходят через props. У каждого
        таймера своё состояние.
      </p>
      <div className="grid">
        <Timer label="Подготовка к занятию" initialMinutes={15} step={5} maxMinutes={60} />
        <Timer label="Перерыв" initialMinutes={10} step={1} maxMinutes={30} />
      </div>
    </main>
  );
}
