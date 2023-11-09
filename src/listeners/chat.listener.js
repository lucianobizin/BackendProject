import { messagesService } from "../services/index.js";

const registerChatHandler = (io, socket) => { // We pass the io and the socket that triggers it
    
    const saveMessage = async (data) => {

        const result = await messagesService.createMessage(data)

        io.to(data.room).emit("chat:logMessages", data)

    }

    const joinSocketToRoom = (room) => {

        socket.join(room);
    
    };

    socket.on("chat:message", saveMessage); // Similar to router, controller (listener is the new socket controller)
    
    socket.on("chat:joinRoom", joinSocketToRoom);

}

export default registerChatHandler;
