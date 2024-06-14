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
        menuLogin.toggle();
    });

    registerButton.click(function () {
        menuRegister.toggle();
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
        userRules.toggle();
    });

    sortIcon.click(function () {
        sortMenu.toggle();
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
        cartMenu.toggle();
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
        var phone = $("#phoneRegister").val();
        var email = $("#emailRegister").val();
        var password = $("#pswRegister").val();

        var users = JSON.parse(localStorage.getItem('users')) || [];
        users.push({ phone: phone, email: email, password: password });
        localStorage.setItem('users', JSON.stringify(users));
        alert("Реєстрація успішна! Тепер ви можете увійти в систему.");
        menuRegister.hide();
    });

    $("#menuLogin form").submit(function (event) {
        event.preventDefault();
        var phone = $("#phoneLogin").val();
        var password = $("#pswLogin").val();

        var users = JSON.parse(localStorage.getItem('users')) || [];
        var user = users.find(function (user) {
            return user.phone === phone && user.password === password;
        });

        if (user) {
            currentUser = user;
            alert("Вхід успішний! Ласкаво просимо!");
            menuLogin.hide();
            profileIcon.show();
        } else {
            alert("Неправильний телефон або пароль. Спробуйте ще раз.");
        }
    });

    profileIcon.click(function () {
        profileModal.toggle();
    });

    logoutButton.click(function () {
        currentUser = null;
        profileIcon.hide();
        profileModal.hide();
        alert("Ви вийшли з системи.");
    });

    adminJournalIcon.click(function () {
        // Display admin journal (orders list)
        var orders = JSON.parse(localStorage.getItem('orders')) || [];
        var ordersList = $("#ordersList");
        ordersList.empty();
        $.each(orders, function (index, order) {
            ordersList.append(
                '<tr>' +
                '<td>' + order.time + '</td>' +
                '<td>' + order.phone + '</td>' +
                '<td>' + order.email + '</td>' +
                '<td>' + order.items + '</td>' +
                '<td>' + order.total + '</td>' +
                '</tr>'
            );
        });
        $("#adminJournal").show();
    });

    addIcon.click(function () {
        addItemModal.show();
    });

    closeAddItemModalButton.click(function () {
        addItemModal.hide();
    });

    addItemCloseButton.click(function () {
        addItemModal.hide();
    });

    addItemForm.submit(function (event) {
        event.preventDefault();
        var newItem = {
            image: $("#addItemImage").val(),
            name: $("#addItemName").val(),
            description: $("#addItemDescription").val(),
            brand: $("#addItemBrand").val(),
            gpuManufacturer: $("#addItemGpuManufacturer").val(),
            graphicChip: $("#addItemGraphicChip").val(),
            memorySize: $("#addItemMemorySize").val(),
            memoryType: $("#addItemMemoryType").val(),
            purpose: $("#addItemPurpose").val(),
            coolingType: $("#addItemCoolingType").val(),
            cost: parseFloat($("#addItemCost").val())
        };

        var key = 'item_' + Date.now();
        goods[key] = newItem;
        localStorage.setItem('goods', JSON.stringify(goods));
        displayGoods(goods);
        addItemModal.hide();
    });

    deleteIcon.click(function () {
        deleteItemModal.show();
    });

    closeDeleteItemModalButton.click(function () {
        deleteItemModal.hide();
    });

    deleteItemCloseButton.click(function () {
        deleteItemModal.hide();
    });

    deleteItemForm.submit(function (event) {
        event.preventDefault();
        var key = deleteItemSelect.val();
        delete goods[key];
        localStorage.setItem('goods', JSON.stringify(goods));
        displayGoods(goods);
        deleteItemModal.hide();
    });

    editIcon.click(function () {
        editItemModal.show();
    });

    closeEditItemModalButton.click(function () {
        editItemModal.hide();
    });

    editItemCloseButton.click(function () {
        editItemModal.hide();
    });

    editItemSelect.change(function () {
        var key = $(this).val();
        var item = goods[key];

        $("#editItemImage").val(item.image);
        $("#editItemName").val(item.name);
        $("#editItemDescription").val(item.description);
        $("#editItemBrand").val(item.brand);
        $("#editItemGpuManufacturer").val(item.gpuManufacturer);
        $("#editItemGraphicChip").val(item.graphicChip);
        $("#editItemMemorySize").val(item.memorySize);
        $("#editItemMemoryType").val(item.memoryType);
        $("#editItemPurpose").val(item.purpose);
        $("#editItemCoolingType").val(item.coolingType);
        $("#editItemCost").val(item.cost);
    });

    editItemForm.submit(function (event) {
        event.preventDefault();
        var key = editItemSelect.val();
        goods[key] = {
            image: $("#editItemImage").val(),
            name: $("#editItemName").val(),
            description: $("#editItemDescription").val(),
            brand: $("#editItemBrand").val(),
            gpuManufacturer: $("#editItemGpuManufacturer").val(),
            graphicChip: $("#editItemGraphicChip").val(),
            memorySize: $("#editItemMemorySize").val(),
            memoryType: $("#editItemMemoryType").val(),
            purpose: $("#editItemPurpose").val(),
            coolingType: $("#editItemCoolingType").val(),
            cost: parseFloat($("#editItemCost").val())
        };
        localStorage.setItem('goods', JSON.stringify(goods));
        displayGoods(goods);
        editItemModal.hide();
    });

    if (localStorage.getItem('goods')) {
        goods = JSON.parse(localStorage.getItem('goods'));
        displayGoods(goods);
    }
});
