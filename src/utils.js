import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from "bcrypt";

const createHash = async ( password ) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

const isValidPassword = async (user, password) => {
    return bcrypt.compareSync(password, user.password);
};

const cookieExtractor = (req) => {

    let token = null;
    
    if(req.cookies){
        token = req.cookies["authCookie"]
    }

    return token

}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export { __dirname, createHash, isValidPassword, cookieExtractor};