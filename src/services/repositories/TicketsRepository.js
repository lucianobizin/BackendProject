export default class TicketsRepository {

    constructor(dao) {

        this.dao = dao
    }

    getTickets = (filter, limit, page, sort) => {
        return this.dao.get(filter, {limit:limit, page:page, sort:{ "amount": sort }, lean:true});
    }

    getTicketByCode = (code) => {
        if (typeof code !== 'object') {
            code = { code };
        }
        return this.dao.getBy(code);
    }

    createTicket= (ticket) => {
        return this.dao.create(ticket);
    }

}