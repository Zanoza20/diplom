$(document).ready(function () {
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
    var sortIcon = $("#sortIcon");
    var sortMenu = $("#sortMenu");
    var sortForm = $("#sortForm");
    var closeCartButton = $("#closeCartButton");

    var cart = {};
    var goods = {};

    loginButton.click(function () {
        menuLogin.show();
    });

    registerButton.click(function () {
        menuRegister.show();
    });

    $(".cancelbtn").click(function () {
        menuLogin.hide();
        menuRegister.hide();
        userRules.hide();
        itemDetails.hide();
        cartMenu.hide();
    });

    userRulesLink.click(function (event) {
        event.preventDefault();
        userRules.show();
    });

    sortIcon.click(function () {
        sortMenu.show();
    });

    // Завантаження товарів
    $.getJSON("goods.json", function (data) {
        goods = data; // Зберігаємо завантажені товари
        displayGoods(data);
    });

    // Показувати деталі товару при натисканні на назву
    function setupItemDetails() {
        $(".item-name").click(function () {
            var key = $(this).data("key");
            var item = goods[key];

            $("#itemImage").attr("src", item.image);
            $("#itemName").text(item.name);
            $("#itemDescription").text(item.description);
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
        $(".add-to-cart").click(function () {
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
        $.each(data, function (key, value) {
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
    searchField.on("input", function () {
        var searchText = $(this).val().toLowerCase();
        var filteredGoods = {};
        $.each(goods, function (key, value) {
            if (value.name.toLowerCase().includes(searchText) ||
                value.description.toLowerCase().includes(searchText)) {
                filteredGoods[key] = value;
            }
        });
        displayGoods(filteredGoods);
    });

    // Функціональність сортування
    sortForm.on("submit", function (event) {
        event.preventDefault();

        var selectedBrand = $("#sortBrand").val();
        var selectedGpuManufacturer = $("#sortGpuManufacturer").val();
        var selectedMemoryType = $("#sortMemoryType").val();
        var selectedPurpose = $("#sortPurpose").val();
        var selectedCoolingType = $("#sortCoolingType").val();

        var filteredGoods = {};

        $.each(goods, function (key, value) {
            var matchesBrand = selectedBrand === "" || value.brand === selectedBrand;
            var matchesGpuManufacturer = selectedGpuManufacturer === "" || value.gpuManufacturer === selectedGpuManufacturer;
            var matchesMemoryType = selectedMemoryType === "" || value.memoryType === selectedMemoryType;
            var matchesPurpose = selectedPurpose === "" || value.purpose === selectedPurpose;
            var matchesCoolingType = selectedCoolingType === "" || value.coolingType === selectedCoolingType;

            if (matchesBrand && matchesGpuManufacturer && matchesMemoryType && matchesPurpose && matchesCoolingType) {
                filteredGoods[key] = value;
            }
        });

        displayGoods(filteredGoods);
        sortMenu.hide();
    });

    // Оновлення кошика
    function updateCart() {
        cartItems.empty();
        var total = 0;
        $.each(cart, function (key, item) {
            total += item.cost * item.quantity;
            cartItems.append(
                '<div class="cart-item">' +
                '<div class="cart-item-name">' + item.name + '</div>' +
                '<div class="cart-item-quantity">' + item.quantity + ' x ₴' + item.cost + '</div>' +
                '<button class="remove-from-cart" data-key="' + key + '">Видалити</button>' +
                '</div>'
            );
        });
        totalPrice.text("Загальна сума: ₴" + total);

        $(".remove-from-cart").click(function () {
            var key = $(this).data("key");
            delete cart[key];
            updateCart();
        });
    }

    cartIcon.click(function () {
        cartMenu.show();
    });

    closeCartButton.click(function () { // Додаємо обробник кліку для закриття кошика
        cartMenu.hide();
    });

    clearCartButton.click(function () {
        cart = {};
        updateCart();
    });

    orderButton.click(function () {
        if (Object.keys(cart).length === 0) {
            alert("Ваш кошик порожній!");
        } else {
            alert("Замовлення успішно оформлене!");
            cart = {};
            updateCart();
            cartMenu.hide();
        }
    });

    // Реєстрація користувача
    $("#menuRegister form").submit(function (event) {
        event.preventDefault();
        var phone = $("#phoneRegister").val();
        var email = $("#emailRegister").val();
        var password = $("#pswRegister").val();

        var users = JSON.parse(localStorage.getItem('users')) || [];
        var userExists = users.some(user => user.phone === phone);

        if (userExists) {
            alert('Користувач з таким номером телефону вже існує');
        } else {
            users.push({ phone, email, password });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Реєстрація пройшла успішно');
            menuRegister.hide();
        }
    });

    // Вхід користувача
    $("#menuLogin form").submit(function (event) {
        event.preventDefault();
        var phone = $("#phoneLogin").val();
        var password = $("#pswLogin").val();

        var users = JSON.parse(localStorage.getItem('users')) || [];
        var user = users.find(user => user.phone === phone && user.password === password);

        if (user) {
            alert('Вхід успішний');
            menuLogin.hide();
            // Тут можна додати логіку для перенаправлення на сторінку профілю користувача
        } else {
            alert('Невірний номер телефону або пароль');
        }
    });
});
