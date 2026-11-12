/**
 * Блок предпросмотра (дочерний компонент).
 * Props: themeLabel — название текущей темы, changes — число смен темы.
 */
export default function ThemePreview({ themeLabel, changes }) {
  return (
    <section className="preview">
      <h2>Предпросмотр</h2>
      <p>
        Текущая тема: <strong>{themeLabel}</strong>
      </p>
      <p>Количество смен темы: {changes}</p>
      <p className="preview__text">
        Этот текст и фон страницы меняют цвета в зависимости от выбранной темы.
      </p>
    </section>
  );
}
