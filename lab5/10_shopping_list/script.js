const itemInput = document.querySelector("#itemInput");
const addButton = document.querySelector("#addButton");
const clearButton = document.querySelector("#clearButton");
const shoppingList = document.querySelector("#shoppingList");
const counter = document.querySelector("#counter");

function updateCounter() {
  counter.textContent = `Товаров: ${shoppingList.children.length}`;
}

function addItem() {
  const itemName = itemInput.value.trim();

  if (itemName === "") {
    alert("Введите название товара.");
    return;
  }

  const li = document.createElement("li");
  li.textContent = itemName;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Удалить";
  deleteButton.className = "delete";

  deleteButton.addEventListener("click", () => {
    li.remove();
    updateCounter();
  });

  li.appendChild(deleteButton);
  shoppingList.appendChild(li);

  itemInput.value = "";
  itemInput.focus();
  updateCounter();
}

addButton.addEventListener("click", addItem);

itemInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addItem();
  }
});

clearButton.addEventListener("click", () => {
  shoppingList.innerHTML = "";
  updateCounter();
});