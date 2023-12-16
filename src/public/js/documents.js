const documentsForm = document.getElementById("documentsForm");
const goToProfileButton = document.getElementById("goToProfileButton");
const idProfile = document.getElementById("userIdProfile");
const userIdProfile = idProfile.textContent.split(":")[1].trim();

documentsForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const formData = new FormData(documentsForm);

    const response = await fetch(`/api/users/${userIdProfile}/documents`, {
        method: "POST",
        body: formData
    })

    const result = await response.json();

    if (result.status === "success") {

        setTimeout(() => {
            window.location.replace('/profile');
        }, 2000);

    } else {

        console.log("Something goes wrong")

    }

})

goToProfileButton.addEventListener("click", () => {
    window.location.href = "/profile";
});