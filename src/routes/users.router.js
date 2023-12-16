import BaseRouter from "./BaseRouter.js";
import passportCall from "../middlewares/passportCall.js";
import usersController from "../controllers/users.controller.js";
import uploader from "../services/uploadRepository.js";

class UserRouter extends BaseRouter {

    init() {

        this.get("/premium/:uid", ["AUTH"], passportCall("jwt", { strategyType: "JWT" }), usersController.upgradeRole);

        this.get("/mockingproducts", ["AUTH"], usersController.getMockUsers);

        this.post("/:uid/documents", ["AUTH", "PREMIUM"], uploader.fields([
            { name: 'profileImage', maxCount: 1, optional: true },
            { name: 'identificationDocument', maxCount: 1, optional: true },
            { name: 'addressProofDocument', maxCount: 1, optional: true },
            { name: 'accountStatementDocument', maxCount: 1, optional: true }
        ]), usersController.postDocumentation);

    }
}


const userRouter = new UserRouter();

export default userRouter.getRouter();