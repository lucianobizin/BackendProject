import { productsService, cartsService } from "../services/index.js";
import { errorsHandler } from "./error.controller.js";

const getRegisterPage = async (req, res, next) => {

    try {

        req.httpLog();

        res.renderPage('Register');

    } catch (error) {

        await errorsHandler(error, next);

    }
}

const getLoginPage = async (req, res, next) => {

    try {

        req.httpLog();

        res.renderPage('Login', { css: "./css/login.css" });

    } catch (error) {

        await errorsHandler(error, next);

    }

}

const getProfilePage = async (req, res, next) => {

    try {

        const user = req.user;

        req.httpLog();

        res.renderPage("Profile", { user });

    } catch (error) {

        await errorsHandler(error, next);

    }

}

const getRenderedProducts = async (req, res, next) => {

    try {

        let { page, sort, category, availability, limit } = req.query;

        limit = isNaN(parseInt(limit)) || page < 1 || page > 10 ? 10 : limit;

        page = isNaN(parseInt(page)) || page < 1 ? 1 : page;

        const validSortValues = [1, -1];

        sort = validSortValues.includes(parseInt(sort)) ? parseInt(sort) : 1;

        let filter = {};

        if (category && availability) {

            filter = { "category": category, "status": availability };

        } else if (category && !availability) {

            filter = { "category": category };

        } else if (!category && availability) {

            filter = { "status": availability };
        }

        const paginationProducts = await productsService.getProducts(filter, limit, page, sort);

        const products = paginationProducts.docs;

        const currentPage = paginationProducts.page;

        const { totalPages, prevPage, nextPage, hasPrevPage, hasNextPage } = paginationProducts;

        const prevLink = hasPrevPage ? `${req.protocol}://${req.hostname}:${process.env.PORT || 8080}/products/?page=${prevPage}` : null;

        const nextLink = hasNextPage ? `${req.protocol}://${req.hostname}:${process.env.PORT || 8080}/products/?page=${nextPage}` : null;

        // Por passportCall y passport.config => req.user = null || user
        const user = req.user;

        req.httpLog();

        res.renderPage("Home", {
            css: `${req.protocol}://${req.hostname}:${process.env.PORT || 8080}/css/home.css`,
            products,
            currentPage,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            totalPages,
            prevLink,
            nextLink,
            user

        })

    } catch (error) {

        await errorsHandler(error, next);

    }

}

const getProductInfo = async (req, res, next) => {

    try {

        const product = await productsService.getProductsById(req.pid);

        const css = `${req.protocol}://${req.hostname}:${process.env.PORT || 8080}/css/product.css`

        req.httpLog();

        res.renderPage("Product", {
            css,
            product
        })

    } catch (error) {

        await errorsHandler(error, next);

    }

}

const getCartById = async (req, res, next) => {

    try {

        const cart = await cartsService.getCartById({ _id: req.cid });

        if (!cart) return res.sendIncorrectParameters("Cart not found");

        if (!cart.products || !Array.isArray(cart.products)) return res.sendIncorrectParameters("Cart products are missing or not an array");

        req.httpLog();

        res.renderPage("Cart", { cart });

    } catch (e) {

        await errorsHandler(error, next);

    }

}

const getDoesNotExistPage = async (req, res, next) => {

    try {

        req.httpLog();

        res.sendPageDoesNotExist("Page doesn't exist");

    } catch (error) {

        await errorsHandler(error, next);

    }

}

const getLoggers = async (req, res, next) => {

    try {

        req.fatalLog("Probando fatal logger");
        req.errorLog("Probando error logger");
        req.warningLog("Probando warning logger");
        req.httpLog();
        req.infoLog("Probando info logger");

        res.sendSuccess("All logger in one endpoint, please revise VSC console");

    } catch (error) {

        await errorsHandler(error, next);

    }
}

export default {

    getRegisterPage,
    getLoginPage,
    getProfilePage,
    getRenderedProducts,
    getProductInfo,
    getCartById,
    getDoesNotExistPage,
    getLoggers

}