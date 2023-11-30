import productsController from "../controllers/products.controller.js"
import uploader from "../services/uploadRepository.js"
import BaseRouter from "./BaseRouter.js";

class ProductsRouter extends BaseRouter{

    init(){

        this.get("/", ["PUBLIC"], productsController.getProducts);

        this.get("/mockingproducts", ["AUTH"], productsController.getMockUsers);

        this.post("/", ["PREMIUM", "ADMIN"], uploader.array("images"), productsController.postProducts);

        this.put("/:pid", ["PREMIUM", "ADMIN"], productsController.putProducts);

        this.delete("/:pid", ["PREMIUM", "ADMIN"], productsController.deleteProducts);
        
    }
}

const productsRouter = new ProductsRouter();

export default productsRouter.getRouter();