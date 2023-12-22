document.addEventListener("DOMContentLoaded", function () {

    const purchaseButton = document.getElementById("purchaseButton");

    // if (authCookie) {

    purchaseButton.addEventListener('click', async (e) => {

        e.preventDefault();

        try {

            const authCookie = getCookie("authCookie");
            console.log(authCookie)
        
            const cartId = getCookie("cart");
            console.log(cartId)

            if (cartId) {

                const response = await fetch(`/api/carts/${cartId}/purchase`, {
                    method: "POST",
                });

                const result = await response.json();

                if (result.status === "success") {

                    alert('Purchase successful, you have received an email with the ticket!');
                    window.location.replace('/products');

                } else {

                    alert('Error ending the purchase. Please register first.');

                    window.location.reload();

                }

            } else {

                alert('Error ending the purchase. Please try it again.');

            }

        } catch (error) {

            console.error('ending the purchase. Please try again:', error);

            alert('Something went wrong! Please try again later.');

            window.location.reload();

        }

    })

    // } else {

    // Si la cookie "authcookie" no existe, desactivar el botón de compra
    //     purchaseButton.disabled = true;
    //     alert("You need to be registered and logged in to buy a product")

    // }

})

function getCookie(name) {

    const value = `; ${document.cookie}`;

    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) return parts.pop().split(";").shift();

}
