import jwt from "jsonwebtoken";
import config from "../config/config.js"
import { usersService } from "../services/index.js";
import { errorsHandler } from "./error.controller.js";
import UsersDto from "../dto/UsersDto.js";
import CloudStorageService from "../services/cloudStorageService.js";

const upgradeRole = async (req, res, next) => {

    req.httpLog();

    try {

        if (req.user.role === "premium") return res.sendForbidden("Unauthorised user");

        req.user.role = req.user.role !== "admin" ? "premium" : req.user.role;

        // if(req.user.role === "user") res.sendInternalError("Something goes wrong with the server, please, retry in a few minutes");

        await usersService.roleUpdate(req.uid, req.user.role);

        // res.locals.upgradeSuccess = true;

        const tokenizedUser = UsersDto.getTokenDTOFrom(req.user);
        
        const token = jwt.sign(tokenizedUser, config.JWT.SECRET, {expiresIn:"1d"});
        
        res.cookie(config.JWT.COOKIE, token);

        // res.clearCookie("authCookie");

        res.sendSuccess(`User with uid ${req.uid} has been successfully upgraded to user premium. You must logout and log in againt to get your role effectively upgraded`)

    } catch (error) {

        await errorsHandler(error, next);

    }

};

const getMockUsers = async (req, res, next) => {

    req.httpLog();

    try {

        const mockProductsList = [];

        for (let i = 0; i < 100; i++) {

            const mockProducts = generateUsers();

            mockProductsList.push(mockProducts)

        }

        res.sendSuccessWithPayload(mockProductsList);

    }
    catch (error) {

        await errorsHandler(error, next);

    }

};

const postDocumentation = async (req, res, next) => {

    req.httpLog();

    try {

        const googleStorageService = new CloudStorageService();

        let url = "";

        let name;

        for (const file of req.files) {

            name = file.originalname;

            if (name.includes("profile")) {

                url = await googleStorageService.uploadFileToCloudStorage("profile", "profile_photo", file);

            }

            else if (name.includes("documents")) {

                if (name.includes("identification")) {
                    url = await googleStorageService.uploadFileToCloudStorage("documents", "identification", file);
                }

                else if (name.includes("address")) {
                    url = await googleStorageService.uploadFileToCloudStorage("documents", "addressProof", file);
                }

                else if (name.includes("Account")) {
                    url = await googleStorageService.uploadFileToCloudStorage("documents", "accountProof", file);
                }

            }


        }

        newProduct.thumbnail = url;

        const newDocument = [{ name: name, reference: url }];

        await usersService.updateUser(req.uid, newDocument);

        res.sendSuccess("Documents successfully updated");

    } catch (error) {

        await errorsHandler(error, next);

    }


}

export default {
    upgradeRole,
    getMockUsers,
    postDocumentation
}