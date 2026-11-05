export const books = [
 {title:"Мастер и Маргарита",author:"Михаил Булгаков",year:1967,genre:"Роман"},
 {title:"Преступление и наказание",author:"Фёдор Достоевский",year:1866,genre:"Роман"},
 {title:"Тонкое искусство пофигизма",author:"Марк Мэнсон",year:2016,genre:"Саморазвитие"},
 {title:"Атомные привычки",author:"Джеймс Клир",year:2018,genre:"Саморазвитие"},
 {title:"Капитанская дочка",author:"Александр Пушкин",year:1836,genre:"Повесть"}
];
export function filterBooks(items, query) {
 const q = query.trim().toLowerCase();
 return items.filter(book => `${book.title} ${book.author} ${book.genre}`.toLowerCase().includes(q));
}
export function sortBooks(items, key) {
 return [...items].sort((a,b) => key === "year" ? a.year-b.year : a[key].localeCompare(b[key],"ru"));
}