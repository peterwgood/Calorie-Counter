const calorieGoalInput = document.getElementById("calories");
const nameInput = document.getElementById("name");
const calorieAmountInput = document.getElementById("calorie-amount");
const addEntryButton = document.getElementById("add-entry");
const resultElement = document.getElementById("result");
const entryListElement = document.getElementById("entry-list");
let remainingCalories = parseInt(calorieGoalInput.value.trim());
let entries = [];

addEntryButton.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const calorieAmount = parseInt(calorieAmountInput.value.trim());
  if (name && calorieAmount) {
    remainingCalories -= calorieAmount;
    const entryHTML = `
      <tr>
        <td>${name}</td>
        <td>${calorieAmount}</td>
        <td>${remainingCalories}</td>
        <td><button class="btn btn-danger delete-button">Delete</button></td>
      </tr>
    `;
    entryListElement.insertAdjacentHTML("beforeend", entryHTML);
    resultElement.textContent = `You have ${remainingCalories} calories remaining today.`;
    entries.push({ name, calorieAmount });
  }
});

entryListElement.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-button")) {
    const rowElement = event.target.parentNode.parentNode;
    const entryName = rowElement.cells[0].textContent;
    const index = entries.findIndex((entry) => entry.name === entryName);
    if (index > -1) {
      const entry = entries.splice(index, 1)[0];
      remainingCalories += entry.calorieAmount;
      rowElement.remove();
    }
    resultElement.textContent = `You have ${remainingCalories} calories remaining today.`;
  }
});