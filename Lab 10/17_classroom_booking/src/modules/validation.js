export function validateBooking({date,start,end,person}) {
 if(!date) throw new Error("Выберите дату.");
 if(!start||!end) throw new Error("Укажите время начала и окончания.");
 if(start>=end) throw new Error("Время окончания должно быть позже начала.");
 if(!person.trim()) throw new Error("Укажите, кто бронирует аудиторию.");
}