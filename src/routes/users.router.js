import BaseRouter from "./BaseRouter.js";
import passportCall from "../middlewares/passportCall.js";
import usersController from "../controllers/users.controller.js"

class UserRouter extends BaseRouter {

    init() {

        this.get("/premium/:uid", ["AUTH"], passportCall("jwt", { strategyType: "JWT" }), usersController.upgradeRole);

        this.get("/mockingproducts", ["AUTH"], usersController.getMockUsers);

        this.post("/:uid/documents", ["AUTH"], usersController.postDocumentation);

    }
}


const userRouter = new UserRouter();

export default userRouter.getRouter();