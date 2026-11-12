/**
 * Переключатель темы (дочерний компонент).
 * Props: title, themes — массив { id, label }, selected — id выбранной темы,
 *        onChange — обработчик, переданный родителем.
 * Собственного state нет: выбранная тема хранится в родителе (App),
 * а компонент только отображает её и сообщает о клике.
 */
export default function ThemeSwitch({ title, themes, selected, onChange }) {
  return (
    <section className="switch">
      <h2>{title}</h2>
      <div className="switch__buttons" role="group" aria-label={title}>
        {themes.map((theme) => (
          <button
            key={theme.id}
            className={theme.id === selected ? 'btn--active' : ''}
            aria-pressed={theme.id === selected}
            onClick={() => onChange(theme.id)}
          >
            {theme.label}
          </button>
        ))}
      </div>
    </section>
  );
}
