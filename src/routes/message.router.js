import messagesController from "../controllers/messages.controller.js";
import BaseRouter from "./BaseRouter.js";

class MessageRouter extends BaseRouter {
    
    init(){

        this.get("/:room", ["AUTH"], messagesController.getMessages);

    }

}

const messageRouter = new MessageRouter();

export default messageRouter.getRouter();