import fs from "fs"

export default class TicketsDao {

    #path = "./src/dao/filesyste/Tickets.json";

    // Class constructor
    constructor() {
    }

    // Method to add products (includes validations)
    async create(product) {

        const propertyList = ["title", "description", "price", "thumbnail", "stock", "code", "category"];

        for (let prop of propertyList) {

            if (!Object.keys(product).includes(prop)) {

                return `The product you are entering cannot be added due to the fact that property ${prop} is not filled in`;

            }

        }

        try {

            if (fs.existsSync(this.#path)) {

                let prodFile = await fs.promises.readFile(this.#path, "utf-8");

                let products = JSON.parse(prodFile);

                const checkingCode = products.find(prod => prod.code === product.code);

                if (!checkingCode) {

                    const lastProduct = products[products.length - 1];

                    product.id = lastProduct ? lastProduct.id + 1 : 1;

                    products.push(product);

                    await fs.promises.writeFile(this.#path, JSON.stringify(products));

                    return "The product has been successfully added";

                } else {

                    return "This product could not be added due to the fact its code is identical to another one";

                }

            } else {

                product.id = 1;

                await fs.promises.writeFile(this.#path, JSON.stringify([product]));

                return "A first product has been successfully added";

            }

        } catch (error) {

            console.log(error);

            return "An error occurred while adding the product";

        }

    }

    // Method to obtain all products (this is a getter to show the private variable this.#products)
    async get() {

        if (fs.existsSync(this.#path)) {

            let prodFile = await fs.promises.readFile(this.#path, "utf-8");

            let products = JSON.parse(prodFile);

            return products;

        } else {

            return "There are no products to show or the path is not correct";

        }

    }

    // Method to obtain a product by id
    async getBy(id) {

        if (fs.existsSync(this.#path)) {

            let prodFile = await fs.promises.readFile(this.#path, "utf-8");

            let products = JSON.parse(prodFile);

            let foundProduct = products.find(prod => prod.id === id);

            if (foundProduct) {

                return foundProduct;

            } else {

                return null;

            }

        }

    }

    // Method to update a product by id
    async update(id, updates) {

        if (/^\d+$/.test(id)) {

            id = parseInt(id);

            if (fs.existsSync(this.#path)) {

                let prodFile = await fs.promises.readFile(this.#path, "utf-8");

                let products = JSON.parse(prodFile);

                const indexToUpdate = products.findIndex(product => product.id === id);

                if (indexToUpdate === -1) {

                    return `There is no product with id ${id}`;

                }

                for (const keyToUpdate in updates) {

                    if (keyToUpdate !== "id" && keyToUpdate !== "code") {

                        products[indexToUpdate][keyToUpdate] = updates[keyToUpdate];

                    } else {

                        return "Neither ids nor codes can be modified";

                    }

                }

                const updatedJSON = JSON.stringify(products);

                await fs.promises.writeFile(this.#path, updatedJSON);

                return `The product with id ${id} has been successfully updated`;

            } else {

                return `The path is incorrect or the file requested does not exist`;

            }
        } else {

            return `The id ${id} introduced is not an integer`;

        }
    }

    // Method to delete a product by id
    async delete(id) {

        if (/^\d+$/.test(id)) {

            id = parseInt(id);

            if (fs.existsSync(this.#path)) {

                let prodFile = await fs.promises.readFile(this.#path, "utf-8");

                let products = JSON.parse(prodFile);

                const productToRemove = products.findIndex(product => product.id === id);

                if (productToRemove !== -1) {

                    products.splice(productToRemove, 1)

                    const updatedJSON = JSON.stringify(products);

                    fs.promises.writeFile(this.#path, updatedJSON);

                    return `The product with id ${id} has been successfully removed`;

                } else {

                    return `There is not product to delete with id ${id}`;

                }

            } else {

                return "The path to the file has been modified or the file has been removed";

            }

        } else {

            return `The ${id} introduced is not an integer`;

        }

    }
}