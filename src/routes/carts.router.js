import BaseRouter from "./BaseRouter.js";
import cartsController from "../controllers/carts.controller.js"

class CartsRouter extends BaseRouter {

    init(){

        this.get("/", ["ADMIN"], cartsController.getCarts);

        this.get("/:cid", ["AUTH"], cartsController.getCart);

        // this.post("/", ["ADMIN"], cartsController.postNewCart);

        this.post("/:cid/product/:pid", ["PUBLIC"], cartsController.postCart);

        this.post("/:cid/purchase", ["AUTH"], cartsController.endPurchase); // 
        
        this.put("/:cid", ["AUTH"], cartsController.putCart);

        this.put("/:cid/products/:pid", ["PUBLIC"], cartsController.putCartNotLoggedIn);

        this.put("/products/:pid", ["AUTH"], cartsController.putUpdateProducts);

        this.delete("/:cid/products/:pid", ["PUBLIC"], cartsController.deleteProductsFromCart);

        this.delete("/:cid", ["ADMIN"], cartsController.deleteCart);

    }
    
}

const cartsRouter = new CartsRouter() ;

export default cartsRouter.getRouter();