import nodemailer from "nodemailer";
import config from "../config/config.js";
import Handlebars from "handlebars";
import { __dirname } from "../utils.js";
import fs from "fs";
import DMailInfo from "../constants/DMailInfo.js";

export default class MailerService {

    constructor(){

        this.client = nodemailer.createTransport({
            service:"gmail",
            port:587,
            auth:{
                user: config.nodemailer.USER,
                pass: config.nodemailer.PWD
            }

        })
    }

    sendMail = async(emails, template, payload) => {
        const mailInfo = DMailInfo[template];
        const html = await this.generateMailTemplate(template, payload);
        const result = await this.client.sendMail({
            from: "AICommunity <email>",
            to: emails,
            html,
            ...mailInfo
        });
        return result;

    }

    generateMailTemplate = async (template, payload) => {
        const content = await fs.promises.readFile(`${__dirname}/templates/${template}.handlebars`, 'utf-8');
        const preCompiledContent = Handlebars.compile(content);
        const finalContent = preCompiledContent(payload);
        return finalContent;
    }

}