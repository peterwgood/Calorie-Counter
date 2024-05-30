const nameInput = document.getElementById("name");
const calorieAmountInput = document.getElementById("calorie-amount");
const addEntryButton = document.getElementById("add-entry");
const resultElement = document.getElementById("result");
const entryListElement = document.getElementById("entry-list");
const remainingCaloriesElement = document.getElementById("remaining-calories-value");
const resetButton = document.getElementById("reset-button"); // Get the reset button element
let remainingCalories = 1700;
let entries = [];

// Retrieve data from local storage
const storedData = localStorage.getItem("calorie-counter-data");
if (storedData) {
  const { remainingCalories: storedRemainingCalories, entries: storedEntries } = JSON.parse(storedData);
  remainingCalories = storedRemainingCalories;
  entries = storedEntries;
  renderEntryList();
  remainingCaloriesElement.textContent = remainingCalories; // Update remaining calories display
}

addEntryButton.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const calorieAmount = parseInt(calorieAmountInput.value.trim());
  if (name && calorieAmount) {
    remainingCalories -= calorieAmount;
    remainingCaloriesElement.textContent = remainingCalories; // Update remaining calories display
    const entryHTML = `
      <tr>
        <td>${name} - ${calorieAmount}</td>
        <td><button class="btn btn-danger delete-button">Delete</button></td>
      </tr>
    `;
    entryListElement.insertAdjacentHTML("beforeend", entryHTML);
    entries.push({ name, calorieAmount });
    // Save data to local storage for 24 hours
    const dataToSave = { remainingCalories, entries };
    const jsonData = JSON.stringify(dataToSave);
    localStorage.setItem("calorie-counter-data", jsonData);
    const expirationTime = new Date(Date.now() + 86400000); // 86400000ms = 24 hours
    localStorage.setItem("calorie-counter-data-expiration", expirationTime.getTime().toString());
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
      // Save updated data to local storage
      const dataToSave = { remainingCalories, entries };
      const jsonData = JSON.stringify(dataToSave);
      localStorage.setItem("calorie-counter-data", jsonData);
    }
  }
});

resetButton.addEventListener("click", () => { // Add event listener to reset button
  remainingCalories = 1700;
  entries = [];
  remainingCaloriesElement.textContent = remainingCalories; // Update remaining calories display
  entryListElement.innerHTML = ""; // Clear entry list
  localStorage.removeItem("calorie-counter-data"); // Remove data from local storage
  localStorage.removeItem("calorie-counter-data-expiration"); // Remove expiration time from local storage
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

// Clear local storage data after 24 hours
setInterval(() => {
  const expirationTime = localStorage.getItem("calorie-counter-data-expiration");
  if (expirationTime) {
    const currentTime = new Date().getTime();
    if (currentTime > parseInt(expirationTime)) {
      localStorage.removeItem("calorie-counter-data");
      localStorage.removeItem("calorie-counter-data-expiration");
    }
  }
}, 86400000); // 86400000ms = 24 hours