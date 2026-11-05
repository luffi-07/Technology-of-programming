import { rooms } from "./modules/rooms.js";
import { addBooking, getBookings } from "./modules/booking.js";
import { renderRooms, renderBookings } from "./modules/ui.js";
const room=document.querySelector("#room"), message=document.querySelector("#message");
renderRooms(room,rooms);renderBookings(document.querySelector("#bookings"),getBookings());
document.querySelector("#book").addEventListener("click",()=>{
 const data={room:room.value,date:document.querySelector("#date").value,start:document.querySelector("#start").value,end:document.querySelector("#end").value,person:document.querySelector("#person").value};
 try{addBooking(data);message.textContent="Аудитория успешно забронирована.";message.className="success";renderBookings(document.querySelector("#bookings"),getBookings());}
 catch(e){message.textContent=e.message;message.className="error";}
});
document.querySelector("#room").addEventListener("change",()=>{message.textContent="";});