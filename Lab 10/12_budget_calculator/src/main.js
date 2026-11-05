import { addOperation, getOperations, getSummary } from "./modules/budget.js";
import { renderSummary, renderOperations } from "./modules/ui.js";
const message=document.querySelector("#message");
function update(){renderSummary(document.querySelector("#summary"),getSummary());renderOperations(document.querySelector("#list"),getOperations());}
document.querySelector("#add").addEventListener("click",()=>{
 try{addOperation(document.querySelector("#type").value,document.querySelector("#description").value,Number(document.querySelector("#amount").value));message.textContent="Операция добавлена.";message.className="";document.querySelector("#description").value="";document.querySelector("#amount").value="";update();}
 catch(e){message.textContent=e.message;message.className="error";}
});
document.querySelector("#type").addEventListener("change",()=>{message.textContent="";});update();