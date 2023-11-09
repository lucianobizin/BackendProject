const loginForm = document.getElementById("loginForm");
const registerButton = document.getElementById("buttonRegister");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const formData = new FormData(loginForm);

    const obj = {};
    formData.forEach((value, key) => {
        obj[key] = value;
    })

    const response = await fetch("./api/sessions/login", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": 'application/json'
        }
    })

    const result = await response.json();

    if(result.status === "success"){
        window.location.replace('/products')
    } else {
        window.location.replace('/register')
    }

})

registerButton.addEventListener("click", async () => {
    window.location.replace('/register')
})
