document.addEventListener("DOMContentLoaded", function () {

    const purchaseButton = document.getElementById("purchaseButton");

    const deleteButtons = document.querySelectorAll("#deleteProductButton");

    const mainProductsButton = document.getElementById("mainProducts");

    const cartId = getCookie("cart");

    deleteButtons.forEach((button) => {

        button.addEventListener("click", async function () {

            const productId = button.getAttribute("data-product-id");

            if (productId) {

                const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                    method: "DELETE",
                    headers: {

                        "Content-Type": 'application/json'
    
                    }
                });

                const result = await response.json();

                if(result.status === "success"){
                    alert(result.message);
                    window.location.reload();
                } else {
                    alert("An error occurred while deleting a product, please try again later.");
                }

            };

        });

    });

    mainProductsButton.addEventListener("click", (e) => {

        e.preventDefault();

        try {

                window.location.replace('/products');

        } catch (error) {

            alert('Something went wrong! Go manually to /products');

        }
    })

    purchaseButton.addEventListener('click', async (e) => {

        e.preventDefault();

        try {

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

})

function getCookie(name) {

    const value = `; ${document.cookie}`;

    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) return parts.pop().split(";").shift();

}
