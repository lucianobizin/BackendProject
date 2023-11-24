import { messagesService } from "../services/index.js";
import { errorsHandler } from "./error.controller.js";

const getMessages = async (req, res, next) => {

    req.httpLog();

    try {

        const { room } = req.params;

        if(!room) res.sendIncorrectParameters("Introduce a corrrect room")

        const date = new Date();

        date.setMonth(date.getMonth() - 1);

        const searchFilter = {

            createdAt: { $gte: date.toString() }

        };

        searchFilter.room = room;
        
        const messages = await messagesService.getMessages(searchFilter);

        if(!messages) res.sendBadRequest("There was an error when retrieving messages")

        res.sendSuccessWithPayload(messages);

    } catch (error) {

        await errorsHandler(error, next);

    }

}

export default {

    getMessages

}