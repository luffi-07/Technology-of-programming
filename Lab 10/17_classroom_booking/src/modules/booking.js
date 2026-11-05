import { validateBooking } from "./validation.js";
const bookings=[];
export function getBookings(){return [...bookings];}
export function addBooking(data){
 validateBooking(data);
 const conflict=bookings.some(b=>b.room===data.room&&b.date===data.date&&data.start<b.end&&data.end>b.start);
 if(conflict) throw new Error("Это время уже занято в выбранной аудитории.");
 const item={...data,person:data.person.trim()};bookings.push(item);return item;
}