const productForm = document.getElementById("newProductForm");

productForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const formData = new FormData(productForm);

    try {
        const response = await fetch("/api/products", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (result.status === "success") {

            alert('Product successfully created!');
            window.location.replace('/products');

        } else {

            alert('Error creating the product. Please try again.');
            window.location.reload();

        }

    } catch (error) {

        console.error('Error creating the product:', error);

        alert('Something went wrong! Please try again later.');

        window.location.reload();

    }

});