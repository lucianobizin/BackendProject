import productsModel from "./models/products.js";

export default class ProductsDao {

    get = (filter, params) => {
        return productsModel.paginate(filter, params);
    };

    getAll = (param) => {
        return productsModel.find(param);
    };

    getBy = (params) => {
        return productsModel.findOne(params).lean();
    };

    create = (param) => {
        return productsModel.create(param);
    };

    updateOne = (searchParam, updateParam) => {
        return productsModel.updateOne(searchParam, updateParam);
    };

    deleteOne = (param) => {
        return productsModel.deleteOne(param);
    };

};