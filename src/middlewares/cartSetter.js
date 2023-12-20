import { cartsService } from "../services/index.js";

const cartSetter = async (req, res, next) => {

    if (!req.cookies.cart && !req.user) {

        // This tries to prevent database to become saturated with the creation of empty carts that will not be used for a while
        // When people register, the expiryDate property will be removed from their cart
        // cart.expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 365 días

        const cart = await cartsService.createCart();

        res.cookie("cart", cart._id.toString());

    }

    next()

}

export default cartSetter;