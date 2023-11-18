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

    if (result.status === "success") {
        window.location.replace('/products')
    } else {
        window.location.replace('/register')
    }

})

registerButton.addEventListener("click", async () => {
    window.location.replace('/register')
})

async function resetPassword() {

    const result = await Swal.fire({
        title: 'Reset Password',
        text: "Please, share your email to reset your password",
        input: "email",
        showCancelButton: true,
        confirmButtonText: 'Reset',
        inputAttributes: {
            autocapitalize: 'off',
            autocorrect: 'off',
        },
        inputValidator: value => {
            return !value && "Introduce an email address to receive reset instructions"
        },

    })

    try {

        if (result.value) {

            const email = result.value;

            const response = await fetch("api/sessions/passwordRestoreRequest", {

                method: "POST",
                body: JSON.stringify({ email }),
                headers: {
                    "Content-Type": "application/json"
                }

            });

            Swal.fire({
                status:"success",
                text: "If you are registered, will receive a an email with the link to restore your password",
            })

        }

    } catch (error) {

            console.log(error)

        }
    }

