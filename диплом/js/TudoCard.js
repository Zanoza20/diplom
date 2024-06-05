$(document).ready(function() {
    var loginButton = $("#loginButton");
    var registerButton = $("#registerButton");
    var menuLogin = $("#menuLogin");
    var menuRegister = $("#menuRegister");
    var userRules = $("#userRules");
    var userRulesLink = $("#userRulesLink");
    var itemDetails = $("#itemDetails");
    var cartIcon = $("#cartIcon");
    var cartMenu = $("#cartMenu");
    var cartItems = $("#cartItems");
    var totalPrice = $("#totalPrice");
    var clearCartButton = $("#clearCartButton");
    var orderButton = $("#orderButton");
    var searchField = $("#searchField");

    var cart = {};
    var goods = {};

    loginButton.click(function() {
        menuLogin.show();
    });

    registerButton.click(function() {
        menuRegister.show();
    });

    $(".cancelbtn").click(function() {
        menuLogin.hide();
        menuRegister.hide();
        userRules.hide();
        itemDetails.hide();
        cartMenu.hide();
    });

    userRulesLink.click(function(event) {
        event.preventDefault();
        userRules.show();
    });

    // Завантаження товарів
    $.getJSON("goods.json", function(data) {
        goods = data; // Зберігаємо завантажені товари
        displayGoods(data);
    });

    // Показувати деталі товару при натисканні на назву
    function setupItemDetails() {
        $(".item-name").click(function() {
            var key = $(this).data("key");
            var item = goods[key];

            $("#itemImage").attr("src", item.image);
            $("#itemName").text(item.name);
            $("#itemDescription").text(item.descreption);
            $("#brand").text(item.brand || "Невідомий");
            $("#gpuManufacturer").text(item.gpuManufacturer || "Невідомий");
            $("#graphicChip").text(item.graphicChip || "Невідомий");
            $("#memorySize").text(item.memorySize || "Невідомий");
            $("#memoryType").text(item.memoryType || "Невідомий");
            $("#purpose").text(item.purpose || "Невідомий");
            $("#coolingType").text(item.coolingType || "Невідомий");

            itemDetails.show();
        });
    }

    // Додавання товару до кошика
    function setupAddToCartButtons() {
        $(".add-to-cart").click(function() {
            var key = $(this).data("key");
            if (cart[key]) {
                cart[key].quantity += 1;
            } else {
                cart[key] = goods[key];
                cart[key].quantity = 1;
            }
            updateCart();
        });
    }

    // Відображення товарів
    function displayGoods(data) {
        var goodsContainer = $("#goods");
        goodsContainer.empty();
        $.each(data, function(key, value) {
            goodsContainer.append(
                '<div class="single-goods">' +
                '<img src="' + value.image + '" alt="' + value.name + '">' +
                '<h3 class="item-name" data-key="' + key + '">' + value.name + '</h3>' +
                '<div class="price">₴' + value.cost + '</div>' +
                '<button class="add-to-cart" data-key="' + key + '">Додати до кошика</button>' +
                '</div>'
            );
        });
        setupItemDetails();
        setupAddToCartButtons();
    }

    // Функціональність пошуку
    searchField.on("input", function() {
        var searchText = $(this).val().toLowerCase();
        var filteredGoods = {};
        $.each(goods, function(key, value) {
            if (value.name.toLowerCase().includes(searchText)) {
                filteredGoods[key] = value;
            }
        });
        displayGoods(filteredGoods);
    });

    // Відкриття кошика
    cartIcon.click(function() {
        updateCart();
        cartMenu.show();
    });

    // Очищення кошика
    clearCartButton.click(function() {
        cart = {};
        updateCart();
        alert("Корзину очищено");
    });

    // Оформлення замовлення
    orderButton.click(function() {
        alert("Замовлення оформлено");
        cart = {};
        updateCart();
    });

    function updateCart() {
        cartItems.empty();
        var total = 0;
        $.each(cart, function(key, value) {
            var itemTotal = value.cost * value.quantity;
            total += itemTotal;
            cartItems.append(
                '<div class="cart-item">' +
                '<img src="' + value.image + '" alt="' + value.name + '">' +
                '<h3 class="cart-item-name" style="font-size: 20px;">' + value.name + '</h3>' +
                '<div class="cart-item-details">' +
                '<p>Ціна: ₴' + value.cost + '</p>' +
                '<p>Кількість: ' + value.quantity + '</p>' +
                '<p>Всього: ₴' + itemTotal + '</p>' +
                '</div>' +
                '</div>'
            );
        });
        totalPrice.text('₴' + total);
    }
});
