export default class ProductsService {

    constructor(dao) {

        this.dao = dao
    }

    // getProducts = (limit, page, sort, filter) => {
    //     return this.dao.getProducts(limit, page, sort, filter);
    // }

    getProducts = (filter, limit, page, sort) => {
        return this.dao.get(filter, {limit:limit, page:page, sort:{ "price": sort }, lean:true});
    }

    // getProductsById = (params) => {
    //     return this.dao.getProductsById(params);
    // }

    getProductsById = (pid) => {

        if (typeof pid !== 'object') {
            pid = { _id: pid };
        }

        return this.dao.getBy(pid);
    }

    // createProduct = (product) => {
    //     return this.dao.createProduct(product);
    // }

    getProductsByIds = async (productIds) => {

        const products = await this.dao.getAll({ _id: { $in: productIds } });
        console.log("products ---> ", products)
        return products;

    };

    createProduct = (product) => {
        return this.dao.create(product);
    }

    // updateProduct = (pid, product) => {
    //     return this.dao.updateProduct(pid, product);
    // }

    updateProduct = (pid, product) => {
        return this.dao.updateOne({ _id: pid }, { $set: product });
    }

    deleteProduct = (pid) => {
        return this.dao.deleteOne({_id: pid});
    }

}