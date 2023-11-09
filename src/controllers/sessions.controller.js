import jwt from "jsonwebtoken";
import config from "../config/config.js";
import UsersDto from "../dto/UsersDto.js";
import { errorsHandler } from "./error.controller.js";

const getCurrent = async (req, res, next) => {

    try {

        const formattedUser = UsersDto.formatUser(req.user);

        req.httpLog();

        res.sendSuccessWithPayload(formattedUser);

    } catch (error) {

        await errorsHandler(error, next);

    }

}

const postRegister = async (req, res, next) => {

    try {

        res.clearCookie("cart");

        req.httpLog();

        res.sendSuccessWithPayload(req.user);

    } catch (error) {

        await errorsHandler(error, next);

    }

}

const postLogin = async (req, res, next) => {

    try {

        if (req.user.role !== "admin") { // req.user = User

            const tokenizedUser = {

                _id: req.user._id,
                email: req.user.email,
                userName: req.user.userName,
                role: req.user.role,
                cart: req.user.cart

            }

            const token = jwt.sign(tokenizedUser, config.JWT.SECRET, { expiresIn: "1d" });

            res.cookie(config.JWT.COOKIE, token, { httpOnly: true }); // authCookie

            res.clearCookie('cart');

            const cart = req.user.cart;

            res.cookie("cart", cart.toString());

            req.httpLog();

            res.sendSuccess("Logged in");

        } else if (req.user.role === "admin") { // req.admin

            const tokenizedAdmin = {
                userName: "admin",
                role: "admin"
            }

            const token = jwt.sign(tokenizedAdmin, config.JWT.SECRET, { expiresIn: "1d" }); // "ultrasecretCOD3"

            res.cookie(config.JWT.COOKIE, token, { httpOnly: true });

            res.clearCookie("cart");

            req.warningLog("Admin connected: some critical processes might be permanently changed")

            res.sendSuccess("Logged in");
        }

    } catch (error) {

        await errorsHandler(error, next);

    }

}

const postLoginGithub = async (req, res) => { }

const postLoginGithubCallback = async (req, res, next) => {

    try {

        if (req.user.role !== "admin") { // req.user = User

            const tokenizedUser = {

                _id: req.user._id,
                email: req.user.email,
                userName: req.user.userName,
                role: req.user.role,
                cart: req.user.cart
            }

            const token = jwt.sign(tokenizedUser, config.JWT.SECRET, { expiresIn: "1d" });

            res.cookie(config.JWT.COOKIE, token, { httpOnly: true }); // authCookie

            req.httpLog();

            res.redirectPage('/products');


        } else if (req.user.role === "admin") { // req.admin

            const tokenizedAdmin = {
                userName: "admin",
                role: "admin"
            };

            const token = jwt.sign(tokenizedAdmin, config.JWT.SECRET, { expiresIn: "1d" }); // "ultrasecretCOD3"

            res.cookie(config.JWT.COOKIE, token, { httpOnly: true });

            res.clearCookie("cart");

            req.warningLog("Admin connected: some critical processes might be permanently changed")

            res.redirectPage('/products');

        }

    } catch (error) {

        await errorsHandler(error, next);
        // res.sendInternalError("Something goes wrong with the server, please, try in a few minutes");

    }

}

const postLoginGoogle = async (req, res) => { }

const postLoginGoogleCallback = async (req, res, next) => {

    try {

        if (req.user.role !== "admin") { // req.user = User

            const tokenizedUser = {
                _id: req.user._id,
                email: req.user.email,
                userName: req.user.userName,
                role: req.user.role,
                cart: req.user.cart
            }

            const token = jwt.sign(tokenizedUser, config.JWT.SECRET, { expiresIn: "1d" });

            res.cookie(config.JWT.COOKIE, token, { httpOnly: true }); // authCookie

            req.httpLog();

            res.redirectPage('/products');


        } else if (req.user.role === "admin") { // req.admin

            const tokenizedAdmin = {
                userName: "admin",
                role: "admin"
            };

            const token = jwt.sign(tokenizedAdmin, config.JWT.SECRET, { expiresIn: "1d" }); // "ultrasecretCOD3"

            res.cookie(config.JWT.COOKIE, token, { httpOnly: true });

            res.clearCookie("cart");

            req.warningLog("Admin connected: some critical processes might be permanently changed")

            res.redirectPage('/products');

        }

    } catch (error) {

        await errorsHandler(error, next);

    }

}

const getProfile = async (req, res, next) => {

    try {

        req.httpLog();

        res.sendSuccessWithPayload(req.user);

    } catch (error) {

        await errorsHandler(error, next);

    }

}

const postLogout = async (req, res, next) => {

    try {

        res.clearCookie(config.JWT.COOKIE);

        res.clearCookie("cart");

        req.httpLog();

        return res.sendSuccess("Successfully logged out");

    } catch (error) {

        await errorsHandler(error, next);

    }

}

export default {

    getCurrent,
    postRegister,
    postLogin,
    postLoginGithub,
    postLoginGithubCallback,
    postLoginGoogle,
    postLoginGoogleCallback,
    getProfile,
    postLogout

}