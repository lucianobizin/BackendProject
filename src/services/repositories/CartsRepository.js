export default class CartsService {

    constructor(dao){

        this.dao = dao;

    }

    getCarts = () => {
        return this.dao.get()
    }

    getCartById = (cid) => {

        if (typeof cid !== 'object') {
            cid = { cid };
        }
        return this.dao.getBy(cid);
    }

    createCart = () => {
        return this.dao.create({cart:[{products:{}, quantity:0}]});
    }

    updateCart = (cid, products_) => {
        return this.dao.update({ _id: cid }, { $set: { products : products_ } });
    }

    deleteCart = (cid) => {
        return this.dao.delete({ _id: cid });
    }
}