import {__dirname} from "../utils.js";

export default {
    welcome: {
        subject: "Welcome",
        attachments: [
            {
                filename: "banner.jpg",
                path: `${__dirname}/public/img/pexels-mo-eid-8347499.jpg`,
                cid: "banner"
            }
        ]
    },
    passwordrestore:{
        subject: "Reseting password",
        attachments: [
            {
                filename: "banner.jpg",
                path: `${__dirname}/public/img/pexels-mo-eid-11798029.jpg`,
                cid: "banner"

            }
        ]
    }
}