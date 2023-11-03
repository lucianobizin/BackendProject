import passport from "passport";
import local from "passport-local";
import GithubStrategy from "passport-github2";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import config from "../config/config.js";
import { cookieExtractor, createHash, isValidPassword } from "../utils.js";
import { usersService, cartsService } from "../services/index.js";


const LocalStrategy = local.Strategy;

const initializePassport = () => {

    passport.use("register", new LocalStrategy({ passReqToCallback: true, usernameField: "email", session: false }, async (req, email, password, done) => {

        const { firstName, lastName, birthDate, userName } = req.body;

        if (!firstName || !lastName || !birthDate || !userName) return done(null, false, { message: "Incomplete values" });

        if (email === config.ADMIN_EMAIL) return done(null, false, { message: "An error occurred with the server" });

        try {

            const checkingUser = await usersService.getUserBy({

                $or: [
                    { email: email },
                    { userName: userName }
                ]

            })


            if (checkingUser || email === config.ADMIN_EMAIL) return done(null, false, { message: "Email and/or username already used, please, try other options" });

            const hashedPassword = await createHash(password);
            const newUser = {

                firstName,
                lastName,
                email,
                birthDate,
                userName,
                password: hashedPassword

            }

            let cart;

            if (req.cookies["cart"]) {

                cart = req.cookies["cart"];

            } else {

                cartResult = await cartsService.createCart();

                cart = cartResult._id;

            }

            newUser.cart = cart;

            const result = await usersService.createUser(newUser); // Y si falla algo después se creó igual?

            done(null, result);

        } catch (e) {

            done({ error: `Error when checking existing users: ${e}` });

        }

    }));

    passport.use("login", new LocalStrategy({ usernameField: "email", session: false }, async (email, password, done) => {

        try {

            if (!email || !password) return done(null, false, { message: "Incomplete values" });

            if (email === config.app.ADMIN_EMAIL && password === config.app.ADMIN_PASSWORD) {

                const user = {
                    userName: "admin",
                    role: "admin",
                    _id: '0',
                    email: 'adminCoder@coder.com',
                    cart: '000000',
                }

                return done(null, user);
            }

            const user = await usersService.getUserBy({ email });

            if (!user) return done(null, false, { message: "Incorrect credentials or user doesn't exist" });

            const isValidPass = await isValidPassword(user, password);

            if (!isValidPass) return done(null, false, { message: "Incorrect credentials or user doesn't exist" });

            delete user.password;

            return done(null, user);

        } catch (e) {

            return done({ message: `Error when checking users: ${e}` });

        }
    }))

    passport.use("github", new GithubStrategy({

        clientID: config.Github.CLIENTID,

        clientSecret: config.Github.CLIENTSECRET,

        callbackURL: config.Github.CALLBACKURL,

    }, async (accessToken, refreshToken, profile, done) => { // Función de validación

        const { email, name } = profile._json;

        const user = await usersService.getUserBy({ email: email });

        if (!user) {

            const newUser = {

                firstName: name,
                email: email,

            }

            const result = await usersService.createUser(newUser);

            done(null, result);

        } else {

            done(null, user);

        }

    }

    ))

    passport.use("google", new GoogleStrategy({

        clientID: config.Google.CLIENTID,
        clientSecret: config.Google.CLIENTSECRET,
        callbackURL: config.Google.CALLBACKURL,
        passReqToCallback: true // Every time we have passReqToCallback, passport first parameter is req 

    }, async (req, accessToken, refreshToken, profile, done) => {

        const { _json } = profile;

        const user = await usersService.getUserBy({ email: _json.email });

        if (user) {

            return done(null, user);

        } else {

            const newUser = {

                firstName: _json.given_name,
                lastName: _json.family_name,
                email: _json.email,
                userName: _json.email

            };

            let cart;

            if (req.cookies["cart"]) {

                cart = req.cookies["cart"];

            } else {

                cartResult = await cartsService.createCart();

                cart = cartResult._id;

            };

            newUser.cart = cart;

            const result = usersService.createUser(newUser);

            return done(null, result);

        }

    }

    ))

    passport.use("jwt", new Strategy({

        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),

        secretOrKey: config.JWT.SECRET // "ultrasecretCOD3"

    }, async (payload, done) => {

        return done(null, payload);

    }

    ));

    // passport.serializeUser((user, done) => {
    //     return done(null, user._id || user.role);
    //     // if (user.role !== "admin") return done(null, user._id);
    //     // if (user.role === "admin") return done (null, user.role)

    // });

    // passport.deserializeUser(async (value, done) => {

    //     if (value === "admin") {

    //         const admin = {
    //             userName: "admin",
    //             role: "admin"
    //         }

    //         done(null, admin)

    //     } else {
    //         const user = await usersService.getUserBy({ _id: value });
    //         done(null, user)
    //     }

    // })

}


export default initializePassport;