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
            adminJournalIcon.toggle();
            alert('Вхід як адміністратор успішний');
            profileIcon.show();
            loginButton.hide();
            registerButton.hide();
            adminJournalIcon.show();
            addIcon.show();
            editIcon.show();
            deleteIcon.show();
            menuLogin.hide();
            currentUser = actors.Admin;
        } else {
            var users = JSON.parse(localStorage.getItem('users')) || [];
            var user = users.find(user => user.phone === phone && user.password === password);

            if (user) {
                alert('Вхід успішний');
                menuLogin.hide();
                profileIcon.show();
                addIcon.hide();
                editIcon.hide();
                deleteIcon.hide();
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
        addIcon.hide();
        editIcon.hide();
        deleteIcon.hide();
        adminJournalIcon.hide();
        loginButton.show();
        registerButton.show();
    });

    addIcon.click(function () {
        addItemModal.show();
    });

    deleteIcon.click(function () {
        updateDeleteItemSelect();
        deleteItemModal.show();
    });

    editIcon.click(function () {
        updateEditItemSelect();
        editItemModal.show();
    });

    addItemForm.submit(function (event) {
        event.preventDefault();

        var newItem = {
            name: $("#addItemName").val(),
            description: $("#addItemDescription").val(),
            brand: $("#addItemBrand").val(),
            gpuManufacturer: $("#addItemGpuManufacturer").val(),
            graphicChip: $("#addItemGraphicChip").val(),
            memorySize: $("#addItemMemorySize").val(),
            memoryType: $("#addItemMemoryType").val(),
            purpose: $("#addItemPurpose").val(),
            coolingType: $("#addItemCoolingType").val(),
            cost: parseFloat($("#addItemCost").val()),
            image: $("#addItemImage").val()
        };

        var newKey = 'item' + (Object.keys(goods).length + 1);
        goods[newKey] = newItem;

        localStorage.setItem('goods', JSON.stringify(goods));

        alert('Товар успішно доданий');
        addItemModal.hide();
        displayGoods(goods);
    });

    deleteItemForm.submit(function (event) {
        event.preventDefault();

        var keyToDelete = $("#deleteItemSelect").val();
        if (goods[keyToDelete]) {
            delete goods[keyToDelete];
            localStorage.setItem('goods', JSON.stringify(goods));
            alert('Товар успішно видалений');
            deleteItemModal.hide();
            displayGoods(goods);
        } else {
            alert('Товар з таким ключем не знайдено');
        }
    });

    editItemForm.submit(function (event) {
        event.preventDefault();

        var keyToEdit = $("#editItemSelect").val();
        if (goods[keyToEdit]) {
            goods[keyToEdit].name = $("#editItemName").val();
            goods[keyToEdit].description = $("#editItemDescription").val();
            goods[keyToEdit].brand = $("#editItemBrand").val();
            goods[keyToEdit].gpuManufacturer = $("#editItemGpuManufacturer").val();
            goods[keyToEdit].graphicChip = $("#editItemGraphicChip").val();
            goods[keyToEdit].memorySize = $("#editItemMemorySize").val();
            goods[keyToEdit].memoryType = $("#editItemMemoryType").val();
            goods[keyToEdit].purpose = $("#editItemPurpose").val();
            goods[keyToEdit].coolingType = $("#editItemCoolingType").val();
            goods[keyToEdit].cost = parseFloat($("#editItemCost").val());
            goods[keyToEdit].image = $("#editItemImage").val();

            localStorage.setItem('goods', JSON.stringify(goods));

            alert('Товар успішно відредаговано');
            editItemModal.hide();
            displayGoods(goods);
        } else {
            alert('Товар з таким ключем не знайдено');
        }
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

    addItemCloseButton.click(function () {
        addItemModal.hide();
    });

    deleteItemCloseButton.click(function () {
        deleteItemModal.hide();
    });

    editItemCloseButton.click(function () {
        editItemModal.hide();
    });

    adminJournalIcon.click(function () {
        var users = JSON.parse(localStorage.getItem('users')) || [];
        var orders = JSON.parse(localStorage.getItem('orders')) || [];
        
        var userSection = "<h3>Користувачі</h3><ul>";
        users.forEach(function(user) {
            userSection += "<li>Телефон: " + user.phone + ", Email: " + user.email + "</li>";
        });
        userSection += "</ul>";

        var orderSection = "<h3>Замовлення</h3><ul>";
        orders.forEach(function(order) {
            orderSection += "<li>У " + order.time + " користувач за номером " + order.phone + " та почтою " + order.email + " оформив замовлення на " + order.items + " ціною в ₴" + order.total + "</li>";
        });
        orderSection += "</ul>";

        var journalContent = userSection + orderSection;
        var journalModal = $("<div>").attr("id", "journalModal").html(journalContent);
        $("body").append(journalModal);
        journalModal.toggle();
    });

    displayGoods(goods);
});
