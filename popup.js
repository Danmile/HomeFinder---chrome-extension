const form = document.getElementById("subForm");
const price = document.getElementById("priceInput");
const searches = document.getElementById("searches");
const pRes = document.getElementById("response");
const dropdown = document.getElementById("dropDownNeighbor");
let addressValue;

const neighborhoods = [
  { id: 13, name: "רובע י" },
  { id: 15, name: "רובע הסיטי" },
  { id: 16, name: "רובע יא" },
  { id: 17, name: "רובע יג" },
  { id: 18, name: "רובע יב" },
];

// populate dropdown
neighborhoods.forEach((n) => {
  const option = document.createElement("option");
  option.value = n.id;
  option.textContent = n.name;
  dropdown.appendChild(option);
});

dropdown.addEventListener("change", (e) => {
  const selectedOption = e.target.options[e.target.selectedIndex];
  addressValue = { id: Number(e.target.value), text: selectedOption.text };
});

//Render the DOM by current items that is searched
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:4000/api/ads");
    const searchesData = await res.json();

    searches.innerHTML = ""; // clear UI before rendering
    searchesData.forEach((s) => {
      renderSearchItems(s.address, s.price);
    });
  } catch (err) {
    console.error("Error fetching searches:", err);
  }
});

form.onsubmit = async (e) => {
  e.preventDefault();
  pRes.innerHTML = ""; // Clear previous error messages

  // Get input values
  const priceValue = price.value.trim();

  // Validate inputs
  if (!addressValue || !priceValue) {
    pRes.innerHTML = "Please enter both address and price";
    return;
  }

  // Check for duplicates
  const isDuplicate = checkDuplicate(addressValue.text, priceValue);
  if (isDuplicate) {
    pRes.innerHTML = "This address and price already exists";
    return;
  }

  try {
    const res = await fetch("http://localhost:4000/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        addressId: addressValue.id,
        addressText: addressValue.text,
        price: priceValue,
      }),
    });
    const response = await res.json();
    if (res.ok) {
      renderSearchItems(addressValue.text, priceValue, response);
      dropdown.selectedIndex = 0;
      price.value = "";
    } else {
      pRes.innerHTML = "Someting went wrong";
    }
  } catch (err) {
    console.error("Submit error:", err);
    pRes.innerHTML = "Something went wrong";
  }
};
//Render and build the items UI
function renderSearchItems(addressValue, priceValue, response) {
  pRes.innerHTML = "";
  const item = document.createElement("div");
  item.className = "grid-item row";
  item.innerHTML = `
          <button class="buttonRed">X</button>
          <p>${priceValue} - ${addressValue}</p>
        `;
  // Attach data attributes
  item.dataset.address = addressValue;
  item.dataset.price = priceValue;
  // Add remove listener
  item.querySelector(".buttonRed").addEventListener("click", async () => {
    try {
      const removeRes = await fetch("http://localhost:4000/api/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: item.dataset.address,
          price: item.dataset.price,
        }),
      });
      const result = await removeRes.json();
      if (removeRes.status === 200) {
        item.remove();
        pRes.innerHTML = result.message;
        console.log("Deleted:", result.message);
      } else {
        pRes.innerHTML = `Error removing: ${result.error}`;
        console.error("Remove error:", result.error);
      }
    } catch (error) {
      pRes.innerHTML = `Error removing: ${error.message}`;
      console.error("Remove error:", error);
    }
  });
  searches.appendChild(item);
}

function checkDuplicate(addressValue, priceValue) {
  const existingItems = searches.querySelectorAll(".grid-item");
  let isDuplicate = false;
  for (const item of existingItems) {
    const existingAddress = item.dataset.address;
    const existingPrice = item.dataset.price;
    if (existingAddress === addressValue && existingPrice === priceValue) {
      isDuplicate = true;
      break;
    }
  }
  return isDuplicate;
}
