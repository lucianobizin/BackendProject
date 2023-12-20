document.addEventListener("DOMContentLoaded", function () {

    const productButtons = document.querySelectorAll(".product-button");

    const cartButton = document.getElementById("cart-button");

    productButtons.forEach((button) => {

        button.addEventListener("click", function () {

            const productId = button.getAttribute("data-product-id");

            if (productId) {

                const redirectUrl = `/product/${productId}`;

                window.location.href = redirectUrl;

            };

        });

    });

    const forms = document.querySelectorAll(".buyForm"); 

    forms.forEach((form) => {

        form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const data = new FormData(form);

        const obj = {};

        data.forEach((value, key) => {

            obj[key] = value;

        });

        const cart = getCookie("cart");

        const response = await fetch(`/api/carts/${cart}/product/${obj['pid']}?quantity=${obj['quantity']}}`, {

            method: 'POST',

            body: JSON.stringify(obj),

            headers: {

            "Content-Type": 'application/json'

        }

        });

        const result = await response.json();

        if (result.status === "success") {

            alert(`${result.message}`);

            }

        });

    });

    function getCookie(name) {

        const value = `; ${document.cookie}`;

        const parts = value.split(`; ${name}=`);

        if (parts.length === 2) return parts.pop().split(";").shift();

    }

    if (cartButton) {
        cartButton.addEventListener("click", function () {
            const cartId = getCookie("cart");

            if (cartId) {
                const redirectUrl = `/carts/${cartId}`;
                window.location.href = redirectUrl;
            } else {
                alert.error("No se pudo obtener el ID del carrito desde la cookie.");
            }
        });
    }

});