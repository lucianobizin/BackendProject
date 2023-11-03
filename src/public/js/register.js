const registerForm = document.getElementById("registerForm");
const passwordError = document.getElementById("passwordError");

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const formData = new FormData(registerForm);

    const obj = {};
    formData.forEach((value, key) => {
        obj[key] = value;
    })

    const response = await fetch("/api/sessions/register", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": 'application/json'
        }
    })

    const result = await response.json();
    
    if (result.status === "success") {

        passwordError.textContent = 'User seccessfully created! Now, you will be redirected to our login page';
        setTimeout(() => {
            window.location.replace('/login');
        }, 3500);

    } else if(result.status === 11000){

        passwordError.textContent = 'Email and/or username already used! Please, try other options!';
        setTimeout(() => {
            window.location.replace('/login');
        }, 3500);

    } else {

        passwordError.textContent = 'Something goes wrong! Please, try it again in a few minutes';
        setTimeout(() => {
            window.location.replace("/register");
        }, 2500);
    }

})