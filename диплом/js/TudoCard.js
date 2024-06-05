$(document).ready(function() {
    var loginButton = $("#loginButton");
    var registerButton = $("#registerButton");
    var menuLogin = $("#menuLogin");
    var menuRegister = $("#menuRegister");
    var userRules = $("#userRules");
    var userRulesLink = $("#userRulesLink");
    var itemDetails = $("#itemDetails");

    loginButton.click(function() {
        menuLogin.show();
    });

    registerButton.click(function() {
        menuRegister.show();
    });

    $(".cancelbtn").click(function() {
        $(this).closest('.sign-up').hide();
    });

    $(".close").click(function() {
        $(this).closest('.sign-up').hide();
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
                '<h3>' + value.name + '</h3>' +
                '<p class="price">' + value.price + ' грн</p>' +
                '<button class="add-to-cart" data-id="' + value.id + '">До кошика</button>' +
                '</div>'
            );
        });

        $(".single-goods h3").click(function() {
            var itemId = $(this).closest('.single-goods').find('.add-to-cart').data('id');
            var selectedItem = data.find(item => item.id == itemId);
            if (selectedItem) {
                $("#itemImage").attr("src", selectedItem.image);
                $("#itemName").text(selectedItem.name);
                $("#itemDescription").text(selectedItem.description);
                $("#brand").text(selectedItem.brand);
                $("#gpuManufacturer").text(selectedItem.gpuManufacturer);
                $("#graphicChip").text(selectedItem.graphicChip);
                $("#memorySize").text(selectedItem.memorySize);
                $("#memoryType").text(selectedItem.memoryType);
                $("#purpose").text(selectedItem.purpose);
                $("#coolingType").text(selectedItem.coolingType);
                itemDetails.show();
            }
        });
    });
});
