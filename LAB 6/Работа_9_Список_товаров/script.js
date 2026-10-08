const nameInput = document.querySelector("#nameInput");
const priceInput = document.querySelector("#priceInput");
const addBtn = document.querySelector("#addBtn");
const products = document.querySelector("#products");
const total = document.querySelector("#total");

function updateTotal() {
    let sum = 0;

    document.querySelectorAll(".product").forEach(product => {
        const price = Number(product.dataset.price);
        const quantity = Number(product.querySelector(".qty").textContent);
        sum += price * quantity;
    });

    total.textContent = sum;
}

function addProduct() {
    const name = nameInput.value.trim();
    const price = Number(priceInput.value);

    if (name === "" || price <= 0) {
        return;
    }

    const product = document.createElement("div");
    product.className = "product";
    product.dataset.price = price;

    const nameElement = document.createElement("span");
    nameElement.className = "name";
    nameElement.textContent = name + " — " + price + " ₸";

    const minus = document.createElement("button");
    minus.textContent = "−";

    const qty = document.createElement("span");
    qty.className = "qty";
    qty.textContent = "1";

    const plus = document.createElement("button");
    plus.textContent = "+";

    const remove = document.createElement("button");
    remove.textContent = "Удалить";

    minus.addEventListener("click", () => {
        let value = Number(qty.textContent);
        if (value > 1) {
            qty.textContent = value - 1;
            updateTotal();
        }
    });

    plus.addEventListener("click", () => {
        qty.textContent = Number(qty.textContent) + 1;
        updateTotal();
    });

    remove.addEventListener("click", () => {
        product.remove();
        updateTotal();
    });

    product.append(nameElement, minus, qty, plus, remove);
    products.append(product);

    nameInput.value = "";
    priceInput.value = "";
    updateTotal();
}

addBtn.addEventListener("click", addProduct);

priceInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addProduct();
    }
});
