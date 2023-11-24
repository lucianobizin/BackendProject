import { cartsService } from "../services/index.js";

const cartSetter = async (req, res, next) => {

    if (!req.cookies.cart && !req.user) {

        // This tries to prevent database to become saturated with the creation empty carts that will not be used
        // When people register, the expiryDate property will be removed
        // cart.expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 365 días

        const cart = await cartsService.createCart();

        // console.log("cartSetter", cart)

        res.cookie("cart", cart._id.toString());

    }

    next()

}

export default cartSetter;