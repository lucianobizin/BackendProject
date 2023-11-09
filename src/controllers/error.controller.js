import ErrorFactory from "../errors/ErrorFactory.js";

export const errorsHandler = async (error, next) => {

    const { errorsDictionary, errorCodes } = await ErrorFactory.errorsHandler();

    const customError = new Error();

    let knownError;

    let errorKey;

    for (const key in errorsDictionary) {
        if (errorsDictionary[key][error.name]) {
            errorKey = key;
            knownError = errorsDictionary[errorKey][error.name];
        }
    }

    // const knowError = errorsDictionary[error.name]

    if (knownError) {

        customError.name = knownError,

        customError.message = error.message,

        customError.code = errorCodes[errorKey][knownError]

        customError.sendMail = true,

        next(customError);

    } else {

        next(error)

    }

}