const uploadDocumentsButton = document.getElementById("uploadDocuments");

uploadDocumentsButton.addEventListener("click", async (event) => {

    event.preventDefault()

    const response = await fetch(`./upload-documents`, {
        method: "GET",
    });

    if (response.ok) {

        window.location.href = "./upload-documents";

    } 

});