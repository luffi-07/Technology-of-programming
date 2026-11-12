import StudentCard from './components/StudentCard.jsx';

const students = [
  {
    id: 1,
    name: 'Алия Нурланова',
    group: 'ИС-21',
    specialty: 'Информационные системы',
    course: 3,
    email: 'aliya.n@example.edu',
  },
  {
    id: 2,
    name: 'Данияр Сейтказин',
    group: 'ПО-22',
    specialty: 'Программная инженерия',
    course: 2,
    email: 'daniyar.s@example.edu',
  },
  {
    id: 3,
    name: 'Мадина Ахметова',
    group: 'ВТ-20',
    specialty: 'Вычислительная техника',
    course: 4,
    email: 'madina.a@example.edu',
  },
];

export default function App() {
  return (
    <main className="app">
      <h1>Карточки студентов</h1>
      <p className="app__hint">
        У каждой карточки своё состояние: раскройте одну — остальные не изменятся.
      </p>
      <div className="grid">
        {students.map((s) => (
          <StudentCard
            key={s.id}
            name={s.name}
            group={s.group}
            specialty={s.specialty}
            course={s.course}
            email={s.email}
          />
        ))}
      </div>
    </main>
  );
}
