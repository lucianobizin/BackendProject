import { cartsService, productsService, ticketsService } from "../services/index.js";
import { errorsHandler } from "./error.controller.js"

const getCarts = async (req, res, next) => { // Se agregó el next

    let { limit } = parseInt(req.query);

    try {

        if (limit) {

            if (limit > 0) {

                const carts = await cartsService.getCarts().limit(limit)

                req.httpLog();

                res.sendSuccessWithPayload(carts);

            } else {

                res.sendIncorrectParameters("Invalid query");

            }
        } else {

            limit = 10

            const carts = await cartsService.getCarts().limit(limit)

            res.sendSuccessWithPayload(carts);

        }

    } catch (error) {

        await errorsHandler(error, next);

        // res.sendInternalError(`Error retrieving carts: ${er}`);

    }

}

const getCart = async (req, res, next) => {

    const cid = req.params.cid;

    if (cid) {

        try {

            const cart = await cartsService.getCartById({ _id: cid })

            req.httpLog();

            res.sendSuccessWithPayload(cart)

        } catch (e) {

            await errorsHandler(error, next);
            // res.sendInternalError(`Error retrieving carts: ${e}`);

        }

    } else {

        res.sendIncorrectParameters("Parameter cid is not correct");

    }
}

const postNewCart = async (req, res, next) => {

    try {

        const result = await cartsService.createCart();

        if (result) {

            req.httpLog();

            return res.sendSuccessWithPayload(result._id);

        } else {

            return res.sendIncorrectParameters("Something goes wrong");
        }

    } catch (error) {

        await errorsHandler(error, next);
        // res.sendInternalError(`Error when creating a cart carts: ${e}`);
    }

}

const postCart = async (req, res, next) => {

    const cid = req.cid
    const pid = req.pid
    const quantity = req.quantity

    if (cid && pid) {

        try {

            if (!quantity) return res.sendIncorrectParameters("Quantity parameter needed");

            const product = await productsService.getProductsById({ _id: pid });

            if (!product) return res.sendIncorrectParameters(`No product with id ${pid}`);

            const cart = await cartsService.getCartById({ _id: cid });

            if (!cart) return res.sendIncorrectParameters(`No cart with id ${cid}`);

            const existingProductIndex = cart.products.findIndex(prod => prod.pid._id.toString() === product._id.toString());

            if (existingProductIndex !== -1) {

                cart.products[existingProductIndex].quantity += quantity;

            } else {

                cart.products.push({ pid: product._id, quantity: quantity });
            }

            await cartsService.updateCart(cid, cart.products);

            req.httpLog();

            res.sendSuccess(`Cart updated with product ${product._id} and quantity ${quantity}`);

        } catch (e) {

            await errorsHandler(error, next);
            // res.sendInternalError(`Error updating cart: ${e}`);

        }
    } else {

        return res.sendIncorrectParameters("Parameter/s cid and/or pid is/are not correct");

    }
}

const putCart = async (req, res, next) => {

    const cid = req.params.cid;

    const products = req.body;


    try {

        let cart = await cartsService.getCartById({ _id: cid });

        if (!cart) return res.sendIncorrectParameters(`Cart with id ${cid} does not exist`);

        await cartsService.updateCart(cid, products);

        req.httpLog();

        return res.sendSuccess(`Cart with ID ${cid} has been updated with new products`);

    } catch {
        
        await errorsHandler(error, next);
        // return res.sendInternalError(`Something went wrong: ${error}`);

    }
}

