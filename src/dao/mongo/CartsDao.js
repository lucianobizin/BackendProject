import cartModel from "./models/cart.js";

export default class CartsDao {

    // getCarts = () => {
    //     return cartModel.find().lean();
    // };

    get = async (param) => {
        return await cartModel.find(param).lean();
    };

    // getCartById = (params) => {
    //     return cartModel.findOne(params).lean();
    // };

    getBy = async (params) => {
        return await cartModel.findOne(params).lean();
    };

    // createCart = () => {
    //     return cartModel.create({cart:[{products:{}, quantity:0}]});
    // };

    create = async (param) => {
        return await cartModel.create(param);
    };

    // updateCart = (cid, products) => {
    //     return cartModel.updateOne({ _id: cid }, { $set: { products : products } });
    // };

    update = async (searchParam, updateParam) => {
        return await cartModel.updateOne(searchParam, updateParam);
    };

    // deleteCart = (cid) => {
    //     return cartModel.deleteOne({ _id: cid });
    // };

    delete = async (param) => {
        return await cartModel.deleteOne(param);
    };

};

