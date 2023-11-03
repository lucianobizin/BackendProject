import messageModel from "./models/messages.js";

export default class MessagesDao{

    get = (param) => {
        return messageModel.find(param).lean();
    };

    create = (param) => {
        return messageModel.create(param);
    };

};