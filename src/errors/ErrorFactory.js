import config from "../config/config.js";

export default class ErrorFactory {

    static errorsHandler = async () => {

        let errorsDictionary = {};

        let errorCodes = {};

        let tempErrorsDictionary = (await import ("../dictionaries/errors/errors.js")).default;

        let tempErrorCodes = (await import ("../dictionaries/errors/errorsCodes.js")).default;

        errorsDictionary["REFERENCE"] = tempErrorsDictionary["REFERENCE"]

        errorCodes["REFERENCE"] = tempErrorCodes["REFERENCE"]

        console.log("errorsDictionary[REFERENCE] ---> ", errorsDictionary["REFERENCE"])
        console.log("errorCodes[REFERENCE] ---> ", errorCodes["REFERENCE"])

        switch(config.app.PERSISTENCE) {

            case "MONGO": {

                errorsDictionary["PERSISTENCE"] = tempErrorsDictionary["PERSISTENCE"]["MONGO"];
                console.log(errorsDictionary)

                errorCodes["PERSISTENCE"] = tempErrorCodes["PERSISTENCE"]["MONGO"]
                console.log(errorCodes)

                break;
            }

            case "FS": {

                errorsDictionary["PERSISTENCE"] = tempErrorsDictionary["PERSISTENCE"]["FS"];

                errorCodes["PERSISTENCE"] = tempErrorCodes["PERSISTENCE"]["FS"]

                break;
            }

        }

        return {errorsDictionary, errorCodes}

    }
}