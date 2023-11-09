import LoggerService from "../services/loggerService.js";
import config from "../config/config.js";

const logger = new LoggerService(config.app.ENV)

const attachLogger = async (req, res, next) => {

    req.logger = logger.logger;

    next()

}; 

export default attachLogger;