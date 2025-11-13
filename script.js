const foodList = document.getElementById("food-list");
const orderList = document.getElementById("order-list");

let selectedItems = [];     // Stores current selection
let lastSubmittedItems = []; // Stores submitted order

// Fetch food from backend
const fetchFoods = async () => {
  try {
    const res = await fetch("http://localhost:8089/FoodEntity");
    if (!res.ok) throw new Error("Failed to fetch data");
    const data = await res.json();

    renderFoodList(data);
  } catch (err) {
    foodList.innerHTML = `<p style="color:red">Error: ${err.message}</p>`;
  }
};

// Render food items with optional pre-selected ones
const renderFoodList = (foods) => {
  foodList.innerHTML = "";
  foods.forEach(food => {
    const div = document.createElement("div");
    div.className = "food-item";
    div.textContent = `${food.foodName} - $${food.price}`;

    // Pre-select if in selectedItems
    if (selectedItems.find(item => item.id === food.id)) {
      div.classList.add("selected");
    }

    div.onclick = () => {
      div.classList.toggle("selected");

      const exists = selectedItems.find(item => item.id === food.id);
      if (exists) {
        selectedItems = selectedItems.filter(item => item.id !== food.id);
      } else {
        selectedItems.push(food);
      }
    };

    foodList.appendChild(div);
  });
};

// Show specific page
const showPage = (id) => {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
};

// Home button → Go to Page 1
document.getElementById("home-btn").onclick = (e) => {
  e.preventDefault();
  selectedItems = []; // Clear previous selection
  fetchFoods();       // Re-render empty list
  showPage("page1");
};

// Edit button → Go to Page 1 with previous order pre-selected
document.getElementById("edit-btn").onclick = (e) => {
  e.preventDefault();
  if (lastSubmittedItems.length === 0) {
    alert("No previous order to edit.");
    return;
  }
  selectedItems = [...lastSubmittedItems]; // Restore selection
  fetchFoods();                            // Render with pre-selected
  showPage("page1");
};

// Page 1 → Page 2 (Review)
document.getElementById("submit-page1").onclick = () => {
  if (selectedItems.length === 0) {
    alert("Please select at least one item.");
    return;
  }

  orderList.innerHTML = "";
  selectedItems.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.foodName} - $${item.price}`;
    orderList.appendChild(li);
  });

  showPage("page2");
};

// Page 2 → Page 3 (Submit order)
document.getElementById("submit-page2").onclick = () => {
  lastSubmittedItems = [...selectedItems]; // Save for editing
  showPage("page3");
};

// Load initial food list
fetchFoods();
