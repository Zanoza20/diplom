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
                cart[key] = {
                    ...data[key],
                    quantity: 1
                };
            }
            updateCart();
        });
    });

    // Пошук товару
    $("#searchField").on("input", function() {
        var searchTerm = $(this).val().toLowerCase();
        $(".single-goods").each(function() {
            var itemName = $(this).find(".item-name").text().toLowerCase();
            if (itemName.includes(searchTerm)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

    // Відкрити кошик
    cartIcon.click(function() {
        cartMenu.toggle();
        updateCart();
    });

    // Оновлення кошика
    function updateCart() {
        cartItems.empty();
        var total = 0;
        $.each(cart, function(key, item) {
            var itemTotal = item.cost * item.quantity;
            total += itemTotal;
            cartItems.append(
                '<li>' +
                '<img src="' + item.image + '" alt="' + item.name + '">' +
                item.name + ' x ' + item.quantity + ' - ₴' + itemTotal +
                ' <button class="remove-from-cart" data-key="' + key + '">Видалити</button>' +
                '</li>'
            );
        });
        totalPrice.text('₴' + total);

        // Видалення товару з кошика
        $(".remove-from-cart").click(function() {
            var key = $(this).data("key");
            delete cart[key];
            updateCart();
        });
    }

    // Оформлення замовлення
    orderButton.click(function() {
        alert("Замовлення оформлено! Сумарна ціна: " + totalPrice.text());
        cart = {};
        updateCart();
        cartMenu.hide();
    });
});
