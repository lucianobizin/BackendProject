const logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("click", async (event) => {

        event.preventDefault()

        const response = await fetch("./api/sessions/logout", {
            method: "POST",
        });

        const result = await response.json();
        if(result) window.location.replace('/products')

});