import { usersService } from "../services/index.js";
import { errorsHandler } from "./error.controller.js";

const upgradeRole = async (req, res, next) => {

    req.httpLog();

    try {

        if (req.user.role === "premium") return res.sendForbidden("Unauthorised user");

        req.user.role = req.user.role !== "admin" ? "premium" : req.user.role;

        // if(req.user.role === "user") res.sendInternalError("Something goes wrong with the server, please, retry in a few minutes");
    
        await usersService.roleUpdate(req.uid, req.user.role);

        res.locals.upgradeSuccess = true;

        res.clearCookie("authCookie");

        res.sendSuccess(`User with uid ${req.uid} has been successfully upgraded to user premium. You must logout and log in againt to get your role effectively upgraded`)

    } catch (error) {

        await errorsHandler(error, next);

    }

};

export default {
    upgradeRole,
}