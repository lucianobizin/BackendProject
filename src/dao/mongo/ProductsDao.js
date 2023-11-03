import productsModel from "./models/products.js";

export default class ProductsDao {

    // getProducts = (limit, page, sort, filter) => {
    //     return productsModel.paginate(filter, {limit:limit, page:page, sort:{ "price": sort }, lean:true});
    // };

    get = (filter, params) => {
        return productsModel.paginate(filter, params);
    };

    // getProductById = (params) => {
    //     return productsModel.findOne(params).lean();
    // };

    getAll = (param) => {
        return productsModel.find(param);
    };

    getBy = (params) => {
        return productsModel.findOne(params).lean();
    };

    // createProduct = (product) => {
    //     return productsModel.create(product);
    // };

    create = (param) => {
        return productsModel.create(param);
    };

    // updateProduct = (pid, product) => {
    //     return productsModel.updateOne({ _id: pid }, { $set: { product } });
    // };

    updateOne = (searchParam, updateParam) => {
        return productsModel.updateOne(searchParam, updateParam);
    };

    // deleteProduct = (pid) => {
    //     return productsModel.deleteOne({ _id: pid });
    // };

    deleteOne = (param) => {
        return productsModel.deleteOne(param);
    };

};