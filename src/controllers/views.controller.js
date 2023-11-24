import { format } from "path";
import { productsService, cartsService } from "../services/index.js";
import { errorsHandler } from "./error.controller.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const getRegisterPage = async (req, res, next) => {

    req.httpLog();

    try {

        res.renderPage('Register');

    } catch (error) {

        await errorsHandler(error, next);

    }
}

const getLoginPage = async (req, res, next) => {

    req.httpLog();

    try {

        res.renderPage('Login', { css: "./css/login.css" });

    } catch (error) {

        await errorsHandler(error, next);

    }

}

const getProfilePage = async (req, res, next) => {

    req.httpLog();

    try {

        const user = req.user;

        res.renderPage("Profile", { user });

    } catch (error) {

        await errorsHandler(error, next);

    }

}

const getRenderedProducts = async (req, res, next) => {

    req.httpLog();

    try {

        let { page, sort, category, availability, limit } = req.query;

        limit = isNaN(parseInt(limit)) || page < 1 || page > 9 ? 9 : limit;

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

    req.httpLog();

    try {

        const product = await productsService.getProductsById(req.pid);

        const css = `${req.protocol}://${req.hostname}:${process.env.PORT || 8080}/css/product.css`

        res.renderPage("Product", {
            css,
            product
        })

    } catch (error) {

        await errorsHandler(error, next);

    }

}

const getCartById = async (req, res, next) => {

    req.httpLog();

    try {

        const cart = await cartsService.getCartById(req.cid);

        if (!cart) return res.sendIncorrectParameters("Cart not found");

        if (!cart.products || !Array.isArray(cart.products)) return res.sendIncorrectParameters("Cart products are missing or not an array");

        res.renderPage("Cart", { cart });

    } catch (error) {

        await errorsHandler(error, next);

    }

}

const passwordRestore = async (req, res, next) => {

    req.httpLog();

    const { token } = req.query;

    if (!token) return res.renderPage("RestorePasswordError", { error: "Invalid route, you must request a new email to reset your password" });

    try {

        jwt.verify(token, config.JWT.SECRET);

        return res.renderPage("PasswordRestore");

    } catch (error) {

        if (error.expireAt) {
            return res.rendePage("RestorePasswordError", { error: "Token expired, please request a new one" })
        }

        res.renderPage("RestorePasswordError", { error: "Invalid or corrupt link" });

    }

}

const getDoesNotExistPage = async (req, res, next) => {

    req.httpLog();

    try {

        res.sendPageDoesNotExist("Page doesn't exist");

    } catch (error) {

        await errorsHandler(error, next);

    }

}

const getLoggers = async (req, res, next) => {

    req.httpLog();

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

const getSimple = async (req, res) => {
    let sum = 0;
    for (let i = 0; i < 100000; i++) {
        sum += 1
    }

    res.sendSuccessWithPayload(sum)
}

const getComplex = async (req, res) => {
    let sum = 0;
    for (let i = 0; i < 5e8; i++) {
        sum += 1
    }

    res.sendSuccessWithPayload(sum)

}

export default {

    getRegisterPage,
    getLoginPage,
    getProfilePage,
    getRenderedProducts,
    getProductInfo,
    getCartById,
    passwordRestore,
    getDoesNotExistPage,
    getLoggers,
    getSimple,
    getComplex

}