document.addEventListener("DOMContentLoaded", function () {

    const productButtons = document.querySelectorAll(".product-button");

    console.log(productButtons)

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

            console.log(result.message);

            }

        });

    });

    function getCookie(name) {

        const value = `; ${document.cookie}`;

        const parts = value.split(`; ${name}=`);

        if (parts.length === 2) return parts.pop().split(";").shift();

    }

});

// const form = document.getElementById("buyForm")
// form.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const data = new FormData(form);
//     const obj = {};
//     data.forEach((value, key) => {
//         obj[key] = value;
//     });

//     const cart = getCookie("cart")
//     const response = await fetch(`/api/carts/${cart}/product/${obj['pid']}?quantity=${obj['quantity']}}`, {
//         method:'POST',
//         body: JSON.stringify(obj),
//         headers:{
//             "Content-Type":'application/json'
//         }
//     })
    
//     const result = await response.json();

//     if(result.status === "success"){
//         console.log(result.message)
//     }
// })

// function getCookie(name){
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length===2) return parts.pop().split(";").shift();
// }