import { Router } from "express";
import passportCall from "../middlewares/passportCall.js";
import executePolicies from "../middlewares/executePolicies.js";
import cartSetter from "../middlewares/cartSetter.js";

export default class BaseRouter {

    constructor() {
        this.router = Router();
        this.init();
    }

    init(){} // Util para todos los routers hijos

    getRouter() {
        return this.router;
    }

    get(path, policies,...callbacks){
        this.router.get(path, this.usingLogger, this.obtainingParamsQueries, this.generateCustomResposes, passportCall('jwt', { strategyType: 'JWT' }), cartSetter, executePolicies(policies), this.applyCallbacks(callbacks))
    }

    post(path, policies,...callbacks){
        this.router.post(path, this.usingLogger, this.obtainingParamsQueries, this.generateCustomResposes, passportCall('jwt', { strategyType: 'JWT' }), cartSetter, executePolicies(policies), this.applyCallbacks(callbacks))
    }

    put(path, policies,...callbacks){
        this.router.put(path, this.usingLogger, this.obtainingParamsQueries, this.generateCustomResposes, passportCall("jwt", { strategyType: "JWT" }), cartSetter, executePolicies(policies), this.applyCallbacks(callbacks))
    }

    delete(path, policies,...callbacks){
        this.router.delete(path, this.usingLogger, this.obtainingParamsQueries, this.generateCustomResposes, passportCall("jwt", { strategyType: "JWT" }), cartSetter, executePolicies(policies), this.applyCallbacks(callbacks))
    }

    usingLogger(req, res, next) {

        req.fatalLog =  (fatalMessage) => req.logger.fatal(`[FATAL] ---> ${fatalMessage}`);
        req.errorLog = (errorMessage) => req.logger.error(`[ERROR] ---> ${errorMessage}`);
        req.warningLog = (warningMessage) => req.logger.warning(`[WARNING] ---> ${warningMessage}`);
        req.httpLog = () => {
            const ip = req.connection.remoteAddress
            const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
            req.logger.http(`[HTTP] ---> email: ${req.user?.email ? req.user.email : null} - ${req.method} - ${ip} - ${fullUrl} - ${new Date().toLocaleTimeString()}`);
        }
        req.infoLog = (infoMessage) => req.logger.info(`[INFO] ---> ${infoMessage}`);

        next();

    }

    generateCustomResposes(req, res, next) {
        res.renderPage = (page, objects={}) => res.render(page, objects);
        res.redirectPage = (page) => res.redirect(page);
        res.sendSuccess = message_ => res.status(200).send({ status: "success", message: message_ });
        res.sendSuccessWithPayload = payload_ => res.status(200).send({ status: "success", payload: payload_ });
        res.sendBadRequest = error => res.status(400).send({status:"error", error: error})
        res.sendIncorrectParameters = error => res.status(400).send({ status: "error", error });
        res.sendUnauthorized = error => res.status(401).send({ status: "error", error });
        res.sendForbidden = error => res.status(403).send({ status: "error", error });
        res.sendPageDoesNotExist = error => res.status(404).send({ status: "error", error });
        res.sendInternalError = error => res.status(500).send({ status: "error", error });
        next();
    }

    obtainingParamsQueries(req, res, next) {

        // req.httpLog()

        const pid = /^[0-9a-zA-Z]+$/.test(req.params.pid) ? req.params.pid : "";
        const cid = /^[0-9a-zA-Z]+$/.test(req.params.cid) ? req.params.cid : "";
        const uid = /^[0-9a-zA-Z]+$/.test(req.params.uid) ? req.params.uid : "";
        const prodQuantity = isNaN(parseInt(req.query.quantity)) ? NaN : parseInt(req.query.quantity);

        if(pid){
            req.pid = pid;
        };

        if(cid){
            req.cid = cid;
        }

        if(prodQuantity){
            req.quantity = prodQuantity;
        }

        if(uid){
            req.uid = uid;
        }
        
        next();
    }

    applyCallbacks(callbacks) {

        return callbacks.map(callback => async (...params) => {

            try {

                await callback.apply(this, params); // Con this le paso el contexto de mi instancia de clase
            
            }
            
            catch (error) {
            
                params[1].sendInternalError(error);
            
            }

        })
        
    }

}