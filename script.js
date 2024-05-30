const calorieGoalInput = document.getElementById("calories");
const nameInput = document.getElementById("name");
const calorieAmountInput = document.getElementById("calorie-amount");
const addEntryButton = document.getElementById("add-entry");
const resultElement = document.getElementById("result");
const entryListElement = document.getElementById("entry-list");
let remainingCalories = parseInt(calorieGoalInput.value.trim());

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
      </tr>
    `;
    entryListElement.insertAdjacentHTML("beforeend", entryHTML);
    resultElement.textContent = `You have ${remainingCalories} calories remaining today.`;
  }
});