const putCartNotLoggedIn = async (req, res) => {

    const cid = req.cid
    const pid = req.pid
    const quantity = req.quantity

    if (cid && pid && quantity) {

        try {

            let cart = await cartsService.getCartById({ _id: cid });

            if (!cart) return res.sendIncorrectParameters(`Cart with id ${cid} does not exist`);

            const productToUpdate = cart.products.find(prod => prod.pid._id.toString() === pid.toString())

            if (!productToUpdate) return res.sendIncorrectParameters(`Product with ID ${pid} does not exist in cart with ID ${cid}`)

            productToUpdate.quantity = quantity

            await cartsService.updateCart(req.user.library, { cart: cart.products });

            req.httpLog();

            return res.sendSuccess(`Product with ID ${pid} in cart ${cid} has been updated with quantity ${quantity}`);

        }

        catch (error) {
            
            await errorsHandler(error, next);

            //return res.sendInternalError(`Something went wrong: ${error}`);

        }

    } else {

        return res.sendIncorrectParameters(`Parameter/s ${cid} and/or ${pid} and or object sent by body is/are not correct`);

    }
}

const putUpdateProducts = async (req, res, next) => {

    const pid = req.params.pid;

    const { quantity } = req.body;

    if (cid && pid && quantity) {

        try {

            let cart = await cartsService.getCartById({ _id: req.user.cart });

            if (!cart) return res.sendIncorrectParameters(`Cart with id ${cid} does not exist`);

            const productToUpdate = cart.products.find(prod => prod.pid._id.toString() === pid.toString());

            if (!productToUpdate) return res.sendIncorrectParameters(`Product with ID ${pid} does not exist in cart with ID ${cid}`);

            productToUpdate.quantity = quantity;

            await cartsService.updateCart(cid, cart.products);

            req.httpLog();

            return res.sendSuccess(`Product with ID ${pid} in cart ${cid} has been updated with quantity ${quantity}`);

        }

        catch (error) {

            await errorsHandler(error, next);
            
            // return res.sendInternalError(`Something went wrong: ${error}`);

        }

    } else {

        return res.sendIncorrectParameters(`Parameter/s ${cid} and/or ${pid} and or object sent by body is/are not correct`);

    }

}

const deleteProductsFromCart = async (req, res, next) => {

    const cid = req.params.cid;

    const pid = req.params.pid;

    if (cid && pid) {

        try {

            let cart = await cartsService.getCartById({ _id: cid });

            if (!cart) return res.sendIncorrectParameters(`Cart with id ${cid} does not exist`);

            const productIndex = cart.products.findIndex(product => product.pid._id.toString() === pid.toString());

            if (productIndex === -1) return res.sendIncorrectParameters(`Product with ID ${pid} does not exist in the cart`);

            cart.products.splice(productIndex, 1);

            await cartsService.updateCart(cid, cart.products)

            req.httpLog();

            return res.sendSuccess(`Product with ID ${pid} has been removed from the cart with ID ${cid}`);
        }

        catch (error) {

            await errorsHandler(error, next);

            // return res.sendInternalError(`Something went wrong: ${error}`);

        }
    } else {

        return res.sendIncorrectParameters(`Parameter/s ${cid} and/or ${pid} is/are not correct`);

    }

}

const deleteCart = async (req, res, next) => {

    const cid = req.params.cid;

    if (cid) {

        try {

            const cart = await cartsService.getCartById({ _id: cid });

            if (!cart) return res.sendIncorrectParameters(`Cart with id ${cid} does not exist`);

            cart.products = [];

            await cartsService.updateCart(cid, cart.products);

            req.httpLog();

            res.sendSuccess(`All products of Cart with id ${cid} were deleted`);

        } catch (error) {

            await errorsHandler(error, next);

            // return res.sendInternalError(`Something went wrong: ${error}`);

        }

    } else {

        return res.sendIncorrectParameters(`Parameter/s ${cid} and/or ${pid} is are not correct`);

    }

}

