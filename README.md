## TERCERA ENTREGA

### REVISIÓN DE ENDPOINTS

#### VIEWS.ROUTER.JS (23-10-2023)
---> "/register": OK (visualization / functionality)
---> "/login": OK (visualization / functionality -local, Google, Github)
---> "/profile": OK (visualization / functionality -erase authCookie-)




### Necesito crear el ticket de compra => 
---> Creo el ticket en FS y Mongo
---> Creo su repositorio y su respectivo servicio (export)
---> Creo el controlador con su respectivo router (en caso de ser necesario, que en el ejemplo, sí lo es)

### SEGUNDA ENTREGA => MODIFIQUÉ POST ENTREGA EL MÉTODO POST A PARTIR DEL EJEMPLO DEL PROFESOR EN LA ÚLTIMA CLASE DEL SÁBADO

### POSTMAN
You will find a JSON file ("CoderBackend.postman_collection") in which you have all collections and requests needed to test the backend app

### Starting server
npm run dev

### 1. Installing dependencies
---> npm install express express-handlebars nodemon router socket.io multer mongoose

### 2. Modifying package.json
---> "type": "module"
---> "scripts"... "dev": "nodemon src/app.js",

### 3. Creating server in app.js

import express from "express";

const app = express();
const PORT = process.env.PORT||8080;
const server = app.listen(PORT, console.log(`Listening on PORT: ${PORT}`))

### 4. Create routes and dao ("filesystem" & "mongo") folders in src
---> Each persistence will be separated in its own context
---> dao => Data Access Object (deisgn patterns)

### 5. Create models in "mongo"
---> Model contains the primary model that will connect to database
---> There will managers inside this folder that will utilise model
---> products.js [three main elements: collection, schema & model]

import mongoose, { mongo } from "mongoose";

// 1. Creating collection
const collection = "Products";

// 2. Creating schema
const schema = new mongoose.Schema({

    title:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    price:{
        type:Number,
        required:true
    },

    thumbnail:{
        type:Array,
        default:[]
    },

    stock:{
        type:Number,
        required:true
    },

    code:{
        type:String,
        required:true
    },

    category:{
        type:String,
        required:true
    },

    status:{
        type:Boolean,
        default:true
    }
}, {timestamps:true});

// 3. Creating model
const productsModel = mongoose.model(collection, schema);

export default productsModel;

### 6. Creating ProductsManager in folder "mongo"
---> Utilising a Manager connected to a related model is a good practice
---> In this case, as we have productsModel in products.js, we need a Manager to manage productsModel from inside

import productsModel from "./models/products";

export default class ProductsManager{

    getproducts = () => {
        return productsModel.find();
    };

    getProductById = (params) => {
        return productsModel.findOne(params);
    };

    createProduct = (product) => {
        return productsModel.create(product);
    };

    updateProduct = (pid, product) => {
        return productsModel.updateOne({_id:pid}, {$set:{product}});
    };

    deleteProduct = (pid) => {
        return productsModel.delete({_id:pid})
    }

};

### 7. Connecting app to database (app.js)
const connection = mongoose.connect("mongodb+srv://lucianobizin:password@cluster0.g1qxexh.mongodb.net/CoderBackend?retryWrites=true&w=majority");
---> Replace password
---> Replace CollectionName

### 8. Adding middlewares in app.js
app.use(express.json());
---> Read json files
app.use(express.urlencoded({extended:true}));
---> Receive files from forms

### 9. Create routers
---> If there is an async chain of events locate the async/await at the beginning of the flow (good practice)
---> In this case: endpoint calls ProductsManager, ProductsManager calls productsModels, productsModels calls find()
---> Data return from productsModels.find(), goes to ProductsManager, and from this to the router
---> create folder routes and within it products.router.js

import {Router} from "express";
import ProductsManager from "../dao/mongo/ProductsManager.js";

const router = Router();
const productService = new ProductsManager()

router.get("/", async (req, res) => {
    const products = await productService.getproducts()
    res.send({status:"Success", payload: products})
})

export default router;

### 10. Connecting router with app.js (app.js)
import productsRouter from "./routes/products.router.js";
app.use("/api/products", productsRouter);
---> Routers should be created in the bottom part of app.js

### 11. Check connections with PostMan
---> http//localhost:8080/api/users

