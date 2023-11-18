import os from "os"
import express from "express";
import mongoose from "mongoose";
import compression from "express-compression"
import Handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import cors from "cors";
import cluster from "cluster"

import { Server } from "socket.io";

import initializePassport from './config/passport.config.js';
import { __dirname } from "./utils.js";
import config from "./config/config.js";

import attachLogger from "./middlewares/attachLogger.js";

import productsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js";
import cartsRouter from "./routes/carts.router.js";
import SessionsRouter from "./routes/sessions.router.v2.js";
import messageRouter from "./routes/message.router.js";
import usersRouter from "./routes/users.router.js";

import registerChatHandler from "./listeners/chat.listener.js";

if (cluster.isPrimary) {

    console.log(`Soy el proceso principal y cuento con un pid ${process.pid}`);

    const cpus = os.cpus().length;

    for (let i = 0; i < cpus; i++) {

        cluster.fork();

    };

    cluster.on("exit", worker => {

        console.log(`Worker with ${worker.process.pid} died`);

        cluster.fork();

    });

} else {

    console.log(`Yo soy el proceso hijo con ${process.pid}`)

    const app = express();

    const PORT = config.app.PORT;
    const server = app.listen(PORT, console.log(`Listening on PORT: ${PORT}`));

    app.use(cors({
        //origin:["localhost:8080"], // Origen de las peticioness
        //credentials:true // Habilita o no dar cookies 
    }));

    const connection = mongoose.connect(config.mongo.URL);

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

        // console.log("ERROR IN APP ---> \n", error);

        console.log(error)

        // Plan de acción luego de haber identificado y controlado el error
        if (error.sendMail) {

            console.log("Se envió un email con el error")
        }
        res.status(500).send("Something goes wrong");
    })

    const io = new Server(server);

    // Socket escuchando el evento primario de conexión 
    io.on("connection", socket => {
        console.log(`Socket connected: ${socket.id}`);
        registerChatHandler(io, socket);
    });

}



