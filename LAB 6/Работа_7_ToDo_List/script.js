const input = document.querySelector("#taskInput");
const addBtn = document.querySelector("#addBtn");
const taskList = document.querySelector("#taskList");
const clearBtn = document.querySelector("#clearBtn");
const count = document.querySelector("#count");

function updateCount() {
    count.textContent = "Всего задач: " + taskList.children.length;
}

function addTask() {
    const text = input.value.trim();

    if (text === "") {
        return;
    }

    const li = document.createElement("li");
    const span = document.createElement("span");
    const deleteBtn = document.createElement("button");

    span.textContent = text;
    deleteBtn.textContent = "Удалить";
    deleteBtn.className = "delete";

    span.addEventListener("click", () => {
        li.classList.toggle("done");
    });

    deleteBtn.addEventListener("click", () => {
        li.remove();
        updateCount();
    });

    li.append(span, deleteBtn);
    taskList.append(li);
    input.value = "";
    updateCount();
}

addBtn.addEventListener("click", addTask);

input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
});

clearBtn.addEventListener("click", () => {
    document.querySelectorAll("#taskList li.done").forEach(item => item.remove());
    updateCount();
});
