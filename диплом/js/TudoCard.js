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

    var cart = {};

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
        var goodsContainer = $("#goods");
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

        // Показувати деталі товару при натисканні на назву
        $(".item-name").click(function() {
            var key = $(this).data("key");
            var item = data[key];

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

        // Додавання товару до кошика
        $(".add-to-cart").click(function() {
            var key = $(this).data("key");
            if (cart[key]) {
                cart[key].quantity += 1;
            } else {
                cart[key] = data[key];
                cart[key].quantity = 1;
            }
            updateCart();
        });
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
