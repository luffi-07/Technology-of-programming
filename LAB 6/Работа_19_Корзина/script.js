const cart = document.querySelector("#cart");
const itemsCount = document.querySelector("#itemsCount");
const total = document.querySelector("#total");
const clearBtn = document.querySelector("#clearBtn");

let products = [
    { name: "Ноутбук", price: 250000, quantity: 1 },
    { name: "Мышь", price: 8000, quantity: 2 },
    { name: "Клавиатура", price: 15000, quantity: 1 }
];

function renderCart() {
    cart.innerHTML = "";

    products.forEach((product, index) => {
        const item = document.createElement("div");
        item.className = "cart-item";

        const name = document.createElement("span");
        name.className = "name";
        name.textContent = product.name + " — " + product.price + " ₸";

        const minus = document.createElement("button");
        minus.textContent = "−";

        const quantity = document.createElement("span");
        quantity.className = "qty";
        quantity.textContent = product.quantity;

        const plus = document.createElement("button");
        plus.textContent = "+";

        const remove = document.createElement("button");
        remove.textContent = "Удалить";

        minus.addEventListener("click", () => {
            if (product.quantity > 1) {
                product.quantity--;
            } else {
                products.splice(index, 1);
            }
            renderCart();
        });

        plus.addEventListener("click", () => {
            product.quantity++;
            renderCart();
        });

        remove.addEventListener("click", () => {
            products.splice(index, 1);
            renderCart();
        });

        item.append(name, minus, quantity, plus, remove);
        cart.append(item);
    });

    updateSummary();
}

function updateSummary() {
    let count = 0;
    let sum = 0;

    products.forEach(product => {
        count += product.quantity;
        sum += product.price * product.quantity;
    });

    itemsCount.textContent = count;
    total.textContent = sum;
}

clearBtn.addEventListener("click", () => {
    products = [];
    renderCart();
});

renderCart();
