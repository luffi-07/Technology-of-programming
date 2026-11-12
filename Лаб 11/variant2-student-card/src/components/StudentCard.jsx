import { useState } from 'react';

/**
 * Карточка студента.
 * Props (только чтение): name, group, specialty, course, email.
 * State (локальное): showDetails — видимость подробностей,
 *                    isFavorite — отметка «в избранном».
 */
export default function StudentCard({ name, group, specialty, course, email }) {
  const [showDetails, setShowDetails] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <article className={`card ${isFavorite ? 'card--favorite' : ''}`}>
      <header className="card__header">
        <div className="card__avatar" aria-hidden="true">
          {name.charAt(0)}
        </div>
        <div>
          <h2 className="card__name">{name}</h2>
          <p className="card__meta">Группа: {group}</p>
          <p className="card__meta">Специальность: {specialty}</p>
        </div>
      </header>

      {showDetails && (
        <ul className="card__details">
          <li>Курс: {course}</li>
          <li>Email: {email}</li>
          <li>Статус: {isFavorite ? 'в избранном ★' : 'обычный'}</li>
        </ul>
      )}

      <div className="card__actions">
        <button onClick={() => setShowDetails((v) => !v)}>
          {showDetails ? 'Скрыть подробности' : 'Показать подробности'}
        </button>
        <button
          className={isFavorite ? 'btn--active' : ''}
          onClick={() => setIsFavorite((v) => !v)}
        >
          {isFavorite ? '★ Убрать из избранного' : '☆ В избранное'}
        </button>
      </div>
    </article>
  );
}
