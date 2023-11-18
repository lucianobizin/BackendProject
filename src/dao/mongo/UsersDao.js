import usersModel from "./models/user.js";

export default class UsersDao{ // usersDao

    // getUserBy = (params) => {
    //     return usersModel.findOne(params).lean();
    // };

    getBy = (param) => {
        return usersModel.findOne(param).lean();
    };
    
    // createUser = (user) => {
    //     return usersModel.create(user);
    // };

    create = async (param) => {
        const result = await usersModel.create(param);
        return result.toObject();
    };

    update = async (param, updateParam) => {
        return await usersModel.updateOne(param, updateParam);
    }

};