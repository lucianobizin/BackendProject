export default {

    app: {
        PORT: parseInt(process.env.PORT) || 8080,
        ENV: process.env.ENV,
        PERSISTENCE: process.env.PERSISTENCE,
        ADMIN_EMAIL: process.env.CORREO_ADMIN,
        ADMIN_PASSWORD: process.env.PASSWORD_ADMIN,
        ERROR: process.env.ERROR_EMAIL
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
    },

    nodemailer: {
        USER: process.env.NODE_MAILER_USER,
        PWD: process.env.NODE_MAILER_PASSWORD
    }

}