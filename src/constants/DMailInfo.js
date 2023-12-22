import {__dirname} from "../utils.js";

export default {
    Welcome: {
        subject: "Welcome",
        attachments: [
            {
                filename: "banner.jpg",
                path: `${__dirname}/public/img/pexels-mo-eid-8347499.jpg`,
                cid: "banner"
            }
        ]
    },
    PasswordRestore:{
        subject: "Reseting password",
        attachments: [
            {
                filename: "banner.jpg",
                path: `${__dirname}/public/img/pexels-mo-eid-11798029.jpg`,
                cid: "banner"

            }
        ]
    },
    ProductDeletedByAdmin:{
        subject: "Product deleted by admin",
        attachments: [
            {
                filename: "banner.jpg",
                path: `${__dirname}/public/img/pexels-miguel-á-padriñán-2882553.jpg`,
                cid: "banner"

            }
        ]
    },
    ProductDeletedByPremium:{
        subject: "Product deleted by premium user",
        attachments: [
            {
                filename: "banner.jpg",
                path: `${__dirname}/public/img/pexels-miguel-á-padriñán-2882553.jpg`,
                cid: "banner"

            }
        ]
    },
    Purchase:{
        subject: "Purchase ticket info",
        attachments: [
            {
                filename: "banner.jpg",
                path: `${__dirname}/public/img/pexels-ron-lach-9603489.jpg`,
                cid: "banner"

            }
        ]
    },
    Error:{
        subject: "Error info"
    }
}