const endPurchase = async (req, res, next) => {

    // Identificar el carrito del usuario para traer su carrito completo

    try {
        const userCart = req.user.cart;

        if (!userCart) {
            return res.sendIncorrectParameters("There is no cart associated with this user");
        }

        const cart = await cartsService.getCartById({ _id: userCart });

        if (!cart) {
            return res.sendIncorrectParameters("Cart does not exist");
        }

        // Obtener los IDs y cantidades de productos del carrito del usuario
        let productsToCheck = cart.products.map(product => ({
            pid: product.pid._id,
            quantity: product.quantity,
        }));

        // Obtener la información de los productos en una sola consulta a la base de datos
        let productsInCart = await productsService.getProductsByIds(
            productsToCheck.map(product => product.pid)
        );

        // Construir la lista de productos (no) disponibles y el nuevo stock de cada producto
        const availableCartProducts = [];
        const unavailableCartProducts = [];
        const newProductsStock = [];

        for (let i = 0; i < productsToCheck.length; i++) {
            let productToCheck = productsToCheck[i];
            let productInfo = productsInCart.find(product => product._id.toString() === productToCheck.pid.toString());

            if (productInfo && productInfo.stock >= productToCheck.quantity) {
                availableCartProducts.push({
                    pid: productToCheck.pid,
                    price: productInfo.price,
                    quantity: productToCheck.quantity,
                });

                const newProductStock = productInfo.stock - productToCheck.quantity;
                newProductsStock.push({
                    pid: productToCheck.pid,
                    quantity: newProductStock,
                });
            } else {
                unavailableCartProducts.push({
                    pid: productToCheck.pid,
                    quantity: productToCheck.quantity,
                });
            }
        }

        // Generar un ticket, con los datos requeridos => _id: autogenerado por Mongo y único, code: autogenerado por programador y único, fecha y hora de compra, total de la compra y purchaser (email)
        let purchase_datetime;

        let tempCode;

        let checkingTempCode = false

        while (!checkingTempCode) {

            // -- Generando la fecha que a su vez nos servirá como código en milisegundos
            purchase_datetime = Date.now();

            // -- Generando un código temporal a la espera de su confirmación de existencia en otro código
            tempCode = `${purchase_datetime}`;

            checkingTempCode = await ticketsService.getTicketByCode(tempCode) ? false : true;

        }

        // Generando la suma de amount

        let totalPurchase = availableCartProducts.reduce((accumulator, product) => {
            let tempProdSum = product.quantity * product.price;
            return accumulator + tempProdSum;
        }, 0);

        if (totalPurchase === 0) res.sendIncorrectParameters("Empty cart")

        // Extrayendo el email del usuario
        const userEmail = req.user.email;

        if (!tempCode || !purchase_datetime || !totalPurchase || !userEmail) res.sendIncorrectParameters("Ticket was not created, an error occurred during process")

        const ticket = {

            code: tempCode,
            purchase_datetime: new Date(purchase_datetime),
            amount: totalPurchase,
            purchaser: userEmail

        };

        req.infoLog("ticket ---> ", ticket)

        // Resolución de la compra

        // -- Si la compra se resolvió, gaurdar el ticket en base de datos, actualizar el stock de los productos vendidos, 

        const createdTicket = await ticketsService.createTicket(ticket);

        if (!createdTicket) res.sendIncorrectParameters("Ticket was not created, something went wrong, try to repeat the process");

        for (let newProdStock of newProductsStock) {

            const updateStockResult = await productsService.updateProduct(newProdStock.pid, { stock: newProdStock.quantity });
            if (!updateStockResult) res.sendIncorrectParameters("There was an error when trying to update the stock of the products")
        };

        // Hay que eliminar del carro los productos del ticket, cargar los que no pudieron comprarse y actualizar el carro en base de datos

        req.user.cart = [];

        req.user.cart = unavailableCartProducts;

        const result = await cartsService.updateCart(userCart, req.user.cart);

        if (!result) res.sendIncorrectParameters("User's cart was not updated, something went wrong");

        // Devolver el ticket
        
        req.httpLog();

        res.sendSuccessWithPayload(createdTicket);

    } catch (error) {

        await errorsHandler(error, next);

    }

}

export default {
    getCarts,
    getCart,
    postNewCart,
    postCart,
    putCart,
    putCartNotLoggedIn,
    putUpdateProducts,
    deleteProductsFromCart,
    deleteCart,
    endPurchase
}