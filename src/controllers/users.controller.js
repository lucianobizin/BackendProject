import jwt from "jsonwebtoken";
import config from "../config/config.js"
import { usersService } from "../services/index.js";
import { errorsHandler } from "./error.controller.js";
import UsersDto from "../dto/UsersDto.js";
import CloudStorageService from "../services/cloudStorageService.js";
import { generateUsers } from "../mocks/mockProducts.js"

const getAllUsers = async (req, res, next) => {

    req.httpLog();

    try {

        if (req.user.role !== "admin") return res.sendForbidden("Unauthorised user");

        const allUsers = await usersService.getAllUsers();
        
        const users = UsersDto.allUsersInfo(allUsers)

        if(!users) return res.sendBadRequest("There was an error when traying to deliver all users");

        const css = `${req.protocol}://${req.hostname}:${config.app.PORT || 8080}/css/all-users.css`;

        res.renderPage("Users", {
            css,
            users
        })



    } catch (error) {

        await errorsHandler(error, next);

    }

}

const upgradeRole = async (req, res, next) => {

    req.httpLog();

    try {

        if (req.user.role === "premium") return res.sendForbidden("Unauthorised user");

        const result = await usersService.getUserBy({_id: req.user._id})
        
        if(!result) res.sendBadRequest("Something goes wrong when the user's info")

        req.user.documents = result.documents ? result.documents : []

        const requiredDocuments = ['profileImage', 'identificationDocument', 'addressProofDocument', 'accountStatementDocument'];

        const missingDocuments = requiredDocuments.filter(docType => {
            const isDocumentPresent = req.user?.documents?.some(doc => doc.name === docType);
            return !isDocumentPresent;
        });

        if (missingDocuments.length > 0) {
            return res.sendBadRequest(`Must upload all documents before upgrading your role. You are lacking the following documents: ${missingDocuments.join(', ')}`);
        }

        req.user.role = req.user.role !== "admin" ? "premium" : req.user.role;

        // if(req.user.role === "user") res.sendInternalError("Something goes wrong with the server, please, retry in a few minutes");

        await usersService.roleUpdate(req.uid, req.user.role);

        // res.locals.upgradeSuccess = true;

        const tokenizedUser = UsersDto.getTokenDTOFrom(req.user);

        const token = jwt.sign(tokenizedUser, config.JWT.SECRET, { expiresIn: "1d" });

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

        let fieldname;

        const resultUser = await usersService.getUserBy({_id: req.user._id})
        
        if(!resultUser) res.sendBadRequest("Something goes wrong when the user's info")

        const documents = resultUser.documents ? resultUser.documents : [];

        req.user.documents = documents

        const existingDocuments = req.user.documents || [];

        let newDocuments  = [];

        for (const fieldName in req.files) {

            if (Object.hasOwnProperty.call(req.files, fieldName)) {

                const file = req.files[fieldName][0];

                fieldname = file.fieldname;

                if (fieldname.includes("profile")) {

                    url = await googleStorageService.uploadFileToCloudStorage("profile", "profileImage", file);

                }

                else if (fieldname.includes("Document")) {

                    if (fieldname.includes("identification")) {
                        url = await googleStorageService.uploadFileToCloudStorage("documents", "identificationProof", file);
                    }

                    else if (fieldname.includes("address")) {
                        url = await googleStorageService.uploadFileToCloudStorage("documents", "addressProof", file);
                    }

                    else if (fieldname.includes("account")) {
                        url = await googleStorageService.uploadFileToCloudStorage("documents", "accountProof", file);
                    }

                }

                newDocuments.push({
                    name: fieldname,
                    reference: url
                })

            }

        }

        const updatedDocuments = existingDocuments.map(existingDoc => {

            const matchingNewDoc = newDocuments.find(newDoc => newDoc.name === existingDoc.name);

            if (matchingNewDoc) {

                return matchingNewDoc;
                
            }

            return existingDoc;
        });

        newDocuments.forEach(newDoc => {
            const isDocumentAlreadyPresent = updatedDocuments.some(doc => doc.name === newDoc.name);
            if (!isDocumentAlreadyPresent) {
                updatedDocuments.push(newDoc);
            }
        });

        await usersService.updateUser(req.uid, updatedDocuments);

        const result = await usersService.getUserBy({_id: req.user._id})
        
        if(!result) res.sendBadRequest("Something goes wrong when the user's info")

        const tokenizedUser = UsersDto.getTokenDTOFrom(result);

        tokenizedUser.documents = result.documents;

        const token = jwt.sign(tokenizedUser, config.JWT.SECRET, { expiresIn: "1d" });

        res.cookie(config.JWT.COOKIE, token);

        res.sendSuccess("Documents successfully updated");

    } catch (error) {

        await errorsHandler(error, next);

    }


}

export default {
    getAllUsers,
    upgradeRole,
    getMockUsers,
    postDocumentation
}