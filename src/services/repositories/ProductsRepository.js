export default class ProductsService {

    constructor(dao) {

        this.dao = dao
    }

    getProducts = (filter, limit, page, sort) => {
        return this.dao.get(filter, {limit:limit, page:page, sort:{ "price": sort }, lean:true});
    }

    getProductsById = (pid) => {

        if (typeof pid !== 'object') {
            pid = { _id: pid };
        }

        return this.dao.getBy(pid);
    }

    getProductsByCode = (code) => {

        return this.dao.getBy({ code: code });
    }

    getProductsByIds = async (productIds) => {

        const products = await this.dao.getAll({ _id: { $in: productIds } });
        return products;

    };

    createProduct = (product) => {
        return this.dao.create(product);
    }

    updateProduct = (pid, product) => {
        return this.dao.updateOne({ _id: pid }, { $set: product });
    }

    deleteProduct = (pid) => {
        return this.dao.deleteOne({_id: pid});
    }

}