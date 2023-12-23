import os from "os"
import express from "express";
import mongoose from "mongoose";
import compression from "express-compression"
import Handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import cors from "cors";
import cluster from "cluster"
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUIExpress from "swagger-ui-express";
import { inspect } from 'util';

import { Server } from "socket.io";

import initializePassport from './config/passport.config.js';
import { __dirname } from "./utils.js";
import config from "./config/config.js";

import attachLogger from "./middlewares/attachLogger.js";

import productsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js";
import cartsRouter from "./routes/carts.router.js";
import SessionsRouter from "./routes/sessions.router.js";
import messageRouter from "./routes/message.router.js";
import usersRouter from "./routes/users.router.js";

import DMailTemplates from "../src/constants/DMailTemplates.js";
import MailerService from "../src/services/mailerService.js";

import registerChatHandler from "./listeners/chat.listener.js";

if (cluster.isPrimary) {

    console.log(`Principal process: ${process.pid}`);

    const cpus = os.cpus().length;

    for (let i = 0; i < cpus; i++) {

        cluster.fork();

    };

    cluster.on("exit", worker => {

        console.log(`Worker with ${worker.process.pid} died`);

        // Lists Node.js processes ---> tasklist /fi "imagename eq node.exe"
        // Eliminate a Node.js process by pid --> taskkill /pid 5272 -f

        cluster.fork();

    });

} else {

    console.log(`Child process: ${process.pid}`)

    const app = express();

    const PORT = config.app.PORT;
    const server = app.listen(PORT, console.log(`Listening on PORT: ${PORT}`));

    app.use(cors({
        //origin:["localhost:8080"], // request origins
        //credentials:true // Enable the release of cookies 
    }));

    const connection = mongoose.connect(config.mongo.URL);

    const swaggerSpecOptions = {
        definition: {
            openapi:"3.0.1",
            info: {
                title: 'AI courses',
                description: "### IA course 4 all",
            }
        },
        apis: [`${__dirname}/docs/**/*.yml`] // docs contiene carpetas con archivos yml
    };

    const swaggerSpec = swaggerJSDoc(swaggerSpecOptions);
    app.use("/apidocs", swaggerUIExpress.serve, swaggerUIExpress.setup(swaggerSpec)); // This configures view using swaggerSpec

    app.engine("handlebars", Handlebars.engine());
    app.set("views", `${__dirname}/views`);
    app.set("view engine", "handlebars");

    app.use(express.static(`${__dirname}/public`));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.use(compression({
        brotli: {
            enabled: true,
            zlib: {}
        }
    }));

    app.use(attachLogger);

    initializePassport();

    app.use("/", viewsRouter)
    app.use("/api/sessions", SessionsRouter);
    app.use("/api/carts", cartsRouter);
    app.use("/api/products", productsRouter);
    app.use("/api/messages", messageRouter)
    app.use("/api/users", usersRouter)

    app.use((error, req, res, next) => {

        console.log(error)

        error.sendMail = true;

        const mailer = async (error) => {

            const mailService = new MailerService();

            const errorDetails = inspect(error, { showHidden: false, depth: null });

            await mailService.sendMail([config.app.ERROR], DMailTemplates.ERROR, { errorDetails });
        }

        // An action plan after having identified and controlled errors
        if (error.sendMail) {

            mailer(error)

            console.log("Se envió un email con el error")

        }
        res.status(500).send("Something goes wrong");
    })

    const io = new Server(server);

    // Socket listening to the primary connection event 
    io.on("connection", socket => {
        console.log(`Socket connected: ${socket.id}`);
        registerChatHandler(io, socket);
    });

}



