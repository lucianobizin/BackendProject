import ErrorFactory from "../errors/ErrorFactory.js";

export const errorsHandler = async (error, next) => {

    console.log("ERROR NAME ---> ", error.name);
    console.log("ERROR MESSAGE ---> ", error.message);

    const { errorsDictionary, errorCodes } = await ErrorFactory.errorsHandler();

    const customError = new Error();

    let knownError;

    let errorKey;

    for (const key in errorsDictionary) {
        if (errorsDictionary[key][error.name]) {
            errorKey = key;
            knownError = errorsDictionary[errorKey][error.name];
            console.log("knownError ---> ", knownError)
        }
    }

    // const knowError = errorsDictionary[error.name]

    if (knownError) {

        customError.name = knownError,

        customError.message = error.message,

        customError.code = errorCodes[errorKey][knownError]

        customError.sendMail = true,

        console.log("customError ---> ", customError)

        next(customError);

    } else {

        next(error)

    }

}