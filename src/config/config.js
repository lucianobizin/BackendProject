import dotenv from "dotenv";
import { Command } from "commander";

const program = new Command();

program
    .option("--m, --mode <mode>", "Working mode", "prod")
    .option("--p, --port <port>", "Server port", "8080")
    .option("--pers --persistence <persistence>", "Persistence mode", "MONGO")
    .parse();

dotenv.config({
    path: program.opts().mode === "dev" ? "./.env.dev" : "./.env.prod"
});

export default {

    app: {
        PORT: program.opts().port || 8080,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
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