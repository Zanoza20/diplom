$(document).ready(function () {
    var goods = {};
    var cart = {};
    var searchField = $("#searchField");
    var cartIcon = $("#cartIcon");
    var sortIcon = $("#sortIcon");
    var sortMenu = $("#sortMenu");
    var sortForm = $("#sortForm");
    var cartMenu = $("#cartMenu");
    var cartItems = $("#cartItems");
    var totalPrice = $("#totalPrice");
    var clearCartButton = $("#clearCartButton");
    var orderButton = $("#orderButton");
    var itemDetails = $("#itemDetails");

    // Завантаження товарів з JSON файлу
    $.getJSON("goods.json", function (data) {
        goods = data;
        displayGoods(goods);
    });

    // Відображення деталей товару
    function setupItemDetails() {
        $(".item-name").off("click").click(function () {
            var key = $(this).data("key");
            var item = goods[key];

            $("#itemImage").attr("src", item.image);
            $("#itemName").text(item.name);
            $("#itemDescription").text(item.description);
            $("#brand").text(item.brand || "Невідомий");
            $("#gpuManufacturerDetail").text(item.gpuManufacturer || "Невідомий");
            $("#graphicChipDetail").text(item.graphicChip || "Невідомий");
            $("#memorySizeDetail").text(item.memorySize || "Невідомий");
            $("#memoryType").text(item.memoryType || "Невідомий");
            $("#purposeDetail").text(item.purpose || "Невідомий");
            $("#coolingTypeDetail").text(item.coolingType || "Невідомий");

            itemDetails.show();
        });
    }

    // Додавання товару до кошика
    function setupAddToCartButtons() {
        $(".add-to-cart").off("click").click(function () {
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

        var sortedGoods = {};

        $.each(goods, function (key, value) {
            var matchesGpuManufacturer = selectedGpuManufacturer === "" || value.gpuManufacturer === selectedGpuManufacturer;
            var matchesGraphicChip = selectedGraphicChip === "" || value.graphicChip === selectedGraphicChip;
            var matchesMemorySize = selectedMemorySize === "" || 
                (selectedMemorySize === "asc" && value.memorySize >= 0) ||
                (selectedMemorySize === "desc" && value.memorySize >= 0);
            var matchesPurpose = selectedPurpose === "" || value.purpose === selectedPurpose;
            var matchesCoolingType = selectedCoolingType === "" || value.coolingType === selectedCoolingType;

            if (matchesGpuManufacturer && matchesGraphicChip && matchesMemorySize && matchesPurpose && matchesCoolingType) {
                sortedGoods[key] = value;
            }
        });

        if (selectedMemorySize === "asc") {
            sortedGoods = Object.values(sortedGoods).sort((a, b) => a.memorySize - b.memorySize);
        } else if (selectedMemorySize === "desc") {
            sortedGoods = Object.values(sortedGoods).sort((a, b) => b.memorySize - a.memorySize);
        }

        var sortedGoodsObject = {};
        $.each(sortedGoods, function (index, value) {
            sortedGoodsObject[value.key] = value;
        });

        displayGoods(sortedGoodsObject);
        sortMenu.hide();
    });

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

    sortIcon.click(function () {
        sortMenu.show();
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
