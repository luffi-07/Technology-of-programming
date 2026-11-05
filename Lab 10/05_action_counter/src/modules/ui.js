export function createButtons(container, actions) {
 container.innerHTML = "";
 actions.forEach(({ label, action }) => { const button = document.createElement("button"); button.textContent = label; button.dataset.action = action; container.append(button); });
}
export function showCount(element, value) { element.textContent = value; }