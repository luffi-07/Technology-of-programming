import { initialContacts, searchContacts, createContact } from "./modules/contacts.js";
import { loadContacts, saveContacts } from "./modules/storage.js";
import { renderContacts } from "./modules/ui.js";
let contacts=loadContacts(initialContacts);
const list=document.querySelector("#contacts"), search=document.querySelector("#search"), message=document.querySelector("#message");
function update(){renderContacts(list,searchContacts(contacts,search.value));}
document.querySelector("#add").addEventListener("click",()=>{
 try{const contact=createContact(document.querySelector("#name").value,document.querySelector("#phone").value);contacts.push(contact);saveContacts(contacts);document.querySelector("#name").value="";document.querySelector("#phone").value="";message.textContent="Контакт сохранён.";message.className="";update();}
 catch(e){message.textContent=e.message;message.className="error";}
});
search.addEventListener("input",update);update();