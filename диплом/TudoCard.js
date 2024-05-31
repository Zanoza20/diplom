var cart = {};

$('document').ready(function(){
    loadGoods();

    var loginButton = $("#loginButton");
    var registerButton = $("#registerButton");

    
});

function loadGoods() {
    $.getJSON('goods.json', function (data) {
        var out = '';
        for (var key in data) {
            out += '<div class="single-goods">';
            out += '<h3>' + data[key]['name'] + '</h3>';
            out += '<p>Ціна: ' + data[key]['cost'] + '</p>';
            out += '<img src="' + data[key].image + '">';
            out += '<button class="add-to-cart" data-art="' + key + '">Купити</button>';
            out += '</div>';
        }
        $('#goods').html(out);
        $('button.add-to-cart').on('click', addToCart);
    });
}

function addToCart() {
    var articul = $(this).attr('data-art');
    cart[articul] = 1;
    console.log(cart);
}
