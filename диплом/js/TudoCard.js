$(document).ready(function () {
    let goods = [];

    function renderGoods(goods) {
        $('#goods').empty();
        goods.forEach(function (item) {
            const goodItem = `
                <div class="good-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}">
                    <h2>${item.name}</h2>
                    <p>${item.description}</p>
                    <p><b>Ціна: ₴${item.price}</b></p>
                    <button class="details-button">Детальніше</button>
                    <button class="add-to-cart-button">Додати до кошику</button>
                </div>
            `;
            $('#goods').append(goodItem);
        });
    }

    function openSortMenu() {
        $('#sortMenu').css('display', 'block');
    }

    function closeSortMenu() {
        $('#sortMenu').css('display', 'none');
    }

    function openCartMenu() {
        $('#cartMenu').css('display', 'block');
    }

    function closeCartMenu() {
        $('#cartMenu').css('display', 'none');
    }

    function openLoginMenu() {
        $('#menuLogin').css('display', 'block');
    }

    function closeLoginMenu() {
        $('#menuLogin').css('display', 'none');
    }

    function openRegisterMenu() {
        $('#menuRegister').css('display', 'block');
    }

    function closeRegisterMenu() {
        $('#menuRegister').css('display', 'none');
    }

    function openUserRules() {
        $('#userRules').css('display', 'block');
    }

    function closeUserRules() {
        $('#userRules').css('display', 'none');
    }

    function openItemDetails(item) {
        $('#itemImage').attr('src', item.image);
        $('#itemName').text(item.name);
        $('#itemDescription').text(item.description);
        $('#brand').text(item.brand);
        $('#gpuManufacturer').text(item.gpuManufacturer);
        $('#graphicChip').text(item.graphicChip);
        $('#memorySize').text(item.memorySize);
        $('#memoryType').text(item.memoryType);
        $('#purpose').text(item.purpose);
        $('#coolingType').text(item.coolingType);
        $('#itemDetails').css('display', 'block');
    }

    function closeItemDetails() {
        $('#itemDetails').css('display', 'none');
    }

    let cart = [];

    function addToCart(item) {
        cart.push(item);
        renderCartItems();
        updateTotalPrice();
    }

    function renderCartItems() {
        $('#cartItems').empty();
        cart.forEach(function (item, index) {
            const cartItem = `
                <div class="cart-item" data-index="${index}">
                    <img src="${item.image}" alt="${item.name}">
                    <p>${item.name}</p>
                    <p><b>Ціна: ₴${item.price}</b></p>
                </div>
            `;
            $('#cartItems').append(cartItem);
        });
    }

    function updateTotalPrice() {
        let total = cart.reduce((sum, item) => sum + item.price, 0);
        $('#totalPrice').text(`Загальна сума: ₴${total}`);
    }

    $('#sortIcon').on('click', openSortMenu);
    $('#cartIcon').on('click', openCartMenu);
    $('#loginButton').on('click', openLoginMenu);
    $('#registerButton').on('click', openRegisterMenu);
    $('#userRulesLink').on('click', openUserRules);

    $('#goods').on('click', '.details-button', function () {
        const itemId = $(this).closest('.good-item').data('id');
        const item = goods.find(g => g.id === itemId);
        openItemDetails(item);
    });

    $('#goods').on('click', '.add-to-cart-button', function () {
        const itemId = $(this).closest('.good-item').data('id');
        const item = goods.find(g => g.id === itemId);
        addToCart(item);
    });

    $('#clearCartButton').on('click', function () {
        cart = [];
        renderCartItems();
        updateTotalPrice();
    });

    $('#orderButton').on('click', function () {
        alert('Замовлення оформлено!');
        cart = [];
        renderCartItems();
        updateTotalPrice();
    });

    // Load goods from JSON file
    $.getJSON('goods.json', function (data) {
        goods = data;
        renderGoods(goods);
    });
});
