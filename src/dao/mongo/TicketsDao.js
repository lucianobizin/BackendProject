import ticketsModel from "./models/ticket.js";

export default class TicketsDao {

    get = () => {
        return ticketsModel.find().lean();
    };

    getBy = (param) => {
        return ticketsModel.findOne(param).lean();
    };

    create = (param) => {
        return ticketsModel.create(param);
    };



}