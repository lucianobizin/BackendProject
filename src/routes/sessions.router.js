import BaseRouter from "./BaseRouter.js";
import passportCall from "../middlewares/passportCall.js";
import sessionsController from "../controllers/sessions.controller.js"

class SessionRouter extends BaseRouter {

    init() {

        this.get("/current", ["AUTH"], passportCall("jwt", { strategyType: "JWT" }), sessionsController.getCurrent);

        this.post("/register", ["NO_AUTH"], passportCall("register", { strategyType: "LOCALS" }), sessionsController.postRegister);

        this.post("/login", ["NO_AUTH"], passportCall("login", { strategyType: "LOCALS" }), sessionsController.postLogin);

        this.post("/passwordRestoreRequest", ["PUBLIC"], sessionsController.passwordRestoreRequest);

        this.put("/password-restore", ["PUBLIC"], sessionsController.restorePassword);

        // Se presenta ante la app
        this.get("/github", ["NO_AUTH"], passportCall("github", {strategyType: "OAUTH"}), sessionsController.postLoginGithub);

        // Trae la info del perfil
        this.get("/githubcallback", ["NO_AUTH"], passportCall("github", {strategyType: "OAUTH"}), sessionsController.postLoginGithubCallback);

        // Se presenta ante la app
        this.get("/google", ["NO_AUTH"], passportCall("google", {scope: ["profile", "email"], strategyType:"OAUTH"}), sessionsController.postLoginGoogle);

        // Trae la info del perfil
        this.get("/googlecallback", ["NO_AUTH"], passportCall("google", {strategyType: "OAUTH"}), sessionsController.postLoginGoogleCallback);

        this.get("/profile", ["AUTH"], passportCall("jwt", { strategyType: "JWT" }), sessionsController.getProfile);
        
        this.post("/logout", ["AUTH"], passportCall("jwt", { strategyType: "JWT" }), sessionsController.postLogout);
        
    }
}

const sessionRouter = new SessionRouter();

export default sessionRouter.getRouter();