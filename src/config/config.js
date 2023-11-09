import dotenv from "dotenv";
import { Command } from "commander";

const program = new Command();

program
    .option("--m, --mode <mode>", "Working mode", "prod")
    .option("--p, --port <port>", "Server port", "8080")
    .option("--pers --persistence <persistence>", "Persistence mode", "MONGO")
    .parse();

// Va a cargar desde archivo
dotenv.config({
    path: program.opts().mode === "dev" ? "./.env.dev" : "./.env.prod"
});

// Podría hacer que cargue de objetos guardados en el mismo servidor (por ej. en dos objetos en este archivo)

// let environment;

// if (program.opts().mode === "dev") {

//     environment = {

//         MONGO_URL: "COMPLETAR",
//         JWT_COOKIE: "authCookie",
//         JWT_SECRET: "ultrasecretCOD3",
//         ADMIN_EMAIL: "adminCoder@coder.com",
//         ADMIN_PASSWORD: "adminCod3r123",
//         GITHUB_CLIENT_ID: "COMPLETAR",
//         GITHUB_CLIENT_SECRET: "COMPLETAR",
//         GITHUB_CALLBACK_URL: "http://localhost:8080/api/sessions/githubcallback",
//         GOOGLE_CLIENT_ID: "COMPLETAR",
//         GOOGLE_CLIENT_SECRET: "COMPLETAR",
//         GOOGLE_CALLBACK_URL: "http://localhost:8080/api/sessions/googlecallback"

//     }

// } else if (program.opts().mode === "prod") {

//     environment = {

//         MONGO_URL: "COMPLETAR",
//         JWT_COOKIE: "authCookie",
//         JWT_SECRET: "ultrasecretCOD3",
//         ADMIN_EMAIL: "adminCoder@coder.com",
//         ADMIN_PASSWORD: "adminCod3r123",
//         GITHUB_CLIENT_ID: "COMPLETAR",
//         GITHUB_CLIENT_SECRET: "COMPLETAR",
//         GITHUB_CALLBACK_URL: "http://localhost:8080/api/sessions/githubcallback",
//         GOOGLE_CLIENT_ID: "COMPLETAR",
//         GOOGLE_CLIENT_SECRET: "COMPLETAR",
//         GOOGLE_CALLBACK_URL: "http://localhost:8080/api/sessions/googlecallback"

//     }
// }

export default {

    app: {
        ENV: program.opts().mode,
        PORT: program.opts().port || 8080,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        // Si no se cargaría desde archivo sería
        // ADMIN_PASSWORD: environment.ADMIN_PASSWORD
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
        PERSISTENCE: program.opts().persistence
        // || process.env.PERSISTENCE || "MONGO"
    },

    mongo: {
        URL: process.env.MONGO_URL || 'localhost:27017'
    },

    JWT: {
        COOKIE: process.env.JWT_COOKIE,
        SECRET: process.env.JWT_SECRET
    },

    Github: {
        CLIENTID: process.env.GITHUB_CLIENT_ID,
        CLIENTSECRET: process.env.GITHUB_CLIENT_SECRET,
        CALLBACKURL: process.env.GITHUB_CALLBACK_URL
    },

    Google: {
        CLIENTID: process.env.GOOGLE_CLIENT_ID,
        CLIENTSECRET: process.env.GOOGLE_CLIENT_SECRET,
        CALLBACKURL: process.env.GOOGLE_CALLBACK_URL
    }

}