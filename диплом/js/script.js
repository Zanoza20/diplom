// Get references to elements
const sortIcon = document.getElementById("sortIcon");
const sortMenu = document.getElementById("sortMenu");
const cartIcon = document.getElementById("cartIcon");
const cartMenu = document.getElementById("cartMenu");
const searchField = document.getElementById("searchField");
const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("registerButton");
const menuLogin = document.getElementById("menuLogin");
const menuRegister = document.getElementById("menuRegister");

// Toggle sort menu visibility
sortIcon.addEventListener("click", function() {
    sortMenu.style.display = (sortMenu.style.display === "block") ? "none" : "block";
});

// Toggle cart menu visibility
cartIcon.addEventListener("click", function() {
    cartMenu.style.display = (cartMenu.style.display === "block") ? "none" : "block";
});

// Display login modal
loginButton.addEventListener("click", function() {
    menuLogin.style.display = "block";
});

// Display register modal
registerButton.addEventListener("click", function() {
    menuRegister.style.display = "block";
});

// Close modal on outside click
window.onclick = function(event) {
    if (event.target === menuLogin) {
        menuLogin.style.display = "none";
    }
    if (event.target === menuRegister) {
        menuRegister.style.display = "none";
    }
    if (event.target === sortMenu) {
        sortMenu.style.display = "none";
    }
    if (event.target === cartMenu) {
        cartMenu.style.display = "none";
    }
};

// Function to fetch and display items
async function fetchItems() {
    try {
        const response = await fetch("json/goods.json");
        const data = await response.json();
        const goodsContainer = document.getElementById("goods");
        goodsContainer.innerHTML = "";

        data.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("item");
            itemDiv.innerHTML = `
                <img src="${item.img}" alt="${item.name}">
                <h2>${item.name}</h2>
                <p>${item.description}</p>
                <button class="buy-button" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">Купити</button>
            `;
            goodsContainer.appendChild(itemDiv);
        });

        document.querySelectorAll(".buy-button").forEach(button => {
            button.addEventListener("click", addToCart);
        });

    } catch (error) {
        console.error("Error fetching items:", error);
    }
}

// Add item to cart
function addToCart(event) {
    const button = event.target;
    const id = button.dataset.id;
    const name = button.dataset.name;
    const price = button.dataset.price;

    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const itemIndex = cartItems.findIndex(item => item.id === id);

    if (itemIndex !== -1) {
        cartItems[itemIndex].quantity += 1;
    } else {
        cartItems.push({ id, name, price, quantity: 1 });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCart();
}

// Update cart display
function updateCart() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const cartItemsContainer = document.getElementById("cartItems");
    cartItemsContainer.innerHTML = "";

    let totalPrice = 0;
    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;

        const itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-item");
        itemDiv.innerHTML = `
            <span>${item.name}</span>
            <span>${item.price}₴ x ${item.quantity} = ${itemTotal}₴</span>
        `;
        cartItemsContainer.appendChild(itemDiv);
    });

    document.getElementById("totalPrice").textContent = `Загальна сума: ₴${totalPrice}`;
}

// Clear cart
document.getElementById("clearCartButton").addEventListener("click", function() {
    localStorage.removeItem("cartItems");
    updateCart();
});

// Fetch and display items on page load
fetchItems();
