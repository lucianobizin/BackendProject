import jwt from "jsonwebtoken";
import config from "../config/config.js";
import UsersDto from "../dto/UsersDto.js";
import { errorsHandler } from "./error.controller.js";
import { usersService } from "../services/index.js";
import DMailTemplates from "../constants/DMailTemplates.js";
import { createHash, isValidPassword } from "../utils.js";
import MailerService from "../services/mailerService.js";
import { __dirname } from "../utils.js";
import fs from "fs";

const getCurrent = async (req, res, next) => {

    req.httpLog();

    try {

        const formattedUser = UsersDto.getTokenDTOFrom(req.user);

        res.sendSuccessWithPayload(formattedUser);

    } catch (error) {

        await errorsHandler(error, next);

    }

}

const postRegister = async (req, res, next) => {

    req.httpLog();

    try {

        const mailService = new MailerService();

        const result = await mailService.sendMail([req.user.email], DMailTemplates.WELCOME, { user: req.user });

    } catch (error) {

        req.errorLog(`Email to ${req.user.email} could not be sent - ${new Date().toLocaleTimeString()}`)

        await errorsHandler(error, next);
    }

    res.clearCookie("cart");

    res.sendSuccessWithPayload(req.user);

}

const postLogin = async (req, res, next) => {

    req.httpLog();

    try {

        if (req.user.role !== "admin") { // req.user = User

            await usersService.last_connectionUpdate(req.user._id, new Date(Date.now()))

            req.user.last_connection = new Date(Date.now());

            const tokenizedUser =  UsersDto.getTokenDTOFrom(req.user);

            const token = jwt.sign(tokenizedUser, config.JWT.SECRET, { expiresIn: "1d" });

            res.cookie(config.JWT.COOKIE, token, { httpOnly: true }); // authCookie

            res.clearCookie('cart');

            const cart = req.user.cart;

            res.cookie("cart", cart.toString());

            res.sendSuccess("Logged in");

        } else if (req.user.role === "admin") { // req.admin

            const tokenizedAdmin = UsersDto.getTokenDTOFrom(req.user)

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

    req.httpLog();

    try {

        if (req.user.role !== "admin") { // req.user = User

            try {

                const mailService = new MailerService();

                const result = await mailService.sendMail([req.user.email], DMailTemplates.WELCOME, { user: req.user });

            } catch (error) {

                req.errorLog(`Email to ${req.user.email} could not be sent - ${new Date().toLocaleTimeString()}`)

                await errorsHandler(error, next);
                
            }

            await usersService.last_connectionUpdate(req.user._id, new Date(Date.now()));

            req.user.last_connection = new Date(Date.now());

            const tokenizedUser = UsersDto.getTokenDTOFrom(req.user);

            const token = jwt.sign(tokenizedUser, config.JWT.SECRET, { expiresIn: "1d" });

            res.cookie(config.JWT.COOKIE, token, { httpOnly: true });

            res.redirectPage('/products');

        } else if (req.user.role === "admin") { // req.admin

            const tokenizedAdmin = UsersDto.getTokenDTOFrom(req.user)

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

    req.httpLog();

    try {

        if (req.user.role !== "admin") {

            try {

                const mailService = new MailerService();

                const result = await mailService.sendMail([req.user.email], DMailTemplates.WELCOME, { user: req.user });

            } catch (error) {

                req.errorLog(`Email to ${req.user.email} could not be sent - ${new Date().toLocaleTimeString()}`)

                await errorsHandler(error, next);

            }

            await usersService.last_connectionUpdate(req.user._id, new Date(Date.now()));

            req.user.last_connection = new Date(Date.now());

            const tokenizedUser = UsersDto.getTokenDTOFrom(req.user)

            const token = jwt.sign(tokenizedUser, config.JWT.SECRET, { expiresIn: "1d" });

            res.cookie(config.JWT.COOKIE, token, { httpOnly: true }); // authCookie

            res.redirectPage('/products');

        } else if (req.user.role === "admin") { // req.admin

            const tokenizedAdmin = UsersDto.getTokenDTOFrom(req.user);

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

    req.httpLog();

    try {

        res.sendSuccessWithPayload(req.user);

    } catch (error) {

        await errorsHandler(error, next);

    }

}

const postLogout = async (req, res, next) => {

    req.httpLog();

    try {

        res.clearCookie(config.JWT.COOKIE);

        res.clearCookie("cart");

        await usersService.last_connectionUpdate(req.user._id, new Date(Date.now()))

        return res.sendSuccess("Successfully logged out");

    } catch (error) {

        await errorsHandler(error, next);

    }

}

const passwordRestoreRequest = async (req, res, next) => {

    req.httpLog();

    try {

        const { email } = req.body;

        const user = await usersService.getUserBy({ email: email });

        if (!user) return res.sendBadRequest("User is not registered in our database");

        const token = jwt.sign({ email }, config.JWT.SECRET, { expiresIn: "1d" });

        const mailerService = new MailerService();

        const result = await mailerService.sendMail([email], DMailTemplates.PWD_RESTORE, { token });

        res.sendSuccess("Email sent")

    } catch (error) {

        res.errorsHandler(error, next)

    }


}

const restorePassword = async (req, res, next) => {

    req.httpLog();

    const { newPassword, token } = req.body;

    if (!newPassword || !token) return res.sendIncorrectParameters("Incomplete values");

    try {

        const { email } = jwt.verify(token, config.JWT.SECRET);

        const user = await usersService.getUserBy({ email: email });

        if (!user) return res.sendIncorrectParameters("User does not exist");

        const isSamePassword = await isValidPassword(user, user.password);

        if (isSamePassword) return res.sendIncorrectParameters("New password must be different respect to the last one");

        const hashedNewPassword = await createHash(newPassword);

        const result = await usersService.passwordUpdate(user._id, hashedNewPassword);

        res.sendSuccess("Password updated");

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
    postLogout,
    passwordRestoreRequest,
    restorePassword

}