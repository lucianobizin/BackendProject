import CloudStorageService from "../services/cloudStorageService.js";
import { productsService } from "../services/index.js";
import { generateUsers } from "../mocks/mockProducts.js";
import { errorsHandler } from "./error.controller.js";

const getProducts = async (req, res, next) => {

    req.httpLog();

    try {

        let { limit = 10, page = 1, sort, query } = req.query;

        limit = isNaN(parseInt(limit)) || limit < 1 ? 10 : limit;

        page = isNaN(parseInt(limit)) || page < 1 ? 1 : page;

        const validSortValues = [1, -1];

        sort = validSortValues.includes(parseInt(sort)) ? parseInt(sort) : 1;

        let filter = query ? JSON.parse(query) : {};

        const products = await productsService.getProducts(limit, page, sort, filter)

        res.sendSuccessWithPayload(products)

    } catch (error) {

        await errorsHandler(error, next);

    }

};

const postProducts = async (req, res, next) => {

    req.httpLog();

    try {

        if (req.user.role !== "admin" && req.user.role !== "premium") return res.sendForbidden("Unauthorised user");

        const {
            title,
            description,
            price,
            stock,
            code,
            category,
        } = req.body


        if (!title || !description || !price || !stock || !code || !category) return res.sendIncorrectParameters("Incomplete values");

        let newProduct = {};

        if (req.user.role === "premium") {

            newProduct = {
                title,
                description,
                price,
                stock,
                code,
                category,
                owner: req.user.email
            }

        } else if ((req.user.role === "admin")){

            newProduct = {
                title,
                description,
                price,
                stock,
                code,
                category,
            }

        }

        const newProductCheckingCode = await productsService.getProductsByCode(newProduct.code);

        if(newProductCheckingCode) return res.sendIncorrectParameters("Incorrect values");

        const googleStorageService = new CloudStorageService();

        const images = [];

        for (const file of req.files) {

            const url = await googleStorageService.uploadFileToCloudStorage("products", "product_img", file);

            images.push(url);

        }

        newProduct.thumbnail = images;

        const result = await productsService.createProduct(newProduct);

        res.sendSuccessWithPayload(result._id);

    } catch (error) {

        await errorsHandler(error, next);

    }

};

const putProducts = async (req, res, next) => {

    req.httpLog();

    try {

        const {
            title,
            description,
            price,
            stock,
            code,
            category,
            status
        } = req.body;

        const updatedProduct = {
            title,
            description,
            price,
            stock,
            code,
            category,
            status
        };

        
        const product = await productsService.getProductsById({ _id: req.pid });

        if (!product) return sendIncorrectParameters(`Product with id ${req.pid} does not exist`);

        if(product.owner === "admin" && req.user.role === "premium") {

            req.warningLog(`User ${req.user.email} with ${req.user.role} is trying to modify admin's product ${product._id}- ${new Date().toLocaleTimeString()}`);
            
            res.sendForbidden("Premium users are not allowed to modify admin's products");

        }

        if((req.user.role === "admin") || (req.user.role === "premium" && product.owner !== "admin")) {

            await productsService.updateProduct(req.pid, updatedProduct);
    
            res.sendSuccess(`Product with id ${req.pid} was updated`);

        }

    } catch (error) {

        await errorsHandler(error, next);

    }

};

const deleteProducts = async (req, res, next) => {

    req.httpLog();

    try {

        const product = await productsService.getProductsById(req.pid);

        if (!product) return res.sendIncorrectParameters(`Product with id ${req.pid} does not exist`);

        if(product.owner === "admin" && req.user.role === "premium") {

            req.warningLog(`User ${req.user.email} with ${req.user.role} is trying to delete admin's product ${product._id}- ${new Date().toLocaleTimeString()}`);
            
            res.sendForbidden("Premium users are not allowed to delete admin's products");

        }

        if((req.user.role === "admin") || (product.owner !== "admin" && req.user.role === "premium" && product.owner === req.user.email)) {

            await productsService.deleteProduct(req.pid);
    
            res.sendSuccess(`Product with id ${req.pid} was deleted`);

        } else {

            res.sendForbidden("Your are not allowed to delete other users' products")

        }

    } catch (error) {

        await errorsHandler(error, next);

    }

};

export default {
    getProducts,
    postProducts,
    putProducts,
    deleteProducts
}