export default class MessagesRepository {

    constructor(dao) {

        this.dao = dao
    }

    getMessages = (param) => {
        return this.dao.get(param);
    }

    createMessage = (message) => {
        return this.dao.create(message);
    }

}