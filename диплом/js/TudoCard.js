$(document).ready(function() {
    var loginButton = $("#loginButton");
    var registerButton = $("#registerButton");
    var userRulesLink = $("#userRulesLink");

    loginButton.click(function() {
        $("#menuLogin").show();
    });

    registerButton.click(function() {
        $("#menuRegister").show();
    });

    $(".close").click(function() {
        $(this).closest('.sign-up').hide();
    });

    userRulesLink.click(function(event) {
        event.preventDefault();
        $("#userRules").show();
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
                '<button class="add-to-cart">Додати до кошика</button>' +
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

            $("#itemDetails").show();
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
});

function closeMenu(menuId) {
    $("#" + menuId).hide();
}
