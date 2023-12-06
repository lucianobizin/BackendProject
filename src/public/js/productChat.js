const submainContainer = document.getElementById("submain-container")
const chatButton = document.getElementById("chat-button");
const productsButton = document.getElementById("products-button");
const chatContainer = document.getElementById("chat-container");
const closeChatButton = document.getElementById("close-chat-button");
const loadingText = document.getElementById("loading-text");
const chatBox = document.getElementById("chat-box");
const inputPanel = document.getElementById("input-panel")
const sendButton = document.getElementById('send-button');
const chatPanel = document.getElementById('chat-content');

const path = window.location.pathname;
const productId = path.split("/")[path.split("/").length-1]

let user;

const socket = io({
    autoConnect: false
});

fetchUser();

productsButton.addEventListener("click", function (){
    window.location.href = "/products";
})

chatButton.addEventListener("click", function () {
    submainContainer.style.width = "50%";
    chatContainer.style.width = "50%";
    chatContainer.style.display = "flex";
    chatContainer.style.flexDirection = "column";
    chatContainer.style.justifyContent = "center";
    inputPanel.style.display = "flex";
    inputPanel.style.flexDirection = "column";
    inputPanel.style.justifyContent = "center";
    closeChatButton.style.display = "block";
    closeChatButton.style.marginTop = "25px";

});

closeChatButton.addEventListener("click", function () {
    submainContainer.style.width = "100%";
    chatContainer.style.display = "none";
    closeChatButton.style.display = "none";
});

chatBox.addEventListener("keyup", event => {
    if(event.key === "Enter"){
        if(chatBox.value.trim().length>0){
            const messageBody = {
                room: productId,
                email: user.email,
                username: user.userName,
                body: chatBox.value.trim()
            };
            console.log("messageBody ---> ", messageBody);
            socket.emit("chat:message", messageBody);
            chatBox.value = "";
        }
    }
})

sendButton.addEventListener("click", event => {
    if(chatBox.value.trim().length>0){
        const messageBody = {
            room: productId,
            email: user.email,
            username: user.userName,
            body: chatBox.value.trim()
        };
        console.log("messageBody ---> ", messageBody);
        socket.emit("chat:message", messageBody);
        chatBox.value = "";
    }
})

socket.on("chat:logMessages", message => {
    const p = document.createElement("p");
    p.innerHTML = user.email === message.email ? message.body : `${message.username} dice ${message.body}`;
    chatPanel.appendChild(p)
});

async function fetchUser(){
    const response = await fetch("/api/sessions/current");
    if(response.status === 200){
        const result = await response.json();
        user = result.payload; // The user is now in the front-end
        await fetchMessages()
        await socket.connect();
        socket.emit("chat:joinRoom", productId)
    } else {
        loadingText.innerHTML = "To participate in this chat you must be logged in";
        chatBox.setAttribute("disabled", true);
        sendButton.setAttribute("disabled", true);
    }
};

async function fetchMessages(){

    const response = await fetch(`/api/messages/${productId}`);

    if(response.status === 200){

        const result = await response.json();

        const messages = result.payload; // The user is now in the front-end

        if(messages.length>0){
            const fragment = document.createDocumentFragment();
            for(const message of messages){
                const p = document.createElement("p");
                p.innerHTML = user.email === message.email ? message.body : `${message.username} dice: ${message.body}`;
                fragment.appendChild(p)
            }
            chatPanel.appendChild(fragment);
            loadingText.remove();

        } else{
            loadingText.innerHTML = "Be the first one to write a message"
        }

        console.log(messages);

    }

}

