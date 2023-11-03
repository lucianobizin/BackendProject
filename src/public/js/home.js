async function addProduct(id){
    const cart = getCookie("cart")
    if(cart){
        const response = await fetch (`/api/cart/${cart}/products/${id}`, {
            method: "PUT"
        })
    
        const result = await response.json();
        console.log(result)
    } else {
        const response = await fetch (`/api/cart/products/${id}`, {
            method: "PUT"
        })
    
        const result = await response.json();
        console.log(result)
    }

}

function getCookie(name){
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length===2) return parts.pop().split(";").shift();
}