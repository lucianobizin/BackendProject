import CloudStorageService from "../services/cloudStorageService.js";
import { productsService } from "../services/index.js";
import { generateProducts } from "../mocks/mockProducts.js";
import { errorsHandler } from "./error.controller.js";

const getProducts = async (req, res, next) => {

    try {

        let { limit = 10, page = 1, sort, query } = req.query;

        limit = isNaN(parseInt(limit)) || limit < 1 ? 10 : limit;

        page = isNaN(parseInt(limit)) || page < 1 ? 1 : page;

        const validSortValues = [1, -1];

        sort = validSortValues.includes(parseInt(sort)) ? parseInt(sort) : 1;

        let filter = query ? JSON.parse(query) : {};

        const products = await productsService.getProducts(limit, page, sort, filter)

        req.httpLog();

        res.sendSuccessWithPayload(products)

    } catch (error) {

        await errorsHandler(error, next);

    }

};

const getMockProducts = async (req, res, next) => {

    try {

        const mockProductsList = [];

        for (let i = 0; i < 100; i++) {

            const mockProducts = generateProducts();

            mockProductsList.push(mockProducts)

        }

        req.httpLog();

        res.sendSuccessWithPayload(mockProductsList);

    }
    catch (error) {

        await errorsHandler(error, next);

    }

};

const postProducts = async (req, res, next) => {

    try {


        if (req.user.role !== "admin") return res.sendForbidden("Unauthorised user");

        const {
            title,
            description,
            price,
            stock,
            code,
            category,
            status,
        } = req.body

        if (!title || !description || !price || !stock || !code || !category) return res.sendIncorrectParameters("Incomplete values");

        const newProduct = {
            title,
            description,
            price,
            stock,
            code,
            category,
            status,
        }

        const googleStorageService = new CloudStorageService();

        const images = [];

        for (const file of req.files) { // Aquí hay un problema

            const url = await googleStorageService.uploadFileToCloudStorage(file);

            images.push(url);
            
        }

        newProduct.thumbnail = images;

        const result = await productsService.createProduct(newProduct);

        req.httpLog();

        res.sendSuccessWithPayload(result._id);

    } catch (error) {

        await errorsHandler(error, next);

    }

};

const putProducts = async (req, res, next) => {

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

        const product = await productsService.getProductById({ _id: req.pid });

        if (!product) return sendIncorrectParameters(`Product with id ${req.pid} does not exist`);

        await productsService.updateProduct(req.pid, updatedProduct);

        req.httpLog();

        res.sendSuccess(`Product with id ${req.pid} was updated`)

    } catch (error) {

        await errorsHandler(error, next);

    }

};

const deleteProducts = async (req, res, next) => {

    try {

        const product = await productsService.getProductById({ _id: req.pid });

        if (!product) return res.sendIncorrectParameters(`Product with id ${req.pid} does not exist`);

        await productsService.deleteProduct(req.pid);

        req.httpLog();

        res.sendSuccess(`Product with id ${req.pid} was deleted`);

    } catch (error) {

        await errorsHandler(error, next);

    }

};

export default {
    getProducts,
    getMockProducts,
    postProducts,
    putProducts,
    deleteProducts
}