export function renderContacts(container, contacts) {
 container.innerHTML="";
 if(!contacts.length){container.textContent="Контакты не найдены.";return;}
 contacts.forEach(c=>{const li=document.createElement("li");li.textContent=`${c.name} — ${c.phone}`;container.append(li);});
}