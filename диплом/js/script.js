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

        var selectedGpuManufacturer = $("#gpuManufacturer").val();
        var selectedGraphicChip = $("#graphicChip").val();
        var selectedMemorySize = $("#memorySize").val();
        var selectedPurpose = $("#purpose").val();
        var selectedCoolingType = $("#coolingType").val();

        console.log("Selected GPU Manufacturer:", selectedGpuManufacturer);
        console.log("Selected Graphic Chip:", selectedGraphicChip);
        console.log("Selected Memory Size:", selectedMemorySize);
        console.log("Selected Purpose:", selectedPurpose);
        console.log("Selected Cooling Type:", selectedCoolingType);

        var filteredGoods = {};

        $.each(goods, function (key, value) {
            var matchesGpuManufacturer = selectedGpuManufacturer === "" || value.gpuManufacturer === selectedGpuManufacturer;
            var matchesGraphicChip = selectedGraphicChip === "" || value.graphicChip === selectedGraphicChip;
            var matchesMemorySize = selectedMemorySize === "" || value.memorySize === selectedMemorySize;
            var matchesPurpose = selectedPurpose === "" || value.purpose === selectedPurpose;
            var matchesCoolingType = selectedCoolingType === "" || value.coolingType === selectedCoolingType;

            if (matchesGpuManufacturer && matchesGraphicChip && matchesMemorySize && matchesPurpose && matchesCoolingType) {
                filteredGoods[key] = value;
            }
        });

        console.log("Filtered Goods Before Sorting:", filteredGoods);

        if (selectedMemorySize === "asc") {
            filteredGoods = Object.values(filteredGoods).sort((a, b) => parseMemorySize(a.memorySize) - parseMemorySize(b.memorySize));
        } else if (selectedMemorySize === "desc") {
            filteredGoods = Object.values(filteredGoods).sort((a, b) => parseMemorySize(b.memorySize) - parseMemorySize(a.memorySize));
        }

        console.log("Filtered Goods After Sorting:", filteredGoods);

        displayGoods(filteredGoods);
        sortMenu.hide();
    });

    // Парсинг розміру пам'яті
    function parseMemorySize(size) {
        var sizeNumber = parseInt(size);
        if (isNaN(sizeNumber)) {
            return 0; // Якщо розмір пам'яті не є числом, повертаємо 0
        }
        return sizeNumber;
    }

    // Оновлення кошика
    function updateCart() {
        cartItems.empty();
        var total = 0;
        $.each(cart, function (key, item) {
            var itemTotal = item.quantity * item.cost;
            cartItems.append(
                '<div class="cart-item">' +
                '<img src="' + item.image + '" alt="' + item.name + '" class="cart-item-image">' +
                '<span>' + item.name + ' (x' + item.quantity + ')</span>' +
                '<span>₴' + itemTotal + '</span>' +
                '</div>'
            );
            total += itemTotal;
        });
        totalPrice.text('Загальна сума: ₴' + total);
    }

    cartIcon.click(function () {
        cartMenu.show();
    });

    clearCartButton.click(function () {
        cart = {};
        updateCart();
    });

    orderButton.click(function () {
        alert("Замовлення оформлене!");
        cart = {};
        updateCart();
        cartMenu.hide();
    });
});
