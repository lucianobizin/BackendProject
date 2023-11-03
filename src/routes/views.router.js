import BaseRouter from "./BaseRouter.js";
import viewsController from "../controllers/views.controller.js"

class ViewsRouter extends BaseRouter {

    init() {

        // this.param("cid", async (req, res, next, cid) => {
        //     const isValidParam = /^[a-zA-Z]+$/.test(cid);
        //     if (!isValidParam) res.sendIncorrectParameters("Parameter cid is not correct" );
        //     req.cid = cid
        //     next()
        // })

        this.get('/register', ["NO_AUTH"], viewsController.getRegisterPage);
        this.get('/login', ["NO_AUTH"], viewsController.getLoginPage);
        this.get('/profile', ["AUTH"], viewsController.getProfilePage);
        this.get("/products", ["PUBLIC"], viewsController.getRenderedProducts);
        this.get("/product/:pid", ["PUBLIC"], viewsController.getProductInfo)
        this.get("/carts/:cid", ["AUTH"], viewsController.getCartById);

        // this.get("*", ["PUBLIC"], viewsController.getDoesNotExistPage);
    }
}

const viewsRouter = new ViewsRouter();

export default viewsRouter.getRouter();