export const initialContacts = [{name:"Алия",phone:"+7 701 123 45 67"},{name:"Данияр",phone:"+7 777 234 56 78"},{name:"Мария",phone:"+7 705 345 67 89"}];
export function searchContacts(contacts, query) {
 const q=query.trim().toLowerCase();
 return contacts.filter(c=>`${c.name} ${c.phone}`.toLowerCase().includes(q));
}
export function createContact(name,phone) {
 if(!name.trim()) throw new Error("Введите имя контакта.");
 if(!/^\+?[0-9\s()-]{7,20}$/.test(phone.trim())) throw new Error("Введите корректный номер телефона.");
 return {name:name.trim(),phone:phone.trim()};
}