const upgradetButton = document.getElementById("upgradeRoleButton");
const userIdElement = document.getElementById("userId");
const userId = userIdElement.textContent.split(":")[1].trim();

upgradetButton.addEventListener("click", async (event) => {

    event.preventDefault()

    const response = await fetch(`./api/users/premium/${userId}`, {
        method: "GET",
    });

    const result = await response.json();
    if (result.status === "success") {

        return window.location.replace('/user-upgrade')
    }
});