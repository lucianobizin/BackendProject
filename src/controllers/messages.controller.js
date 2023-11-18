import { messagesService } from "../services/index.js";
import { errorsHandler } from "./error.controller.js";

const getMessages = async (req, res, next) => {

    req.httpLog();

    try {

        const { room } = req.params;

        const date = new Date();

        date.setMonth(date.getMonth() - 1);

        const searchFilter = {

            createdAt: { $gte: date.toString() }

        };

        if (room) {

            searchFilter.room = room;
            
        }

        const messages = await messagesService.getMessages(searchFilter);

        res.sendSuccessWithPayload(messages);

    } catch (error) {

        await errorsHandler(error, next);

    }

}

export default {

    getMessages

}