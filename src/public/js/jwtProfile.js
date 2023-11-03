const token = getCookie("authCookie");

if(!token) window.location.replace("/login");

fetch("/api/sessions/profile", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
        "Content-Type": 'application/json'
    }
});

const result = await response.json();

const user = result.payload;

const welcome = document.getElementById("Welcome");

const email = document.getElementById("email");

welcome.innerHTML = `Hola, ${user.userName}! Tu rol es ${user.role}`;

email.innerHTML = `Correo: ${user.email}`;

function getCookie(name){

    const value = `; ${document.cookie}`;

    const parts = value.split(`; ${name}=`);

    if (parts.length===2) return parts.pop().split(";").shift();

};

// Nuevo
const socket = io({
    autoConnect: false
})
