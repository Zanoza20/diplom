$(document).ready(function () {
    var loginButton = $("#loginButton");
    var registerButton = $("#registerButton");
    var profileIcon = $("#profileIcon");
    var profileModal = $("#profileMenu");
    var logoutButton = $("#logoutButton");
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
    var adminJournalIcon = $("#adminJournalIcon");

    var cart = {};
    var goods = {};
    var currentUser = null;

    var actors = {
        "Admin": {
            "phone": "380976937243",
            "password": "496193202004"
        },
        "users": []
    };

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
        profileModal.hide();
    });

    userRulesLink.click(function (event) {
        event.preventDefault();
        userRules.show();
    });

    sortIcon.click(function () {
        sortMenu.show();
    });

    $.getJSON("goods.json", function (data) {
        goods = data;
        displayGoods(data);
    });

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

    function setupAddToCartButtons() {
        $(".add-to-cart").click(function () {
            if (!currentUser) {
                alert("Ви повинні увійти в акаунт, щоб додати товар до кошика.");
                return;
            }

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

    closeCartButton.click(function () {
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

    $("#menuLogin form").submit(function (event) {
        event.preventDefault();
        var phone = $("#phoneLogin").val();
        var password = $("#pswLogin").val();

        if (phone === actors.Admin.phone && password === actors.Admin.password) {
            // Вхід як адміністратор
            adminJournalIcon.show();
            alert('Вхід як адміністратор успішний');
            menuLogin.hide();
            profileIcon.show();
            loginButton.hide();
            registerButton.hide();
            currentUser = actors.Admin;
        } else {
            var users = JSON.parse(localStorage.getItem('users')) || [];
            var user = users.find(user => user.phone === phone && user.password === password);

            if (user) {
                alert('Вхід успішний');
                menuLogin.hide();
                profileIcon.show();
                loginButton.hide();
                registerButton.hide();
                currentUser = user;
                $("#profileEmail").text(user.email);
                $("#profilePhone").text(user.phone);
            } else {
                alert('Невірний номер телефону або пароль');
            }
        }
    });

    profileIcon.click(function () {
        profileModal.show();
    });

    logoutButton.click(function () {
        currentUser = null;
        profileModal.hide();
        profileIcon.hide();
        adminJournalIcon.hide();
        loginButton.show();
        registerButton.show();
    });
});
