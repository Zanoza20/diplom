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

    // Load goods from JSON
    $.getJSON("goods.json", function (data) {
        goods = data; // Save the loaded goods
        displayGoods(data);
    });

    // Display item details when clicking on item name
    function setupItemDetails() {
        $(".item-name").click(function () {
            var key = $(this).data("key");
            var item = goods[key];

            $("#itemImage").attr("src", item.image);
            $("#itemName").text(item.name);
            $("#itemDescription").text(item.description);
            $("#brand").text(item.brand || "Unknown");
            $("#gpuManufacturer").text(item.gpuManufacturer || "Unknown");
            $("#graphicChip").text(item.graphicChip || "Unknown");
            $("#memorySize").text(item.memorySize || "Unknown");
            $("#memoryType").text(item.memoryType || "Unknown");
            $("#purpose").text(item.purpose || "Unknown");
            $("#coolingType").text(item.coolingType || "Unknown");

            itemDetails.show();
        });
    }

    // Add item to cart
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

    // Display goods
    function displayGoods(data) {
        var goodsContainer = $("#goods");
        goodsContainer.empty();
        $.each(data, function (key, value) {
            goodsContainer.append(
                '<div class="single-goods">' +
                '<img src="' + value.image + '" alt="' + value.name + '">' +
                '<h3 class="item-name" data-key="' + key + '">' + value.name + '</h3>' +
                '<div class="price">₴' + value.cost + '</div>' +
                '<button class="add-to-cart" data-key="' + key + '">Add to cart</button>' +
                '</div>'
            );
        });
        setupItemDetails();
        setupAddToCartButtons();
    }

    // Search functionality
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

    // Sorting functionality
    sortForm.on("submit", function (event) {
        event.preventDefault();

        var selectedBrand = $("#brand").val();
        var selectedGpuManufacturer = $("#gpuManufacturer").val();
        var selectedMemoryType = $("#memoryType").val();
        var selectedPurpose = $("#purpose").val();
        var selectedCoolingType = $("#coolingType").val();

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

    // Update cart
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
        totalPrice.text('Total: ₴' + total);
    }

    cartIcon.click(function () {
        cartMenu.show();
    });

    clearCartButton.click(function () {
        cart = {};
        updateCart();
    });

    orderButton.click(function () {
        alert("Order placed!");
        cart = {};
        updateCart();
        cartMenu.hide();
    });
});
