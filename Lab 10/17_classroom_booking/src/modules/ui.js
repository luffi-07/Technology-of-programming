export function renderRooms(select,rooms){select.innerHTML="";rooms.forEach(r=>{const o=document.createElement("option");o.value=r.id;o.textContent=r.name;select.append(o);});}
export function renderBookings(container,items){
 container.innerHTML="";
 if(!items.length){container.textContent="Пока нет бронирований.";return;}
 items.forEach(b=>{const div=document.createElement("div");div.className="booking";div.textContent=`Аудитория ${b.room} • ${b.date} • ${b.start}–${b.end} • ${b.person}`;container.append(div);});
}