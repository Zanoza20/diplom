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
    var addIcon = $("#addIcon");
    var editIcon = $("#editIcon");
    var deleteIcon = $("#deleteIcon");

    var addItemModal = $("#addItemModal");
    var deleteItemModal = $("#deleteItemModal");
    var editItemModal = $("#editItemModal");
    var addItemForm = $("#addItemForm");
    var deleteItemForm = $("#deleteItemForm");
    var editItemForm = $("#editItemForm");
    var closeAddItemModalButton = $("#closeAddItemModalButton");
    var closeDeleteItemModalButton = $("#closeDeleteItemModalButton");
    var closeEditItemModalButton = $("#closeEditItemModalButton");
    var deleteItemSelect = $("#deleteItemSelect");
    var editItemSelect = $("#editItemSelect");
    var addItemCloseButton = $("#addItemCloseButton");
    var deleteItemCloseButton = $("#deleteItemCloseButton");
    var editItemCloseButton = $("#editItemCloseButton");

    var cart = {};
    var goods = JSON.parse(localStorage.getItem('goods')) || {};
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
        addItemModal.hide();
        deleteItemModal.hide();
        editItemModal.hide();
    });

    userRulesLink.click(function (event) {
        event.preventDefault();
        userRules.show();
    });

    sortIcon.click(function () {
        sortMenu.show();
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
                cart[key] = Object.assign({}, goods[key]);
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
        updateDeleteItemSelect();
        updateEditItemSelect();
    }

    function updateDeleteItemSelect() {
        deleteItemSelect.empty();
        $.each(goods, function (key, value) {
            deleteItemSelect.append(
                '<option value="' + key + '">' + value.name + '</option>'
            );
        });
    }

    function updateEditItemSelect() {
        editItemSelect.empty();
        $.each(goods, function (key, value) {
            editItemSelect.append(
                '<option value="' + key + '">' + value.name + '</option>'
            );
        });
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
            var users = JSON.parse(localStorage.getItem('users')) || [];
            var user = currentUser;
            var orderItems = [];
            var total = 0;

            $.each(cart, function (key, item) {
                orderItems.push(item.name);
                total += item.cost * item.quantity;
            });

            var newOrder = {
                time: new Date().toLocaleString(),
                phone: user.phone,
                email: user.email,
                items: orderItems.join(", "),
                total: total
            };

            var orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(newOrder);
            localStorage.setItem('orders', JSON.stringify(orders));

            alert("Замовлення успішно оформлене!");
            cart = {};
            updateCart();
            cartMenu.hide();
        }
    });

    $("#menuRegister form").submit(function (event) {
        event.preventDefault();

        var username = $("#registerUsername").val();
        var phone = $("#registerPhone").val();
        var email = $("#registerEmail").val();
        var password = $("#registerPassword").val();

        var users = JSON.parse(localStorage.getItem('users')) || [];
        var userExists = users.some(function (user) {
            return user.username === username || user.phone === phone || user.email === email;
        });

        if (userExists) {
            alert("Користувач з таким ім'ям, телефоном або email вже існує.");
        } else {
            var newUser = {
                username: username,
                phone: phone,
                email: email,
                password: password
            };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            alert("Реєстрація успішна!");
            menuRegister.hide();
        }
    });

    $("#menuLogin form").submit(function (event) {
        event.preventDefault();

        var phone = $("#loginPhone").val();
        var password = $("#loginPassword").val();

        var users = JSON.parse(localStorage.getItem('users')) || [];
        var user = users.find(function (user) {
            return user.phone === phone && user.password === password;
        });

        if (phone === actors.Admin.phone && password === actors.Admin.password) {
            currentUser = {
                username: "Admin",
                phone: actors.Admin.phone,
                email: "admin@example.com",
                password: actors.Admin.password
            };
            alert("Вхід успішний! Ласкаво просимо, Адміністратор!");
            $("#adminJournalIcon").show();
            addIcon.show();
            editIcon.show();
            deleteIcon.show();
            menuLogin.hide();
        } else if (user) {
            currentUser = user;
            alert("Вхід успішний! Ласкаво просимо, " + user.username + "!");
            profileIcon.show();
            $("#profileName").text(user.username);
            $("#profilePhone").text(user.phone);
            $("#profileEmail").text(user.email);
            menuLogin.hide();
        } else {
            alert("Неправильний телефон або пароль. Спробуйте ще раз.");
        }
    });

    logoutButton.click(function () {
        currentUser = null;
        profileIcon.hide();
        $("#adminJournalIcon").hide();
        addIcon.hide();
        editIcon.hide();
        deleteIcon.hide();
        alert("Ви успішно вийшли з системи.");
    });

    profileIcon.click(function () {
        profileModal.show();
    });

    addIcon.click(function () {
        addItemModal.show();
    });

    deleteIcon.click(function () {
        deleteItemModal.show();
    });

    editIcon.click(function () {
        editItemModal.show();
    });

    addItemForm.submit(function (event) {
        event.preventDefault();
        var name = $("#addItemName").val();
        var description = $("#addItemDescription").val();
        var image = $("#addItemImage").val();
        var cost = parseFloat($("#addItemCost").val());
        var brand = $("#addItemBrand").val();
        var gpuManufacturer = $("#addItemGpuManufacturer").val();
        var graphicChip = $("#addItemGraphicChip").val();
        var memorySize = $("#addItemMemorySize").val();
        var memoryType = $("#addItemMemoryType").val();
        var purpose = $("#addItemPurpose").val();
        var coolingType = $("#addItemCoolingType").val();

        var key = name.toLowerCase().replace(/ /g, "-");
        goods[key] = {
            name: name,
            description: description,
            image: image,
            cost: cost,
            brand: brand,
            gpuManufacturer: gpuManufacturer,
            graphicChip: graphicChip,
            memorySize: memorySize,
            memoryType: memoryType,
            purpose: purpose,
            coolingType: coolingType
        };
        localStorage.setItem('goods', JSON.stringify(goods));
        alert("Товар успішно доданий!");
        addItemForm[0].reset();
        addItemModal.hide();
        displayGoods(goods);
    });

    deleteItemForm.submit(function (event) {
        event.preventDefault();
        var key = deleteItemSelect.val();
        delete goods[key];
        localStorage.setItem('goods', JSON.stringify(goods));
        alert("Товар успішно видалений!");
        deleteItemModal.hide();
        displayGoods(goods);
    });

    editItemForm.submit(function (event) {
        event.preventDefault();
        var key = editItemSelect.val();
        var item = goods[key];
        item.name = $("#editItemName").val();
        item.description = $("#editItemDescription").val();
        item.image = $("#editItemImage").val();
        item.cost = parseFloat($("#editItemCost").val());
        item.brand = $("#editItemBrand").val();
        item.gpuManufacturer = $("#editItemGpuManufacturer").val();
        item.graphicChip = $("#editItemGraphicChip").val();
        item.memorySize = $("#editItemMemorySize").val();
        item.memoryType = $("#editItemMemoryType").val();
        item.purpose = $("#editItemPurpose").val();
        item.coolingType = $("#editItemCoolingType").val();

        localStorage.setItem('goods', JSON.stringify(goods));
        alert("Товар успішно відредагований!");
        editItemModal.hide();
        displayGoods(goods);
    });

    closeAddItemModalButton.click(function () {
        addItemModal.hide();
    });

    closeDeleteItemModalButton.click(function () {
        deleteItemModal.hide();
    });

    closeEditItemModalButton.click(function () {
        editItemModal.hide();
    });

    $(window).on('load', function () {
        if (currentUser) {
            profileIcon.show();
        }
        if (currentUser && currentUser.username === "Admin") {
            $("#adminJournalIcon").show();
            addIcon.show();
            editIcon.show();
            deleteIcon.show();
        }
        displayGoods(goods);
    });

    displayGoods(goods);
});
