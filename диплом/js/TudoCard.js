document.addEventListener('DOMContentLoaded', function () {
    // Ініціалізація елементів
    const goodsContainer = document.getElementById('goods');
    const cartItemsContainer = document.getElementById('cartItems');
    const totalPriceElement = document.getElementById('totalPrice');
    const searchField = document.getElementById('searchField');
    const sortIcon = document.getElementById('sortIcon');
    const cartIcon = document.getElementById('cartIcon');
    const sortForm = document.getElementById('sortForm');
    const clearCartButton = document.getElementById('clearCartButton');
    const orderButton = document.getElementById('orderButton');
    const itemDetails = document.getElementById('itemDetails');
    const cartMenu = document.getElementById('cartMenu');

    let cart = [];
    let products = [];

    // Функція для завантаження продуктів з JSON-файлу
    function loadProducts() {
        fetch('goods.json')
            .then(response => response.json())
            .then(data => {
                products = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                displayProducts(products);
            })
            .catch(error => console.error('Error loading products:', error));
    }

    // Функція для відображення продуктів
    function displayProducts(products) {
        goodsContainer.innerHTML = '';
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('single-goods');
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3 data-id="${product.id}">${product.name}</h3>
                <p class="price">₴${product.cost}</p>
                <button class="add-to-cart" data-id="${product.id}">Додати до кошика</button>
            `;
            goodsContainer.appendChild(productElement);
        });

        // Додавання обробників подій для кнопок "Додати до кошика"
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function () {
                addToCart(this.dataset.id);
            });
        });

        // Додавання обробників подій для назв товарів
        document.querySelectorAll('.single-goods h3').forEach(title => {
            title.addEventListener('click', function () {
                displayItemDetails(this.dataset.id);
            });
        });
    }

    // Функція для додавання продукту до кошика
    function addToCart(productId) {
        const product = products.find(prod => prod.id == productId);
        const cartItem = cart.find(item => item.id == productId);

        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({
                ...product,
                quantity: 1,
            });
        }

        displayCartItems();
    }

    // Функція для відображення товарів у кошику
    function displayCartItems() {
        cartItemsContainer.innerHTML = '';
        let totalPrice = 0;

        cart.forEach(item => {
            totalPrice += item.cost * item.quantity;

            const cartItemElement = document.createElement('div');
            cartItemElement.innerHTML = `
                <p>${item.name} x${item.quantity}</p>
                <p>₴${item.cost * item.quantity}</p>
            `;
            cartItemsContainer.appendChild(cartItemElement);
        });

        totalPriceElement.textContent = `Загальна сума: ₴${totalPrice}`;
    }

    // Функція для відображення деталей товару
    function displayItemDetails(productId) {
        const product = products.find(prod => prod.id == productId);

        if (product) {
            document.getElementById('itemImage').src = product.image;
            document.getElementById('itemName').textContent = product.name;
            document.getElementById('itemDescription').textContent = product.descreption;
            document.getElementById('brand').textContent = product.brand;
            document.getElementById('gpuManufacturer').textContent = product.gpuManufacturer;
            document.getElementById('graphicChip').textContent = product.graphicChip;
            document.getElementById('memorySize').textContent = product.memorySize;
            document.getElementById('memoryType').textContent = product.memoryType;
            document.getElementById('purpose').textContent = product.purpose;
            document.getElementById('coolingType').textContent = product.coolingType;

            itemDetails.style.display = 'block';
        }
    }

    // Функція для очищення кошика
    function clearCart() {
        cart = [];
        displayCartItems();
    }

    // Функція для оформлення замовлення
    function placeOrder() {
        if (cart.length === 0) {
            alert('Ваш кошик порожній.');
            return;
        }

        // Логіка оформлення замовлення (наприклад, відправка даних на сервер)

        alert('Ваше замовлення прийнято!');
        clearCart();
        cartMenu.style.display = 'none';
    }

    // Фільтрування продуктів
    function filterProducts() {
        const searchTerm = searchField.value.toLowerCase();
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.descreption.toLowerCase().includes(searchTerm)
        );

        displayProducts(filteredProducts);
    }

    // Обробка подій
    searchField.addEventListener('input', filterProducts);

    sortIcon.addEventListener('click', function () {
        document.getElementById('sortMenu').style.display = 'block';
    });

    cartIcon.addEventListener('click', function () {
        cartMenu.style.display = 'block';
    });

    sortForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(sortForm);
        const filters = {
            gpuManufacturer: formData.get('gpuManufacturer'),
            graphicChip: formData.get('graphicChip'),
            memorySize: formData.get('memorySize'),
            purpose: formData.get('purpose'),
            coolingType: formData.get('coolingType'),
        };

        let filteredProducts = products;

        if (filters.gpuManufacturer) {
            filteredProducts = filteredProducts.filter(product => product.gpuManufacturer === filters.gpuManufacturer);
        }

        if (filters.graphicChip) {
            filteredProducts = filteredProducts.filter(product => product.graphicChip === filters.graphicChip);
        }

        if (filters.memorySize) {
            filteredProducts = filteredProducts.sort((a, b) => {
                if (filters.memorySize === 'asc') {
                    return parseInt(a.memorySize) - parseInt(b.memorySize);
                } else {
                    return parseInt(b.memorySize) - parseInt(a.memorySize);
                }
            });
        }

        if (filters.purpose) {
            filteredProducts = filteredProducts.filter(product => product.purpose === filters.purpose);
        }

        if (filters.coolingType) {
            filteredProducts = filteredProducts.filter(product => product.coolingType === filters.coolingType);
        }

        displayProducts(filteredProducts);
        document.getElementById('sortMenu').style.display = 'none';
    });

    clearCartButton.addEventListener('click', clearCart);
    orderButton.addEventListener('click', placeOrder);

    // Ініціалізація завантаження продуктів
    loadProducts();
});
