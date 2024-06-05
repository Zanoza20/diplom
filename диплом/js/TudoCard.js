// Объявляем переменные
let goods = [];
let cart = {};

// Загружаем данные о товарах из JSON файла
$.getJSON('json/goods.json', function (data) {
    goods = data;
    showGoods(goods);
});

// Отображаем список товаров на странице
function showGoods(goods) {
    let out = '';
    for (let key in goods) {
        out += `<div class="good">`;
        out += `<img src="${goods[key].image}" alt="${goods[key].name}">`;
        out += `<h3>${goods[key].name}</h3>`;
        out += `<p>Ціна: ${goods[key].price} ₴</p>`;
        out += `<button class="add-to-cart" data-id="${key}">До кошику</button>`;
        out += `</div>`;
    }
    $('#goods').html(out);
}

// Добавляем товар в корзину
$('body').on('click', '.add-to-cart', function () {
    let id = $(this).attr('data-id');
    if (cart[id]) {
        cart[id].qty++;
    } else {
        cart[id] = {
            name: goods[id].name,
            price: goods[id].price,
            image: goods[id].image,
            qty: 1
        };
    }
    showCart();
});

// Отображаем содержимое корзины
function showCart() {
    let out = '';
    let total = 0;
    for (let key in cart) {
        out += `<div class="cart-item">`;
        out += `<img src="${cart[key].image}" alt="${cart[key].name}">`;
        out += `<p>${cart[key].name}</p>`;
        out += `<p>Ціна: ${cart[key].price} ₴</p>`;
        out += `<p>Кількість: ${cart[key].qty}</p>`;
        out += `<button class="delete-from-cart" data-id="${key}">&times;</button>`;
        out += `</div>`;
        total += cart[key].price * cart[key].qty;
    }
    $('#cartItems').html(out);
    $('#totalPrice').html('₴' + total);
}

// Удаляем товар из корзины
$('body').on('click', '.delete-from-cart', function () {
    let id = $(this).attr('data-id');
    if (cart[id].qty > 1) {
        cart[id].qty--;
    } else {
        delete cart[id];
    }
    showCart();
});

// Очищаем корзину и закрываем её
$('#clearCart').click(function () {
    cart = {};
    $('#cartMenu').hide();
    showCart();
});

// Отправляем заказ
function placeOrder() {
    alert('Ваше замовлення прийнято!');
    cart = {};
    $('#cartMenu').hide();
    showCart();
}

// Отображение модального окна корзины
$('#cartIcon').click(function () {
    showCart();
    $('#cartMenu').show();
});

// Отображение модального окна входа
$('#loginButton').click(function () {
    $('#menuLogin').show();
});

// Отображение модального окна регистрации
$('#registerButton').click(function () {
    $('#menuRegister').show();
});

// Показать правила пользования
$('#userRulesLink').click(function (event) {
    event.preventDefault();
    $('#userRules').show();
});

// Закрытие модальных окон
$('.close').click(function () {
    $(this).closest('.modal').hide();
});