### 12. Create utils.js for getting an absolute path
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export { __dirname };

### 13. Create public folder & and img folder in public
---> Utilised to storage imgs that we are going to storage using multer

### 14. Create services folder in src & uploadServices.js
---> Utilised to upload files to our database through our server
---> 2 principals elements: storage (to store our data) & filename

import multer from "multer";
import __dirname from "../utils.js";

const storage = multer.diskStorage({
    destination:function(req, file, callback){
        return callback(null, `${__dirname}/public/img`)
    },
        filename:function(req, file, callback){
        return callback(null, `${Date.now()}-${file.originalname}`)
    }
})

---> Now, it's necessary to create the uploader that will store the data in destination with the filename selected
const uploader = multer({ storage });
export default uploades;

### 15. Create router.post considering the uploader recently created
---> uploader works as a middleware
---> "images" is the same name that should be used in PostMan when posting files (we don't use thumbnail but images instead)

import uploader from "../services/uploadServices.js"
router.post("/", uploader.array("images"), async (req, res) => {

    console.log(req.files) // let know files metadata and destination path
    console.log(req.body) // Show the object body sent through postman

    // Receiving body sent through postman

        const {
        title,
        description,
        price,
        stock,
        code,
        category,
        status,
    } = req.body 

    // Validation
    if (!title || !description || !price || !stock || !code || !category) return res.send(400).send({status: "error", error:"Incomplete values"});

    // Creating a new product with the information received
    const newProduct = {
        title,
        description,
        price,
        stock,
        code,
        category,
        status,
    }

    // Mapping all images that lives in req.files (once got from postman) converting them in a URL of access
    const images = req.files.map(file => `${req.protocol}://${req.hostname}:${process.env.PORT||8080}/img/${file.filename}`);
    
    // Adding property thumbnail to newProduct
    newProduct.thumbnail = images

    // Create newProduct in the DB
    const result = await productService.createProduct(newProduct) 

    // Sending a message to the client
    res.send({status:"success", payload:result._id});
});

---> Images will live in req.files (or req.file depending on the number of files received)
---> Remaining data will live in req.body
---> Object body validation

### 16. Adding static (middleware)
app.use(express.static(`${__dirname}/public`))

### 17. Adding express-handlebars (app.js)
import Handlebars from "express-handlebars"
app.engine("handlebars", Handlebars.engine())
---> File extension that we want the view template/engine to process and connect it to handlebars-engine (engranaje)

app.set("views", `${__dirname}/views`)
---> Where is your views folder? (create ir in src)

app.set("view engine", "handlebars")
---> The engine to use should be the one connected to handlebars

### 18. Working with templates
---> Create folder "views" and within it folder "layouts" (within it file main.handlebars)
---> Add the following code in main.handlebars

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
</head>
<body>
    
    {{{body}}}

</body>
</html>

---> Create Home.handlebars in views
<h1>Hola</h1>

### 19. Creating a new router to gets views

import { Router } from "express";
import ProductsManager from "../dao/mongo/ProductsManager.js";

const router = Router();

const productService = new ProductsManager()

router.get("/", async (req, res) => {
    const products = await productService.getproducts()
    res.render("Home", {
        products
    })
})

export default router

---> When rendering "Home" send it all my products
---> await productService is not returning products as object but as a mongoose instance with virtual variables and other elements related to db (document is hydrated / embedded). Handlebars needs a javascript object. We require to add method lean() to getProducts ProductsManager's method. Lean() method returns a javascript object without any virtualizations, mongoose variables, etc. 

    getproducts = () => {
        return productsModel.find().lean();
    };

    getProductById = (params) => {
        return productsModel.findOne(params).lean();
    };


### 20. Connecting app to the new router

import viewsRouter from "./routes/views.router.js";
app.use("/", viewsRouter)

---> Add the handlebars router at the beginning on the top of any other routers

### 21. Creating template in Home.handlebars for receiving products

<div>
    <h1>All products</h1>
    <div>
        {{#each products}}
            <h1>{{title}}</h1> 
            <img src={{this.thumbnail.[0]}}>
            <p> Description: {{description}}</p>
            <p> Price: {{price}}</p>
            <p> Stock: {{stock}}</p>
            <p> Code: {{code}}</p>
            <p> Category: {{category}}</p>
            <p> Status: {{status}}</p>
            <p> ID: {{id}}</p>
        {{/each}}
    </div>
</div>

### 22. Developing router.put & router.delete
---> We create the router
---> We get the :pid (product id passed by the client)
---> We get all the product properties the client want to update (from the request body)
---> We create an updateProduct with the information provided with the client (we are updating the product in db with this updateProduct)
---> We check the existence of a product with id = pid
---> We update the product with the productService (an instance of ProductManager)

router.put("/:pid", async (res, req) => {

    const {pid} = req.params;
    const {
        title,
        description,
        price,
        stock,
        code,
        category,
        status
    } = req.body;

    const updatedProduct = {
        title,
        description,
        price,
        stock,
        code,
        category,
        status
    };

    const product = await productService.getProductById({_id: pid});

    if(!product) return res.status(400).send({status:"error", error:`Product with id ${pid} does not exist`});

    await productService.updateProduct(pid, updatedProduct);

    res.status(200).send({status: "Success", message:`Product with id ${pid} was updated`});

})

---> We create the router
---> We get the :pid (product id passed by the client)
---> We check the existence of a product with id = pid
---> We delete the product with the productService (an instance of ProductManager)

router.delete("/:pid", async (res, req) => {

    const {pid} = req.params;

    const product = await productService.getProductById({_id: pid});
    if(!product) return res.status(400).send({status:"error", error:`Product with id ${pid} does not exist`});

    await productService.deleteProduct(pid)
    res.status(200).send({status: "Success", message: `Product with id ${pid} was deleted`});

})

### 23. Creating cart model

import mongoose, { mongo } from "mongoose";

// 1. Creating collection
const collection = "cart";

// 2. Creating schema
const schema = new mongoose.Schema({

    products:{

        type:[

            {

                pid:{
                    type:Number,
                    require:true
                },

                quantity:{
                    type:Number,
                    require:true
                }
            }
            
        ]
    }
}, {timestamps:true});

// 3. Creating model
const cartModel = mongoose.model(collection, schema);

export default cartModel;

### 24. Creating CartManager

import cartModel from "./models/cart.js";

export default class CartManager {

    getCarts = () => {
        return cartModel.find().lean();
    }

    getCartById = (params) => {
        return cartModel.findOne(params).lean();
    }

    createCart = (cart) => {
        return cartModel.create(cart);
    }

    updateCart = (cid, cart) => {
        return cartModel.updateOne({ _id: cid }, { $set: { cart } });
    }

}

### 25. Creating cart.router.js in src/routes

import { Router } from "express";
import ProductsManager from "../dao/mongo/ProductsManager.js";
import uploader from "../services/uploadServices.js"

const router = Router();

const productService = new ProductsManager();

router.get("/", async (req, res) => {

    const products = await productService.getproducts();
    res.send({ status: "Success", payload: products });

});

router.post("/", uploader.array("images"), async (req, res) => {

    console.log(req.files);
    console.log(req.body);

    const {
        title,
        description,
        price,
        stock,
        code,
        category,
        status,
    } = req.body

    if (!title || !description || !price || !stock || !code || !category) return res.send(400).send({status: "error", error:"Incomplete values"});

    // Creating a new product with the information received
    const newProduct = {
        title,
        description,
        price,
        stock,
        code,
        category,
        status,
    }

    // Mapping all images and saving from this part and adding it to newProduct with the property thumbnail
    const images = req.files.map(file => `${req.protocol}://${req.hostname}:${process.env.PORT||8080}/img/${file.filename}`);
    newProduct.thumbnail = images
    const result = await productService.createProduct(newProduct)
    res.send({status:"success", payload:result._id});
});

router.put("/:pid", async (res, req) => {

    const {pid} = req.params;
    const {
        title,
        description,
        price,
        stock,
        code,
        category,
        status
    } = req.body;

    const updatedProduct = {
        title,
        description,
        price,
        stock,
        code,
        category,
        status
    };

    const product = await productService.getProductById({_id: pid});

    if(!product) return res.status(400).send({status:"error", error:`Product with id ${pid} does not exist`});

    await productService.updateProduct(pid, updatedProduct);

    res.status(200).send({status: "Success", message:`Product with id ${pid} was updated`})

})

router.delete("/:pid", async (res, req) => {

    const {pid} = req.params;

    const product = await productService.getProductById({_id: pid});
    if(!product) return res.status(400).send({status:"error", error:`Product with id ${pid} does not exist`});

    await productService.deleteProduct(pid)
    res.status(200).send({status: "Success", message: `Product with id ${pid} was deleted`});

})

export default router;

### 26. Adding pagination (products.js & cart.js)
import mongoosePaginate from "mongoose-paginate-v2";
---> Before model: schema.plugin(mongoosePaginate);

### 27. Modifying product.router.js 

router.get("/", async (req, res) => {

    let { limit = 10, page = 1, sort, query } = req.query;

    limit = isNaN(parseInt(limit)) || limit < 1 ? 10 : limit;
    page = isNaN(parseInt(limit)) || page < 1 ? 1 : page;

    const validSortValues = [1, -1];
    sort = validSortValues.includes(parseInt(sort)) ? parseInt(sort) : 1;

    let filter = query ? JSON.parse(query) : {};

    try{

        const products = await productService.getproducts(limit, page, sort, filter)
        res.status(200).send({ status: "success", payload: products})

    } catch (e){
        res.status(500).send({ status: "Error", message: `Something goes wrong: ${e}` });
    }

});

### 28. Modifying views.router.js

router.get("/", async (req, res) => {

    let { page, sort, category, availability } = req.query;

    let limit = 10
    page = isNaN(parseInt(page)) || page < 1 ? 1 : page; 

    const validSortValues = [1, -1];
    sort = validSortValues.includes(parseInt(sort)) ? parseInt(sort) : 1; 

    let filter = {}

    if(category && availability){
        filter = {"category":category, "status":availability}
    } else if(category && !availability){
        filter = {"category":category}
    } else if(!category && availability){
        filter = {"status":availability}
    }

    const paginationProducts = await productService.getproducts(limit, page, sort, filter);

    const status = paginationProducts.status;
    const products = paginationProducts.docs;
    const currentPage = paginationProducts.page
    const {totalPages, prevPage, nextPage, hasPrevPage, hasNextPage} = paginationProducts;

    const prevLink = hasPrevPage ? `${req.protocol}://${req.hostname}:${process.env.PORT || 8080}/?page=${prevPage}` : null;
    const nextLink = hasNextPage ? `${req.protocol}://${req.hostname}:${process.env.PORT || 8080}/?page=${nextPage}` : null;

    res.render("Home", {
        products,
        currentPage, 
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        totalPages,
        prevLink,
        nextLink
    })
})

export default router;

### 29. Modifying cart.router.js

---> Actualiza el carrito con un arreglo de productos
router.put("/:cid", async (req, res) => {

    const cid = req.params.cid;
    const products = req.body;


    try {
        let cart = await cartService.getCartById({ _id: cid });
        if (!cart) return res.status(400).send({ status: "error", error: `Cart with id ${cid} does not exist` });
        await cartService.updateCart(cid, products);
        return res.status(200).send({ status: "success", message: `Cart with ID ${cid} has been updated with new products` });
    } catch {
        return res.status(500).send({ status: "error", error: `Something went wrong: ${error}` });
    }

})

---> Actualiza la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
router.put("/:cid/products/:pid", async (req, res) => {

    const cid = req.params.cid;
    const pid = req.params.pid;

    const {quantity} = req.body;

    if (cid && pid && quantity){
        try {
            let cart = await cartService.getCartById({ _id: cid });
            if (!cart) return res.status(400).send({ status: "error", error: `Cart with id ${cid} does not exist` });
            const productToUpdate = cart.products.find(prod => prod.pid === pid)
            if(!productToUpdate) return res.status(400).send({status: "error", error:`Product with ID ${pid} does not exist in cart with ID ${cid}`})
            productToUpdate.quantity = quantity
            await cartService.updateCart(cid, cart.products);
            return res.status(200).send({ status: "success", message: `Product with ID ${pid} in cart ${cid} has been updated with quantity ${quantity}` });
        }
        catch (error){
            return res.status(500).send({ status: "error", error: `Something went wrong: ${error}` });
        }
    } else {
        return res.status(400).send({ status: "error", message: "Parameter/s cid and/or pid and or object sent by body is/are not correct" });
    }
})

---> Elimina del carrito el producto seleccionado
router.delete("/:cid/products/:pid", async (req, res) => {

    const cid = req.params.cid;
    const pid = req.params.pid;

    if (cid && pid) {

        try {
            let cart = await cartService.getCartById({ _id: cid });
            if (!cart) return res.status(400).send({ status: "error", error: `Cart with id ${cid} does not exist` });
            const productIndex = cart.products.findIndex(product => product.pid === pid);
            if (productIndex === -1) return res.status(400).send({ status: "error", error: `Product with ID ${pid} does not exist in the cart` });
            cart.products.splice(productIndex, 1);
            await cartService.updateCart(cid, cart.products)
            return res.status(200).send({ status: "success", message: `Product with ID ${pid} has been removed from the cart with ID ${cid}` });
        }
        catch {
            return res.status(500).send({ status: "error", error: `Something went wrong: ${error}` })
        }
    } else {
        return res.status(400).send({ status: "error", message: "Parameter/s cid and/or pid is/are not correct" });
    }

})

---> Elimina todos los productos del carrito 
router.delete("/:cid", async (req, res) => {

    const cid = req.params.cid;
    if (cid){
        try{
            const cart = await cartService.getCartById({ _id: cid });
            if (!cart) return res.status(400).send({ status: "error", error: `Cart with id ${cid} does not exist` });
            cart.products = []
            await cartService.updateCart(cid, cart.products)
            res.status(200).send({ status: "Success", message: `All products of Cart with id ${cid} were deleted` });
            } catch (error){
                return res.status(500).send({ status: "error", error: `Something went wrong: ${error}` })
            }
    } else {
        return res.status(400).send({status:"error", error:"Parameter/s cid and/or pid is are not correct"});
    }
})

### 30. Adding population to Cart.js
---> Add population to the property to populate

...pid:{
    type:mongoose.Schema.Types.ObjectId,
    ref: "products",
    require: true
},...

---> Defining preschemas by default to use in determined with specific methods
schema.pre("findOne", function(){
    this.populate("products.pid")
})

### 31. Adding HTML (Home.handlebars) and index.js

<div>
    <h1>All products</h1>
    <div>
        {{#each products}}
        <h1>{{title}}</h1>
        <img src={{this.thumbnail.[0]}}>
        <p> Description: {{description}}</p>
        <p> Price: {{price}}</p>
        <p> Stock: {{stock}}</p>
        <p> Code: {{code}}</p>
        <p> Category: {{category}}</p>
        <p> Status: {{status}}</p>
        <p> ID: {{_id}}</p>

        <form id="buyForm">
            <input type="hidden" id="pid" name="pid" value="{{_id}}"></input>
            
            <label for="cid">Cart</label>
            <input type="text" id="cid" name="cid" required></input>
            
            <label for="quantity">Quantity</label>
            <input type="number" id="quantity" name="quantity" min="1" required></input>
            
            <input type="submit"> Add to cart </input>
        </form>

        {{/each}}

        {{#if hasPrevPage}}
        <a href="{{prevLink}}"><button>Last page</button></a>
        {{/if}}

        {{#if hasNextPage}}
        <a href="{{nextLink}}"><button>Next page</button></a>
        {{/if}}

        <p>Page {{currentPage}} of {{totalPages}}</p>

    </div>

</div>

<script src="./js/index.js"></script>

const form = document.getElementById("buyForm")
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => {
        obj[key] = value;
        console.log(key, obj[key], value)
    });
    const response = await fetch(`/api/carts/${obj['cid']}/product/${obj['pid']}?quantity=${obj['quantity']}}`, {
        method:'POST',
        body: JSON.stringify(obj),
        headers:{
            "Content-Type":'application/json'
        }
    })
    const result = await response.json();
    console.log(result);
})

RESABIO

// router.param("cid", async(req, res, next, cid) => {
//     const isValidParam = /^[a-zA-Z]+$/.test(cid);
//     if(!isValidParam) return res.status(400).send({ status: "error", message: "Parameter cid is not correct" });
//     req.cid = cid
//     next()
// })

// router.param("pid", async(req, res, next, pid) => {
//     const isValidParam = /^[a-zA-Z]+$/.test(pid);
//     if(!isValidParam) return res.status(400).send({ status: "error", message: "Parameter pid is not correct" });
//     req.pid = pid
//     next()
// })



