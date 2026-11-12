import { useState } from 'react';

function formatTime(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Мини-таймер без автоматического отсчёта.
 * Props (только чтение): label, initialMinutes, step, maxMinutes.
 * State (локальное): minutes — текущее значение в минутах.
 */
export default function Timer({ label, initialMinutes, step, maxMinutes }) {
  const [minutes, setMinutes] = useState(initialMinutes);

  const canDecrease = minutes > 0;
  const canIncrease = minutes < maxMinutes;

  // Значение всегда ограничивается диапазоном [0, maxMinutes]
  const change = (delta) =>
    setMinutes((m) => Math.min(maxMinutes, Math.max(0, m + delta)));

  return (
    <section className="timer">
      <h2>{label}</h2>
      <p className="timer__value">{formatTime(minutes)}</p>
      <p className="timer__minutes">Минут: {minutes}</p>

      <div className="timer__buttons">
        <button onClick={() => change(-step)} disabled={!canDecrease}>
          −{step} мин
        </button>
        <button onClick={() => change(step)} disabled={!canIncrease}>
          +{step} мин
        </button>
        <button className="btn--reset" onClick={() => setMinutes(initialMinutes)}>
          Сброс
        </button>
      </div>

      {!canDecrease && <p className="timer__note">Минимум достигнут (0 минут).</p>}
      {!canIncrease && (
        <p className="timer__note">Максимум достигнут ({maxMinutes} минут).</p>
      )}
    </section>
  );
}
