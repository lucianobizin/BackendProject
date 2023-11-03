import usersModel from "./models/user.js";

export default class UsersDao{ // usersDao

    // getUserBy = (params) => {
    //     return usersModel.findOne(params).lean();
    // };

    getBy = (param) => {
        console.log(param)
        return usersModel.findOne(param).lean();
    };
    
    // createUser = (user) => {
    //     return usersModel.create(user);
    // };

    create = (param) => {
        return usersModel.create(param);
    };

};