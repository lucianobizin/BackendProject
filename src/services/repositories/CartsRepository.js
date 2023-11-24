export default class CartsService {

    constructor(dao){

        this.dao = dao;

    }

    getCarts = async () => {
        return await this.dao.get()
    }

    getCartById = async (cid) => {
        return await this.dao.getBy({_id: cid});
    }

    createCart = async () => {
        return await this.dao.create({cart:[{products:{}, quantity:0}]});
    }

    confirmCart = async (cid) => {
        return await this.dao.update(
            { _id: cid, expirationTime: { $exists: true } },
            { $unset: { expirationTime: "" } } // Se especifica el campo a eliminar
        );
    };

    updateCart = async (cid, products_) => {
        return await this.dao.update({ _id: cid }, { $set: { products : products_ } });
    }

    deleteExpiryDate = async (cid) => {
        return await this.dao.update({ _id: cid },{ $unset: { expiryDate: 1 } })
    }

    deleteCart = (cid) => {
        return this.dao.delete({ _id: cid });
    }
}