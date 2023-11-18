export default class UsersRepository {

    constructor(dao) {

        this.dao = dao;
    }

    // getUserBy(param){
    //     return this.dao.getUserBy(param);
    // }

    getUserBy(param){
        return this.dao.getBy(param);
    }

    createUser(newUser){
        return this.dao.create(newUser);
    }

    passwordUpdate = async (id,hashedpassword) =>{
        return await this.dao.update({ _id: id }, { $set: {password: hashedpassword} });
    }

    roleUpdate(uid, roleToUpdate){
        return this.dao.update({ _id: uid }, { $set: {role: roleToUpdate} });
    }

}