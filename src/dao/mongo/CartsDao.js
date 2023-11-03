import cartModel from "./models/cart.js";

export default class CartsDao {

    // getCarts = () => {
    //     return cartModel.find().lean();
    // };

    get = (param) => {
        return cartModel.find(param).lean();
    };

    // getCartById = (params) => {
    //     return cartModel.findOne(params).lean();
    // };

    getBy = (params) => {
        return cartModel.findOne(params).lean();
    };

    // createCart = () => {
    //     return cartModel.create({cart:[{products:{}, quantity:0}]});
    // };

    create = (param) => {
        return cartModel.create(param);
    };

    // updateCart = (cid, products) => {
    //     return cartModel.updateOne({ _id: cid }, { $set: { products : products } });
    // };

    update = (searchParam, updateParam) => {
        return cartModel.updateOne(searchParam, updateParam);
    };

    // deleteCart = (cid) => {
    //     return cartModel.deleteOne({ _id: cid });
    // };

    delete = (param) => {
        return cartModel.deleteOne(param);
    };

};

