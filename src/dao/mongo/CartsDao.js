import cartModel from "./models/cart.js";

export default class CartsDao {

    get = async (param) => {
        return await cartModel.find(param).lean();
    };

    getBy = async (params) => {
        return await cartModel.findOne(params).lean();
    };

    create = async (param) => {
        return await cartModel.create(param);
    };

    update = async (searchParam, updateParam) => {
        return await cartModel.updateOne(searchParam, updateParam);
    };

    delete = async (param) => {
        return await cartModel.deleteOne(param);
    };

};

