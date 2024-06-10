const nameInput = document.getElementById("name");
const calorieAmountInput = document.getElementById("calorie-amount");
const addEntryButton = document.getElementById("add-entry");
const resultElement = document.getElementById("result");
const entryListElement = document.getElementById("entry-list");
const remainingCaloriesElement = document.getElementById("remaining-calories-value");
const totalCaloriesUsedElement = document.getElementById("total-calories-used-value");
const resetButton = document.getElementById("reset-button");

let remainingCalories = 1700;
let totalCaloriesUsed = 0;
let entries = [];

// Retrieve data from local storage
const storedData = localStorage.getItem("calorie-counter-data");
if (storedData) {
  const { remainingCalories: storedRemainingCalories, totalCaloriesUsed: storedTotalCaloriesUsed, entries: storedEntries } = JSON.parse(storedData);
  remainingCalories = storedRemainingCalories;
  totalCaloriesUsed = storedTotalCaloriesUsed;
  entries = storedEntries;
  renderEntryList();
  remainingCaloriesElement.textContent = remainingCalories;
  totalCaloriesUsedElement.textContent = totalCaloriesUsed;
}

addEntryButton.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const calorieAmount = parseInt(calorieAmountInput.value.trim());
  if (name && !isNaN(calorieAmount)) {
    remainingCalories -= calorieAmount;
    totalCaloriesUsed += calorieAmount;
    remainingCaloriesElement.textContent = remainingCalories;
    totalCaloriesUsedElement.textContent = totalCaloriesUsed;
    const entryHTML = `
      <tr>
        <td>${name} - ${calorieAmount}</td>
        <td><button class="btn btn-danger delete-button">Delete</button></td>
      </tr>
    `;
    entryListElement.insertAdjacentHTML("beforeend", entryHTML);
    entries.push({ name, calorieAmount });
    // Save data to local storage
    const dataToSave = { remainingCalories, totalCaloriesUsed, entries };
    const jsonData = JSON.stringify(dataToSave);
    localStorage.setItem("calorie-counter-data", jsonData);
    // Clear both fields
    nameInput.value = "";
    calorieAmountInput.value = "";
  }
});

entryListElement.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-button")) {
    const rowElement = event.target.parentNode.parentNode;
    const entryName = rowElement.cells[0].textContent;
    const [name, calorieAmount] = entryName.split(" - ");
    const index = entries.findIndex((entry) => entry.name === name && entry.calorieAmount === parseInt(calorieAmount));
    if (index > -1) {
      const entry = entries.splice(index, 1)[0];
      remainingCalories += entry.calorieAmount;
      totalCaloriesUsed -= entry.calorieAmount;
      remainingCaloriesElement.textContent = remainingCalories;
      totalCaloriesUsedElement.textContent = totalCaloriesUsed;
      rowElement.remove();
      // Save updated data to local storage
      const dataToSave = { remainingCalories, totalCaloriesUsed, entries };
      const jsonData = JSON.stringify(dataToSave);
      localStorage.setItem("calorie-counter-data", jsonData);
    }
  }
});

resetButton.addEventListener("click", () => {
  remainingCalories = 1700;
  totalCaloriesUsed = 0;
  entries = [];
  remainingCaloriesElement.textContent = remainingCalories;
  totalCaloriesUsedElement.textContent = totalCaloriesUsed;
  entryListElement.innerHTML = ""; // Clear entry list
  localStorage.removeItem("calorie-counter-data"); // Remove data from local storage
});

function renderEntryList() {
  entryListElement.innerHTML = "";
  entries.forEach((entry) => {
    const entryHTML = `
      <tr>
        <td>${entry.name} - ${entry.calorieAmount}</td>
        <td><button class="btn btn-danger delete-button">Delete</button></td>
      </tr>
    `;
    entryListElement.insertAdjacentHTML("beforeend", entryHTML);
  });
}