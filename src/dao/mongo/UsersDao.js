import usersModel from "./models/user.js";

export default class UsersDao{

    getBy = (param) => {
        return usersModel.findOne(param).lean();
    };

    create = async (param) => {
        const result = await usersModel.create(param);
        return result.toObject();
    };

    update = async (param, updateParam) => {
        return await usersModel.updateOne(param, updateParam);
    }

};