import { Router } from "express";
import passport from "passport";
import usersManager from "../dao/mongo/UsersManager.js";
import jwt from "jsonwebtoken";
import { isValidPassword } from "../utils.js";
import jwtExtractor from "../middlewares/jwtExtractor.js";
import passportCall from "../middlewares/passportCall.js";
import authorization from "../middlewares/authorization.js";

const router = Router();

const usersServices = new usersManager();

router.post("/register", passportCall("register"), (req, res) => {
    res.status(200).send({ status: "Success", payload: `A new user has been created with id ${req.user._id}` })
})

router.get("/failedRegister", async (req, res) => {
    res.status(400).send({ status: "error", error: "Registry failed" })
})

router.post("/login", passportCall("login"), async (req, res) => {

    const queryParams = Object.keys(req.query);

    if (queryParams.length > 0) {
        return res.status(400).sned({ status: "error", error: "This endpoint doesn't allow any params" });
    }

    if (req.user.role !== "admin") {

        const tokenizedUser = {

            _id: req.user._id,
            // firstName: req.user.firstName,
            // lastName: req.user.lastName,
            // email: req.user.email,
            userName: req.user.userName,
            role: req.user.role
        };

        const token = jwt.sign(tokenizedUser, "ultrasecretCOD3", { expiresIn: "1d" });
        res.cookie("authCookie", token, { httpOnly: true }).status(200).send({ status: "Logged in", message: "Welcome" });

    } else if (req.user.role === "admin") {

        const tokenizedAdmin = {
            userName: "admin",
            role: "admin"
        }

        const token = jwt.sign(tokenizedAdmin, "ultrasecretCOD3", { expiresIn: "1d" });
        res.cookie("authCookie", token, { httpOnly: true }).status(200).send({ status: "Logged in", message: "Welcome" });
    }



})

router.post("/loginJWT", async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) return res.status(400).send({ status: "error", message: "Incomplete values" });

    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
        const admin = {
            userName: "admin",
            role: "admin"
        }

        return res.status(401).send({ status: "error", message: "Invalid credentials" })
    }


    const user = await usersServices.getUserBy({ email: email });
    if (!user) return res.status(401).send({ status: "error", message: "Incorrect credentials" });

    const isValidPass = await isValidPassword(user, password);
    if (!isValidPass) return res.status(401).send({ status: "error", message: "Incorrect credentials" });
    delete user.password;

    // Se crea token
    const token = jwt.sign(
        { id: user._id, firstName: user.firstName, email: user.email, role: user.role, userName: user.userName },
        "secretCoderPassword",
        { expiresIn: "1h" }
    );
    res.status(200).send({ status: "success", token })

})

router.get("/profileInfo", jwtExtractor, async (req, res) => {
    res.status(200).send({ status: "success", payload: req.user })
})

router.get("/github", passport.authenticate("github"), async (req, res) => { })
router.get("/githubcallback", passport.authenticate("github"), async (req, res) => {
    req.user = req.user;
    res.redirect("/products")
})

router.get("/failedLogin", async (req, res) => {
    res.status(401).send({ status: "error", error: "Authentication error" })
})

router.get("/logout", async (req, res) => {
    req.session.destroy(error => {
        if (error) {
            console.log(error);
            return res.redirect("/loginJWT");
        } else {
            return res.redirect("/loginJWT");
        };
    });
});

router.get("/current", passportCall("jwt"), authorization("admin"), async (req, res) => {
    const user = req.user;
    res.status(200).send({ status: "success", payload: user });
})

export default router;