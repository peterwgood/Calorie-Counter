const nameInput = document.getElementById("name");
const calorieAmountInput = document.getElementById("calorie-amount");
const addEntryButton = document.getElementById("add-entry");
const resultElement = document.getElementById("result");
const entryListElement = document.getElementById("entry-list");
const remainingCaloriesElement = document.getElementById("remaining-calories-value");
let remainingCalories = 1700;
let entries = [];

// Store data in sessionStorage
sessionStorage.setItem('remainingCalories', remainingCalories);
sessionStorage.setItem('entries', JSON.stringify(entries));

// Retrieve data from sessionStorage
const storedRemainingCalories = sessionStorage.getItem('remainingCalories');
if (storedRemainingCalories) {
  remainingCalories = parseInt(storedRemainingCalories);
  remainingCaloriesElement.textContent = remainingCalories;
}
const storedEntries = sessionStorage.getItem('entries');
if (storedEntries) {
  entries = JSON.parse(storedEntries);
  renderEntryList();
}

addEntryButton.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const calorieAmount = parseInt(calorieAmountInput.value.trim());
  if (name && calorieAmount) {
    remainingCalories -= calorieAmount;
    remainingCaloriesElement.textContent = remainingCalories;
    const entryHTML = `
      <tr>
        <td>${name} - ${calorieAmount}</td>
        <td><button class="btn btn-danger delete-button">Delete</button></td>
      </tr>
    `;
    entryListElement.insertAdjacentHTML("beforeend", entryHTML);
    entries.push({ name, calorieAmount });
    // Store updated data in sessionStorage
    sessionStorage.setItem('remainingCalories', remainingCalories);
    sessionStorage.setItem('entries', JSON.stringify(entries));
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
      remainingCaloriesElement.textContent = remainingCalories;
      rowElement.remove();
      // Store updated data in sessionStorage
      sessionStorage.setItem('remainingCalories', remainingCalories);
      sessionStorage.setItem('entries', JSON.stringify(entries));
    }
  }
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